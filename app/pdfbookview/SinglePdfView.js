import { Stack } from 'expo-router';
import { Modal,PixelRatio , View , Text , StyleSheet , Dimensions } from 'react-native';
import React, { useState, useEffect} from 'react';
import Pdf from 'react-native-pdf';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {getDocument , getDocumentName} from '../constants/DataAccess';
import { BlurView } from 'expo-blur';

const SingleView = (props) =>  {

  const [DocPaths, setDocPaths] = useState([]);
  const [DocName,setDocName] = useState([]);
  const [ FlexVal,setFlexVal] = useState([]);
  const [modalVisible, setModalVisible] = useState(true);


useEffect(() => {

  const result = getDocument();
     setDocPaths(result);
  const resultName = getDocumentName();
       setDocName(resultName);
  const initialFlexVal = Array(result.length).fill(false);
    initialFlexVal[0] = true;
    setFlexVal(initialFlexVal);
    setModalVisible(true);
 }, []);


const handleSingleTap = (index) => {
 const NewFlexArray = [...FlexVal];
  let ArrayLength = (NewFlexArray.length - 1);
  NewFlexArray[index] = false;
  if (index === ArrayLength ) {
  NewFlexArray[0] = true;
  } else {
  NewFlexArray[index + 1] = true;
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
    { FlexVal ? DocPaths.map((docPath, index) => (
      <View style={ FlexVal[index] ? styles.visible : styles.hidden} key={index}>
        <Text style={{ alignSelf:'center',color:'white',backgroundColor:'transparent'}}>{DocName[index]}</Text>
        <Pdf
          trustAllCerts={false}
          source={{ uri: docPath.toString(), cache: false }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {

          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          onPageSingleTap={() => {
            handleSingleTap(index);
          }}
          onLoadComplete={(numberOfPages) => {
            // Do something with numberOfPages if needed
          }}
          style={styles.pdfVisible}
        />

      </View>
    )) : null}
</BlurView>
</Modal>

      );


};

const styles = StyleSheet.create({
  visible: {
    flex:1,
    display:'flex',
    padding:10,
  },
  hidden: {
    height:"100%",
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


export default SingleView;
