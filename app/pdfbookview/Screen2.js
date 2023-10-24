import { Stack} from 'expo-router';
import {  PixelRatio , View , StyleSheet} from 'react-native';
import React, { useState, useEffect} from 'react';
import Pdf from 'react-native-pdf';
import {getQueryFile , getDocumentName} from '../(tabs)/DataAccess';


function calculateFontSize(Size) {
    const fontScale = PixelRatio.getFontScale();
    return Size / fontScale;
  }

const Screen2 = () => {

  const [DocPaths, setDocPaths] = useState([]);
  const [DocName,setDocName] = useState([]);

  useEffect(() => {
    const result = getQueryFile();
    setDocPaths(result);
    const resultName = getDocumentName();
    setDocName(resultName);
  }, []);

  return (
    <View style={{ flex: 1 , backgroundColor:'transparent'}}>
   { DocPaths &&
            <View style={{ flex:1, overflow:'hidden' ,backgroundColor:'transparent'}} >
              <Pdf
                trustAllCerts={false}
                source={{ uri: DocPaths.toString(), cache: false }}
                onLoadComplete={(numberOfPages, filePath) => {
                  console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                  console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                  console.log(error);
                }}
                onPressLink={(uri) => {
                  console.log(`Link pressed: ${uri}`);
                }}
                onPageSingleTap = {()=>{

                }}
                onLoadComplete = { (numberOfPages) => {
                }}
                style={styles.pdf}
              />
            </View>
          }
    </View>
  );
};

const styles = StyleSheet.create({

pdf: {
    flex: 1,
    height:"100%",
    backgroundColor:'transparent',
  },


});



export default Screen2;
