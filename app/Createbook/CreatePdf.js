import React, { useState,useEffect,useRef } from 'react';
import {Animated,Easing, Modal,Text, View, StyleSheet, TextInput  , Pressable , Alert,FlatList} from 'react-native';
import { RFPercentage} from "react-native-responsive-fontsize";
import {share_will_proceed, setBookName , Add_Book , name_list} from '../constants/DataAccess';
import Pdf from 'react-native-pdf';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import {Image} from 'expo-image';
import PagerView from 'react-native-pager-view';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { MaterialIcons } from '@expo/vector-icons';
import {get_PdfGenerated} from './ImgQuery';
import ReorderImage from './Reorder';
import PhotoEditor from 'react-native-photo-editor'
import RNFS from 'react-native-fs';
import uuid from 'uuid';
import * as FileSystem from 'expo-file-system';

const Createpdf = (props) => {


  const [textVal,setTextVal] = useState("");
  const [modalVisible, setModalVisible] = useState(true);
  const [pick, setPick] = useState(false);
  const BlurAnim = useRef(new Animated.Value(0)).current;
  const [ImagePath, setImagePath] = useState (null);
  const [recycle , setRecycle] = useState("0");




const pickImage = async () => {
     let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         quality: 1,
         capture: true,
         allowsMultipleSelection: true,
    });

  if(!result.canceled){
      const ImageList = result.assets.map((assets ,index) => {
const item = {
  uri: assets.uri,
  height: assets.height,
  width: assets.width,
  indexReport:index,
  token:false,
};
return item;
});

if(ImagePath === null){
      setImagePath(ImageList);
}else{
     setImagePath([...ImagePath,...ImageList]);
}
    }
};

const renameFile = async (oldPath, newPath) => {
  try {
    await RNFS.moveFile(oldPath, newPath);
  } catch (error) {
  }
};


function extractExtension(filename) {
  const parts = filename.split('.');
  return parts[parts.length - 1];
}

function Cancle(){
share_will_proceed(1);
setImagePath(null);
setModalVisible(false);
props.updateValue(false);
};


async function OK() {
  if (!textVal || textVal.trim() === "") {
    // If textVal is not entered
    alert('Please enter the name of PDFs.');
    return;
  } else if (ImagePath === null && textVal) {
    // If ImagePath is null or empty
    alert('Please add images to create PDFs.');
    return;
  } else {
    // Proceed with creating PDF
    setModalVisible(false);
    props.updateValue(false);
    const exit = await get_PdfGenerated(ImagePath, textVal, props.parentHook ,props.AreYouBusy);
    if (exit === true) {
     return;
    } else {
      alert("Retry: Build failed");
      return;
    }
  }
}



useEffect(() => {

  Animated.timing(BlurAnim, {
    toValue: 1,
    duration: 1000,
    easing: Easing.linear,
    useNativeDriver: false,
  }).start();


const retDat = share_will_proceed(2);
if(retDat.length > 0){
      setImagePath(retDat);
}
  }, []);


  return (
   <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          share_will_proceed(1);
          setModalVisible(!modalVisible);
          props.updateValue(false);
        }}>

 <Animated.View style={{flex:1, opacity:BlurAnim}}>
<BlurView intensity={20} tint="dark" style={{flex:1 }}>

 {pick ? <ReorderImage isOrient={false} ImageData={ImagePath} setData={setImagePath} up={pick} down={setPick} /> : null}

   <View style={{flex:1}}>

    <View style={styles.Create}>
      <Text style={styles.headtext}>Create Your PDF</Text>
    <View style={{flexDirection:'row', justifyContent:'space-between',width:'100%'}}>
   <Text style={{fontSize:RFPercentage(2),color:'white', fontWeight:'bold'}}> PDF Name :-</Text>
      <TextInput
        editable
        maxLength={20}
        onChangeText = {(text) => setTextVal(text)}
        placeholder="Name your Pdf"
        style={styles.Input}
      />
  </View>
</View>

{ImagePath && (<Pressable
style={{
flexDirection:'row',
alignItems:'center',
}}
onPress={()=> {
setPick(true);
}}
>
            <FontAwesome
              size={RFPercentage(3)}
              style={{marginLeft:RFPercentage(1)}}
              name="exchange"
              color = "rgba(255,0,0,0.5)"
            />
     <Text style={{fontSize:RFPercentage(2) ,marginLeft:RFPercentage(1), color:'grey'}}> Reorder </Text>
     <Text style={{fontSize:RFPercentage(2) ,marginLeft:RFPercentage(1), color:'rgba(0,0,0,0.7)'}}> LongPress on Image to Edit </Text>

</Pressable> )}

        <PagerView style={styles.viewPager} orientation='vertical' >
 { ImagePath ? ImagePath.map((Path, index) => (
    <View key={index} style={{ marginTop:'4%',height:"100%",width:'100%',justifyContent:'center',alignItems:'center', overflow: 'hidden' ,backgroundColor:'transparent',backgroundColor:'transparent'}}>
    <View style={{ height:"100%",width:'90%',padding:RFPercentage(2), overflow: 'hidden' ,backgroundColor:'white',}}>
        <Pressable
    delayLongPress={150}
    onLongPress={async() => {
    const copiedData = [...ImagePath];
    const cleanedUri = await Path.uri.replace(/^file:\/\//, '');
    const ext = extractExtension(cleanedUri);
    PhotoEditor.Edit({
    path: cleanedUri,
    onDone: (async() => {
       const Unique = `${FileSystem.cacheDirectory}${uuid()}.${ext}`;
       await renameFile(cleanedUri, Unique);
       copiedData[index].uri = Unique;
       setImagePath(copiedData);
      }),
    onCancel: () => {
      },
    hiddenControls: [ 'clear', 'save' , 'share' ],
    });
    }}

    style={{flex:1}}>
   <Image
        style={{height:'95%',width:'100%'}}
        source={Path.uri.toString()}
        contentFit="contain"
        transition={500}
      />
</Pressable>
 </View>
 </View>

)) : null}
        </PagerView>
<View style={{flex:0.2 ,justifyContent:'center',alignItems:'center'}}>
        <Pressable onPress = {() => {
        pickImage();
}} style={[styles.Add,{borderColor:props.color}]}>
          <Text style={{ fontSize:RFPercentage(1.5), color: props.color, fontWeight: 'bold' }}>Add Images</Text>
        </Pressable>
</View>
      <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
        <Pressable onPress = {() => Cancle()} style={styles.Cancle}>
          <Text style={{ fontSize:RFPercentage(2.5), color: 'white', fontWeight: 'bold' }}>CANCLE</Text>
        </Pressable>

        <Pressable onPress = {() => OK() } style={styles.Save}>
          <Text style={{fontSize:RFPercentage(2.5), color: 'white', fontWeight: 'bold', color: 'white' }}>SAVE</Text>
        </Pressable>

      </View>
</View>
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
    flex: 2,
  },

});

export default Createpdf;
