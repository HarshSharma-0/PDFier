import React, { useState,useEffect,useRef } from 'react';
import {ImageBackground,Animated,Easing, Modal,Text, View, StyleSheet, TextInput , Dimensions , Pressable , FlatList } from 'react-native';
import { RFPercentage} from "react-native-responsive-fontsize";
import { setBookName , Add_Book , name_list} from '../(tabs)/DataAccess';
import Pdf from 'react-native-pdf';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import {Image} from 'expo-image';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import PagerView from 'react-native-pager-view';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { MaterialIcons } from '@expo/vector-icons';
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
  const [ positionCrop , setpositionCrop ] = useState(null);
  const [ disp ,setDisp ] = useState(true);
  const [back,setBack] = useState({height:"100%",width:"100%"});


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

  const pickImage = async () => {
     let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         quality: 1,
         allowsMultipleSelection: true,
    });

  if(!result.canceled){
      const ImageList = result.assets.map((assets ,index) =>  assets.uri  );
      setImagePath(ImageList);
      setshow(false);

    }
};

const Final_Output = async () => {
    const manipResult = await manipulateAsync(
       editPath,
      [{ rotate: deg }, { flip: FlipType.Vertical }],
      { compress: 1, format: SaveFormat.PNG }
    );

    setEditPath(manipResult);
    console.log(manipResult);
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
 {ImagePath.map((path, index) => (
    <View key={index} style={{ flex: 1, margin: 10, borderRadius: 10, overflow: 'hidden', borderWidth: 1 }}>
        <Pressable
    delayLongPress={150}
    onLongPress={() => { setEditPath(path);
    setMore(true);
    }}
    style={{flex:1}}>
   <Image
        style={{height:'100%',width:'100%',}}
        source={path.toString()}
        contentFit="contain"
        transition={500}
      />
</Pressable>
 </View>

))}
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
  <View style={{overflow:'hidden',flex:1, alignItems:'center',justifyContent:'center'}}>
{crop ? <ImageBackground
        style={{ height:back.height , width:back.width, transform: [{ scaleY: tY },{scaleX:tX}, { rotate: rotate_array[deg] }],marginBottom:15}}
        resizeMode = "contain"
        source={{uri:editPath}}
      >
<View style={{flex:1,borderWidth:1,opacity:0}} />
  </ImageBackground> : null}

{disp ? <Image
        style={{ height: "51%" , width:"100%", transform: [{ scaleY: tY },{scaleX:tX}, { rotate: rotate_array[deg] }],}}
        source={editPath}
        contentFit="contain"
        transition={500}
      /> : null }

    </View>
<View style={{flex:0.1,borderWidth:1,flexDirection:'row',borderRadius:RFPercentage(1),borderColor:props.color}}>
 <Pressable onPress = {() => { setDisp(!disp); setCrop(!crop);}} style={{flex:1 , alignItems:'center',justifyContent:'center'}}>
            <FontAwesome
              size={RFPercentage(4)}
              style={{ }}
              name="crop"
              color= "black"
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

