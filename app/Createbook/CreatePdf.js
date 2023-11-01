import React, { useState,useEffect,useRef } from 'react';
import {Animated,Easing, Modal,Text, View, StyleSheet, TextInput , Dimensions , Pressable , FlatList } from 'react-native';
import { RFPercentage} from "react-native-responsive-fontsize";
import { setBookName , Add_Book , name_list} from '../constants/DataAccess';
import Pdf from 'react-native-pdf';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import {Image} from 'expo-image';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import PagerView from 'react-native-pager-view';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { MaterialIcons } from '@expo/vector-icons';
import {GestureHandlerRootView,State,PanGestureHandler} from 'react-native-gesture-handler';
import {get_PdfGenerated} from './ImgQuery';



const Createpdf = (props) => {

  let rotate_array = ["0deg","90deg","180deg","270deg","360deg"];
  const  height  = Dimensions.get('window').height;
  const [textVal, onChangeText] = useState(' ');
  const [modalVisible, setModalVisible] = useState(true);
  const [show,setshow] = useState(true);
  const [More,setMore] = useState(false);
  const BlurAnim = useRef(new Animated.Value(0)).current;
  const [open,setopen] = useState(0);
  const [hasGalleryPermission,setGalleryPermission] = useState(null);
  const [ImagePath, setImagePath] = useState ([]);
  const [ editPath , setEditPath ] = useState(" ");
  const [ deg, setDeg] = useState(0)
  const [ tX , sTX ] = useState(1);
  const [ tY , sTY ] = useState(1);
  const [crop,setCrop] = useState(false);
  const [ disp ,setDisp ] = useState(true);
  const [back,setBack] = useState({height:"100%",width:"100%"});
  const [CropDimensions, setCropDimensions] = useState({ width: 0, height: 0 });
  const [container,setContainer] =  useState({ Width: 0, Height: 0 });
  const [midThreshwidth, setMidThreshwidth] = useState(0);
  const [imgDim,setImgDim] = useState({width:0,height:0});
  const Cropheight = useRef(new Animated.Value(0)).current;
  const Cropwidth = useRef(new Animated.Value(0)).current;
  const CropLeft = useRef(new Animated.Value(0)).current;
  const CropTop = useRef(new Animated.Value(0)).current;
  const CropBottom = useRef(new Animated.Value(0)).current;
  const CropRight = useRef(new Animated.Value(0)).current;

let initialX = 0;
let initialY = 0;
let upperThresh = 0;
let lowerThresh = 0;
let trueVal = 0;
let layVal = 1;
let heightScale = 0;
let RawScale = 0;
let perc = 0;
let IndexToinsert = 0;

const OnLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setContainer({Width:width,Height:height});
  };

const onStateChange = ({ nativeEvent }) => {
if (nativeEvent.state === State.END) {

}

if (nativeEvent.state === State.BEGAN) {
}
};

const onPanGestureEventUp = ({ nativeEvent }) => {
  initialX = nativeEvent.absoluteX;
  initialY = nativeEvent.absoluteY;
  upperThresh = ((container.Height + 40) - CropDimensions.height ) / 2 ;
  lowerThresh =(container.Height-upperThresh);
  heightScale = lowerThresh - upperThresh;
  RawScale = initialY - upperThresh;
  perc = RawScale/ heightScale;
  trueVal = CropDimensions.height * perc;
  const translationY = nativeEvent.translationY;
  const get = CropBottom.__getValue();
  let water = trueVal/CropDimensions.height;
  let act = CropDimensions.height * water;
  let final = CropDimensions.height - act;
  let total = final > get ? final - get : get - final;
  let stop = ((total/CropDimensions.height) * CropDimensions.height);


if(stop <= 100){

}else{

   if(initialY <= lowerThresh && initialY > upperThresh  ){
Animated.timing(Cropheight, {
    toValue: total,
    duration: 5,
    easing: Easing.linear,
    useNativeDriver: false,
  }).start();
  Animated.timing(CropTop, {
    toValue: act,
    duration: 5,
    easing: Easing.linear,
    useNativeDriver: false,
  }).start();
}
}
};

