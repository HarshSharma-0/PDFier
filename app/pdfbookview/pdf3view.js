import { Stack } from 'expo-router';
import { PixelRatio , View , Text , StyleSheet , Dimensions } from 'react-native';
import React, { useState, useEffect} from 'react';
import Pdf from 'react-native-pdf';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {getDocument , getDocumentName} from '../(tabs)/DataAccess';


const ViewTapView = () =>  {


  const [DocPaths, setDocPaths] = useState([]);
  const [DocName,setDocName] = useState([]);
  const [FlexVal, setFlexVal] = useState([1,1,1]);

useEffect(() => {
  const result = getDocument();
       setDocPaths(result);
  const resultName = getDocumentName();
       setDocName(resultName);

 }, []);

const handleSingleTap = (index) => {

   const newFlexArray = [...FlexVal];

    if(index === 0){
      newFlexArray[index]=0;
      newFlexArray[index+1] = 1;
      newFlexArray[index+2] = 1;
      }
    if(index === 1){
      newFlexArray[index]=0;
      newFlexArray[index-1] = 1;
      newFlexArray[index+1] = 1;
      }
     if(index === 2){
      newFlexArray[index]=0;
      newFlexArray[index-2] = 1;
     newFlexArray[index-1] = 1;
     }
    setFlexVal(newFlexArray);
 };

      return (
      <View style={{flex:1}}>
         <Stack.Screen options={{headerShown:false}} />
               <View style={{ flex: FlexVal[0], }} >
               <Text> hello </Text>
              <Pdf
                trustAllCerts={false}
                source={{ uri: DocPaths[0].toString(), cache: false }}
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
                 handleSingleTap(0);

                }}
                onLoadComplete = { (numberOfPages) => {

                }}
                style={{
                  flex:1,
                  height:"100%",
                  backgroundColor:'white',

               }}
              />
            </View>
            <View style={{ flex:FlexVal[1], }} >
               <Text> hello </Text>
              <Pdf
                trustAllCerts={false}
                source={{ uri: DocPaths[1].toString(), cache: false }}
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
                  handleSingleTap(1);
                }}
                onLoadComplete = { (numberOfPages) => {

                }}
                style={{
                  flex:1,
                  height:"100%",
                  backgroundColor:'white',

               }}
              />
            </View>
            <View style={{ flex:FlexVal[2], }} >
               <Text> hello </Text>
              <Pdf
                trustAllCerts={false}
                source={{ uri: DocPaths[2].toString(), cache: false }}
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
                  handleSingleTap(2);
                }}
                onLoadComplete = { (numberOfPages) => {

                }}
                style={{
                  flex:1,
                  height:"100%",
                  backgroundColor:'white',

               }}
              />
            </View>

        </View>
      );


};
