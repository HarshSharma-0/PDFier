import { Stack } from 'expo-router';
import {Modal,Pressable, PixelRatio , View , Text , StyleSheet , Dimensions } from 'react-native';
import React, { useRef, useState, useEffect} from 'react';
import Pdf from 'react-native-pdf';
import { BlurView } from 'expo-blur';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {getDocument , getDocumentName} from '../constants/DataAccess';
import ReorderImage from './Reorder';
import { RFPercentage} from "react-native-responsive-fontsize";
import * as ScreenOrientation from 'expo-screen-orientation';


const ViewTapView = (props) =>  {

  const [DocPaths, setDocPaths] = useState([]);
  const [DocName,setDocName] = useState([]);
  const [ FlexVal,setFlexVal] = useState([]);
  const [modalVisible, setModalVisible] = useState(true);
  const [pick,setPick] = useState(false);
  const [selected,setSelected] = useState(0);
  const [isLandScape,setLandScape] = useState(false);

const setPortraitOrientation = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  };

  const setLandscapeOrientation = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  };

  const unlockOrientation = async () => {
    await ScreenOrientation.unlockAsync();
  };

const TruncatedText = ({ originalText, maxLength }) => {
  const truncatedText = originalText.length > maxLength
    ? `${originalText.slice(0, maxLength)}...`
    : originalText;

  return (
   <Text style={{ alignSelf:'center',color:'white',backgroundColor:'transparent'}}>{truncatedText}</Text>
  );
};


useEffect(() => {
if(props.ViewData.length > 0 ){
  const Paths = props.ViewData.map((isData, index) => (
   isData.uri
));
   const Name = props.ViewData.map((isData, index) => (
   isData.fileName
));
   setDocPaths(Paths);
   setDocName(Name);
   const initialFlexVal = Array(Paths.length).fill(false);
    initialFlexVal[0] = true;
    initialFlexVal[1] = true;
    setFlexVal(initialFlexVal);

} else {
  const result = getDocument();
       setDocPaths(result);
  const resultName = getDocumentName();
       setDocName(resultName);
  const initialFlexVal = Array(result.length).fill(false);
    initialFlexVal[0] = true;
    initialFlexVal[1] = true;
    setFlexVal(initialFlexVal);
}
    setModalVisible(true);
 }, []);

const handleSingleTap = (index) => {

  const NewFlexArray = [...FlexVal];
  let ArrayLength = (NewFlexArray.length - 1);
  NewFlexArray[index] = false;
          if(index === ArrayLength){
               if( NewFlexArray[0] === false){
                   NewFlexArray[0] = true;
                }else if (NewFlexArray[1] == false){ NewFlexArray[1] = true; }

           }
          else if( index === (ArrayLength - 1)){
                  if( NewFlexArray[index+1] === false){
                   NewFlexArray[index+1] = true;
                }else if (NewFlexArray[0] == false){ NewFlexArray[0] = true; }
          }else{
             if( NewFlexArray[index+1] === false){
                   NewFlexArray[index+1] = true;
                }else if (NewFlexArray[index+2] == false){ NewFlexArray[index+2] = true; }

         }

 setFlexVal(NewFlexArray);
 };


      return (
<Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setDocPaths([]);
          setDocName([]);
          setPortraitOrientation();
          props.Close(false);
          setModalVisible(!modalVisible);
        }}>

 {pick ? <ReorderImage PdfData={DocPaths}  up={FlexVal} down={setFlexVal} close={setPick} open={pick}  indexSlected={selected} isOrient={isLandScape} setIndexSelected={setSelected}/>  : null }

<BlurView intensity={20} tint="dark" style={{flex:1,flexDirection: isLandScape ? 'row' : 'coloumn' , gap:isLandScape ? RFPercentage(0.5) : 0 }}>
    {DocPaths.map((docPath, index) => (
      <View style={ FlexVal[index] ? styles.visible : styles.hidden } key={index}>
  <View style={{flex:0.05,flexDirection:'row',justifyContent:'space-evenly'}}>
   <View style={{flex:0.8}}>
       <Pressable style={{flexDirection:'row',justifyContent:'space-between'}}
          onPress={()=>{
        if(isLandScape === false){
          setLandscapeOrientation();
          setLandScape(true);
}else{
           setPortraitOrientation();
            setLandScape(false);
}
          }}>
            <FontAwesome
              size={RFPercentage(2.5)}
              style={{marginLeft:RFPercentage(0.5)}}
              name="rotate-left"
              color = "grey"
            />
        <Text style={{ alignSelf:'center',color:'rgba(0,0,0,0.5)',backgroundColor:'transparent'}}>RotateView</Text>
    </Pressable>
</View>
   <View style={{flex:2}}>
   <TruncatedText originalText={DocName[index]} maxLength={20} />
   </View>
   <View style={{flex:1}}>
       <Pressable onPress={async ()=>{
        await setSelected(index);
              setPick(true);
       }}
style={{flexDirection:'row',justifyContent:'space-between'}}
>
            <FontAwesome
              size={RFPercentage(2.5)}
              style={{marginLeft:RFPercentage(0.5)}}
              name="exchange"
              color = "grey"
            />
        <Text style={{ alignSelf:'center',color:'rgba(0,0,0,0.5)',backgroundColor:'transparent'}}>ExchangePdf</Text>
       </Pressable>
   </View>
</View>
        <Pdf
          trustAllCerts={false}
          source={{ uri: docPath.toString(), cache: false }}
          onPageSingleTap={() => {
            handleSingleTap(index);
          }}
          style={styles.pdfVisible}
        />
      </View>
    ))}
</BlurView>
</Modal>
);

};
const styles = StyleSheet.create({
  visible: {
    flex:1,
    display:'flex',
  },
  hidden: {

    height:"50%",
    width:"100%",
    position:'absolute',
    marginTop:100000,
  },
pdfVisible:{
    flex: 1,
    alignSelf:'stretch',
    backgroundColor: 'transparent',
  },

});


export default ViewTapView;
