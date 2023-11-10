import { Stack } from 'expo-router';
import {Modal, PixelRatio , View , Text , StyleSheet , Dimensions } from 'react-native';
import React, { useRef, useState, useEffect} from 'react';
import Pdf from 'react-native-pdf';
import { BlurView } from 'expo-blur';
import {useMidHook} from "../constants/useMidHook";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {getDocument , getDocumentName} from '../constants/DataAccess';


const ViewTapView = (props) =>  {

  const [DocPaths, setDocPaths] = useState([]);
  const [DocName,setDocName] = useState([]);
  const [ FlexVal,setFlexVal] = useState([]);
  const [modalVisible, setModalVisible] = useState(true);
  let Counter = 0;


useEffect(() => {
if(props.ViewData !== null ){

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
          props.Close(false);
          setModalVisible(!modalVisible);
        }}>
<BlurView intensity={20} tint="dark" style={{flex:1}}>
    {DocPaths.map((docPath, index) => (
      <View style={ FlexVal[index] ? styles.visible : styles.hidden } key={index}>
        <Text style={{ alignSelf:'center',color:'white',backgroundColor:'transparent'}}>{DocName[index]}</Text>
        <Pdf
          trustAllCerts={false}
          source={{ uri: docPath.toString(), cache: false }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
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