const onPanGestureEventDown = ({ nativeEvent }) => {
  initialX = nativeEvent.absoluteX;
  initialY = nativeEvent.absoluteY;
  upperThresh = ((container.Height + 40) - CropDimensions.height ) / 2;
  lowerThresh =(container.Height-upperThresh);
  heightScale = lowerThresh - upperThresh;
  RawScale = initialY - upperThresh;
  perc = RawScale/ heightScale;
  trueVal = CropDimensions.height * perc;
  const get = CropTop.__getValue();
  let water = trueVal/CropDimensions.height;
  let act = CropDimensions.height * water - get;
  let final = CropDimensions.height - act;
  let total = final > get ? final - get : get - final;

if(act <= 100){}else{
   if(initialY <= lowerThresh && initialY > upperThresh ){

        Animated.timing(Cropheight, {
           toValue: act,
           duration: 10,
           easing: Easing.linear,
           useNativeDriver: false,
          }).start();
          Animated.timing(CropBottom, {
           toValue: total > CropDimensions.height ? CropDimensions.height : total ,
           duration: 10,
           easing: Easing.linear,
           useNativeDriver: false,
          }).start();
}
}
};

const onPanGestureEventRight = ({ nativeEvent }) => {
  initialX = nativeEvent.absoluteX;

  upperThresh = ((container.Width - 40) - CropDimensions.width ) ;
  lowerThresh =(container.Width-upperThresh);
  heightScale = lowerThresh - upperThresh;
  RawScale = initialX - upperThresh;
  perc = RawScale/ heightScale;
  trueVal = CropDimensions.width * perc;
  const get = CropLeft.__getValue();;
  let water = trueVal/CropDimensions.width;
  let act = CropDimensions.width * water - get;
  let final = CropDimensions.width - act;
  let total = final > get ? final - get : get - final;


  if(trueVal < 100){ }else{
   if(initialX <= lowerThresh && initialX > upperThresh ){
Animated.parallel([
  Animated.timing(Cropwidth, {
    toValue: act,
    duration: 1,
    easing: Easing.linear,
    useNativeDriver: false,
  }),
  Animated.timing(CropRight, {
    toValue:  total > CropDimensions.width ? CropDimensions.width : total ,
    duration: 1,
    easing: Easing.linear,
    useNativeDriver: false,
  }),
]).start();
}
}
};
const onPanGestureEventLeft = ({ nativeEvent }) => {
  initialX = nativeEvent.absoluteX;

  upperThresh = ((container.Width + 40) - CropDimensions.width )  ;
  lowerThresh =(container.Width-upperThresh);
  heightScale = lowerThresh - upperThresh;
  RawScale = initialX - upperThresh;
  perc = RawScale/ heightScale;
  trueVal = CropDimensions.width * perc;
  const get = CropRight.__getValue();
  let water = trueVal/CropDimensions.width;
  let act = CropDimensions.width * water;
  let final = CropDimensions.width - act;
  let total = final > get ? final - get : get - final;
  let stop = ((total/CropDimensions.width) * CropDimensions.width);

  if(stop < 100){  }else{

   if(initialX <= lowerThresh && initialX > upperThresh ){

     Animated.parallel([
  Animated.timing(Cropwidth, {
    toValue: total,
    duration: 1,
    easing: Easing.linear,
    useNativeDriver: false,
  }),
Animated.timing(CropLeft, {
    toValue: act,
    duration: 1,
    easing: Easing.linear,
    useNativeDriver: false,
  }),
]).start();
}
}
};

function rotate_plus(){

  if (deg === 4) {
    setDeg(0);
  } else {
    setDeg(deg+1);
  }
ret_height();
};

