import { Stack} from 'expo-router';
import { PixelRatio , View , StyleSheet} from 'react-native';
import React, { useState, useEffect} from 'react';
import Pdf from 'react-native-pdf';
import {getQueryFile , getDocumentName} from '../(tabs)/DataAccess';


function calculateFontSize(Size) {
    const fontScale = PixelRatio.getFontScale();
    return Size / fontScale;
  }

const Screen3 = () => {
  const [DocPaths, setDocPaths] = useState([]);
  const [DocName,setDocName] = useState([]);


  useEffect(() => {
    const result = getQueryFile();
    setDocPaths(result);
    const resultName = getDocumentName();
    setDocName(resultName);
  }, []);

  return (
    <View style={{ flex: 1 }}>
   <Stack.Screen options={{headerShown:false}} />
   { DocPaths &&
            <View style={{ flex:1 , overflow:'hidden' }} >
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
Switch:{
flex:0.05,
width:"100%",
backgroundColor:'orange',
flexDirection:'row',
alignItems: 'center',
justifyContent: 'space-between',
},

button:{
backgroundColor:'yellow',
height:"50%",
width:"10%",
zindex:1,
},

button2:{
backgroundColor:'yellow',
height:50,
width:50,
borderRadius:25,
zindex:1,
},

pdf: {
    flex: 1,
    height:"100%",
    backgroundColor:'white',
  },


});



export default Screen3;
