import { Stack } from 'expo-router';
import { PixelRatio , View , Text , StyleSheet , Dimensions } from 'react-native';
import React, { useRef, useState, useEffect} from 'react';
import Pdf from 'react-native-pdf';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {getDocument , getDocumentName} from '../(tabs)/DataAccess';


const ViewTapView = () =>  {

  const [DocPaths, setDocPaths] = useState([]);
  const [DocName,setDocName] = useState([]);
  const [ FlexVal,setFlexVal] = useState([]);
  let Counter = 0;


useEffect(() => {
  const result = getDocument();
       setDocPaths(result);
  const resultName = getDocumentName();
       setDocName(resultName);
  console.log (result);
 console.log (resultName);
  const initialFlexVal = Array(result.length).fill(false);
    initialFlexVal[0] = true;
    initialFlexVal[1] = true;
    setFlexVal(initialFlexVal);

 }, []);

const handleSingleTap = (index) => {
   console.log("++++++++++++++++++++++++++++++++++ New Log ++++++++++++++++++++++++");

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


console.log("the current index tapped V1 :" + index);
setFlexVal(NewFlexArray);
console.log(" Length of array :" + ArrayLength );
console.log(NewFlexArray);
console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 };


      return (
  <View style={{ flex: 1 }}>
    <Stack.Screen options={{ headerShown: false }} />
    {DocPaths.map((docPath, index) => (
      <View style={ FlexVal[index] ? styles.visible : styles.hidden } key={index}>
        <Text>{DocName[index]}</Text>
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
    ))}
</View>
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
    backgroundColor: 'black',
  },

});


export default ViewTapView;