function rotate_neg(){
if(deg === 0) { setDeg(4); }
else{setDeg(deg-1); }
ret_height();
};
/*
async function set_edit(data){
  const index = data.indexReport;
  const objectToUpdate = data;
  const newArray = [...ImagePath];
  newArray[index] = objectToUpdate;
  let Thresh = await get_PdfGenerated(newArray);
  setImagePath(newArray);
};
*/
function set_edit(data,base) {
  return new Promise(async (resolve, reject) => {
    try {
      const index = data.indexReport;
      const objectToUpdate = data;
      const newArray = [...ImagePath];
      newArray[index] = objectToUpdate;
      setImagePath(newArray);

      // Generate the PDF
      let Thresh = await get_PdfGenerated(newArray);

      // Update the state with the modified array

      // If everything is successful, resolve the Promise
      resolve(Thresh);
    } catch (error) {
      // If there's an error, reject the Promise
      reject(error);
    }
  });
}
const pickImage = async () => {
     setImagePath([]);
     setEditPath([]);
     let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         quality: 1,
         allowsMultipleSelection: true,
         base64:true,
    });

  if(!result.canceled){
      const ImageList = result.assets.map((assets ,index) => ({
  uri: assets.uri,
  height: assets.height,
  width: assets.width,
  indexReport:index,
}));

      setImagePath(ImageList);
      setshow(false);

    }
};

const Final_Output = async () => {

const PadTop = CropTop.__getValue();
const PadLeft = CropLeft.__getValue();
const Padwidth = Cropwidth.__getValue();
const Padheight = Cropheight.__getValue();
const input = editPath.uri.toString();

const manipResult = await manipulateAsync(
        input,
      [
    { crop: { originX: ((PadLeft/CropDimensions.width) * editPath.width),
              originY: ((PadTop/CropDimensions.height) * editPath.height),
              width:((Padwidth/CropDimensions.width) * editPath.width),
              height:((Padheight/CropDimensions.height) * editPath.height),
        }}
         ],
      { compress: 1, format: SaveFormat.PNG , base64:true}
    );

     const updatedManipResult = { ...manipResult, indexReport: editPath.indexReport };
     setEditPath(updatedManipResult);
     await set_edit(updatedManipResult,manipResult.base64);

};

function Cancle(){
setModalVisible(false);
props.updateValue(false);
};
function OK(){
setModalVisible(false);
props.updateValue(false);
};

function ret_height(){

if(deg === '90deg' || deg === '270deg'){
 setBack({height:"50%",width:"100%"});
}else{ setBack({height:"100%",width:"100%"});}
};

useEffect(() => {

  Animated.timing(BlurAnim, {
    toValue: 1,
    duration: 1000,
    easing: Easing.linear,
    useNativeDriver: false,
  }).start();

    (async () => {
    const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setGalleryPermission(galleryStatus.status === 'granted');
    })();


  }, []);

  return (
   <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          props.updateValue(false);
        }}>
 <Animated.View style={{flex:1, opacity:BlurAnim}}>
<BlurView intensity={20} tint="dark" style={{flex:1 }}>
   <View style={{flex:1}}>

    <View style={styles.Create}>
      <Text style={styles.headtext}>Create Your PDF</Text>
    <View style={{flexDirection:'row', justifyContent:'space-between',width:'100%'}}>
   <Text style={{fontSize:RFPercentage(2),color:'white', fontWeight:'bold'}}> PDF Name :-</Text>
      <TextInput
        editable
        maxLength={20}
        onChangeText={(text) => onChangeText(text)}
        placeholder="Name your book"
        style={styles.Input}
      />
  </View>
</View>



<View style={{flex:3 ,}}>
<Text style={{alignSelf:'center',fontWeight:'bold',color:'white',
    fontSize:RFPercentage(5)}}> Added Images </Text>
        <PagerView style={styles.viewPager} initialPage={0}>
 { ImagePath ? ImagePath.map((path, index) => (
    <View key={index} style={{ flex: 1, margin: 10, borderRadius: 10, overflow: 'hidden', borderWidth: 1 }}>
        <Pressable
    delayLongPress={150}
    onLongPress={() => { setEditPath(path);
    setMore(true);

    }}
    style={{flex:1}}>
   <Image
        style={{height:'100%',width:'100%',}}
        source={path.uri.toString()}
        contentFit="contain"
        transition={500}
      />
  <Text> {path.uri} </Text>
</Pressable>
 </View>

)) : null}
        </PagerView>
</View>

{show ?
<View style={{flex:0.8 ,justifyContent:'center',alignItems:'center'}}>
        <Pressable onPress = {() => pickImage()} style={[styles.Add,{borderColor:props.color}]}>
          <Text style={{ fontSize:RFPercentage(1.5), color: props.color, fontWeight: 'bold' }}>Add Images</Text>
        </Pressable>
</View> : null}


      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
        <Pressable onPress = {() => Cancle()} style={styles.Cancle}>
          <Text style={{ fontSize:RFPercentage(2.5), color: 'white', fontWeight: 'bold' }}>CANCLE</Text>
        </Pressable>

        <Pressable onPress = {() => OK() } style={styles.Save}>
          <Text style={{fontSize:RFPercentage(2.5), color: 'white', fontWeight: 'bold', color: 'white' }}>SAVE</Text>
        </Pressable>

      </View>
   </View>

{More ?
<Modal animationType="fade" transparent={true} visible={More}
 onRequestClose={() => {
          setMore(!More);
          setDeg(0);
          setDisp(true);
          setCrop(false);

}}>
<BlurView intensity={20} tint="dark" style={{flex:1 ,padding:20}}>
  <View style={{overflow:'hidden',flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}} onLayout={OnLayout}>

{crop ?
<>
  <Image
        style={{ height: "100%" , width:"100%",transform: [{ scaleY: tY },{scaleX:tX}, { rotate: rotate_array[deg] }],}}
        source={editPath.uri.toString()}
        contentFit="contain"
        transition={100}
        onLoad = {(data) => {
       setImgDim({ width:data.source.width, height:data.source.height});
       const widthScale = container.Width / data.source.width;
       const heightScale = container.Height / data.source.height;
       const minScale = widthScale < heightScale ? widthScale : heightScale ;
       const containedWidth = data.source.width * minScale;
       const containedHeight = data.source.height * minScale;

       setCropDimensions({ width: containedWidth, height: containedHeight });

CropLeft.setValue(0);
CropTop.setValue(0);
CropBottom.setValue(0);
CropRight.setValue(0);

Animated.parallel([
  Animated.spring(Cropheight, {
    toValue: containedHeight,
    duration: 500,
    easing: Easing.linear,
    useNativeDriver: false,
  }),
  Animated.spring(Cropwidth, {
    toValue: containedWidth,
    duration: 500,
    easing: Easing.linear,
    useNativeDriver: false,
  }),
]).start();
      }}
      />

 <View style={{height:CropDimensions.height,width:CropDimensions.width,position:'absolute',backgroundColor:'transparent',}}>

 <Animated.View style={{height:Cropheight ,width:Cropwidth, backgroundColor:'transparent', marginTop:CropTop,marginLeft:CropLeft,marginBottom:CropBottom,marginRight:CropRight}}>

 <View style={{flex:1,flexDirection:'row'}}>
 <View style={{flex:1, borderWidth: 1, borderColor:'black'}}/>
 <View style={{flex:1, borderTopWidth: 1,borderBottomWidth:1, borderColor:'black',alignItems:'center'}}>

<GestureHandlerRootView>
 <PanGestureHandler onGestureEvent={onPanGestureEventUp} onHandlerStateChange={onStateChange}>
 <View style={{flex:1 , alignItems:'center'}}>
            <FontAwesome
              size={RFPercentage(4)}
              style={{ }}
              name="arrow-circle-down"
              color = {crop ? '#00ff3d' : 'black'}
            />
</View>
</PanGestureHandler>
</GestureHandlerRootView>

</View>
 <View style={{flex:1, borderWidth: 1, borderColor:'black'}}/>
 </View>

 <View style={{flex:1, flexDirection:'row'}}>
 <View style={{flex:1, borderLeftWidth: 1, borderColor:'black'}}>
 <View  style={{flex:1 , justifyContent:'center'}}>
 <GestureHandlerRootView>

   <PanGestureHandler onGestureEvent={onPanGestureEventLeft} onHandlerStateChange={onStateChange}>
            <FontAwesome
              size={RFPercentage(4)}
              style={{ }}
              name="arrow-circle-right"
              color = {crop ? '#00ff3d' : 'black'}
            />
   </PanGestureHandler>
</GestureHandlerRootView>

  </View>

</View>
 <View style={{flex:1 ,borderLeftWidth: 1}}/>
 <View style={{flex:1, borderLeftWidth: 1,borderRightWidth:1, borderColor:'black'}}>
 <View  style={{flex:1,alignItems:'center',flexDirection:'row-reverse'}}>
 <GestureHandlerRootView>
   <PanGestureHandler onGestureEvent={onPanGestureEventRight} onHandlerStateChange={onStateChange}>
            <FontAwesome
              size={RFPercentage(4)}
              style={{ }}
              name="arrow-circle-left"
              color = {crop ? '#00ff3d' : 'black'}
            />
   </PanGestureHandler>
</GestureHandlerRootView>

  </View>
 </View>
</View>



 <View style={{flex:1,flexDirection:'row'}}>

 <View style={{flex:1, borderWidth: 1, borderColor:'black'}}/>
 <View style={{flex:1, borderBottomWidth:1,borderTopWidth:1, borderColor:'black'}}>
 <View onPress = {() => {alert("pressed");}} style={{flex:1 , alignItems:'center',justifyContent:'flex-end'}}>
 <GestureHandlerRootView>

   <PanGestureHandler onGestureEvent={onPanGestureEventDown} onHandlerStateChange={onStateChange}>
            <FontAwesome
              size={RFPercentage(4)}
              style={{ }}
              name="arrow-circle-up"
              color = {crop ? '#00ff3d' : 'black'}
            />
   </PanGestureHandler>
</GestureHandlerRootView>

  </View>

 </View>
 <View style={{flex:1, borderWidth: 1, borderColor:'black'}}/>

 </View>
 </Animated.View>

</View>
</>

 : null}

{disp ?

  <Image
        style={{ height: "51%" , width:"100%", transform: [{ scaleY: tY },{scaleX:tX}, { rotate: rotate_array[deg] }],}}
        source={editPath.uri.toString()}
        contentFit="contain"
        transition={500}
      />

 : null }

    </View>
<View style={{flex:0.1,borderWidth:1,flexDirection:'row',borderRadius:RFPercentage(1),borderColor:props.color}}>
 <Pressable onPress = {() => {  if(crop === true){ Final_Output(); } setDisp(!disp); setCrop(!crop);}} style={{flex:1 , alignItems:'center',justifyContent:'center'}}>
            <FontAwesome
              size={RFPercentage(4)}
              style={{ }}
              name="crop"
              color = {crop ? '#00ff3d' : 'black'}
            />
  </Pressable>
 <Pressable onPress = {() => sTY(tY === 1 ? -1 : 1)} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <MaterialIcons name="flip" size={RFPercentage(4)} color="black" style={{transform: [{ rotate:'90deg' }]}}/>
  </Pressable>
 <Pressable onPress = {() => sTX(tX === 1 ? -1 : 1)} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <MaterialIcons name="flip" size={RFPercentage(4)} color="black" />
  </Pressable>
 <Pressable onPress = {() => rotate_neg() } style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                 <FontAwesome
              size={RFPercentage(4)}
              style={{ }}
              name="rotate-left"
              color="black"
            />
  </Pressable>
 <Pressable onPress = {() => {rotate_plus();}} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                 <FontAwesome
              size={RFPercentage(4)}
              style={{ }}
              name="rotate-right"
              color="black"
            />
  </Pressable>
</View>
</BlurView>
</Modal>
 : null }

</BlurView>
  </Animated.View>
    </Modal>

  );
};

const styles = StyleSheet.create({
  Create: {
    top:'5%',
    width:'100%',
    display:'flex',
    flex:0.8,
    gap:20,

  },
  headtext: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    color: 'white',
  },
  Input: {
    width: '60%',
  },
  Save: {
    width: '40%',
    height: '40%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#4bff11',
    borderWidth: 1,
    backgroundColor: '#77fe96',
  },
  Cancle: {
    width: '40%',
    height: '40%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff666a',
    borderWidth: 1,
    borderColor: 'red',
  },

  Add: {
    width: '20%',
    height: '70%',
    backgroundColor:'white',
    borderRadius: RFPercentage(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    elevation:10,
  },

viewPager: {
    flex: 1,
  },

});

export default Createpdf;

