import {Button, ScrollView, Pressable, Text , View,  StyleSheet ,Dimensions} from 'react-native';
import React, { useState, useEffect , useRef } from 'react';
import Pdf from 'react-native-pdf';
import { Stack } from "expo-router";
import {Image} from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

const CreatePDF = () => {
 const [hasGalleryPermission,setGalleryPermission] = useState(null);
 const [ImagePath, setImagePath] = useState ([]);


useEffect (() => {
    (async () => {
    const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setGalleryPermission(galleryStatus.status === 'granted');

    })();

},[]);

const pickImage = async () => {

let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
     allowsMultipleSelection: true,
    });
  if(!result.canceled){
      const ImageList = result.assets.map((assets ,index) =>  assets.uri  );
      setImagePath([...ImagePath,ImageList]);

    }
};

if (hasGalleryPermission === false){
  return <Text> no access to gallery</Text>
}



  return (
   <View style={{ flex: 1}}>
   <Stack.Screen options={{ headerShown: false, }}/>

    </View>
  );
}

const styles = StyleSheet.create({
 recentlyCreated: {
    backgroundColor:'orange'
  },

  recentContainerTop: {
   height:530,
   backgroundColor: 'orange',
   borderBottomLeftRadius:20,
   borderBottomRightRadius:20,

  },

  recentContainer: {
   height:530,
   borderBottomLeftRadius:20,
   borderBottomRightRadius:20,
   borderTopRightRadius:20,
   borderTopLeftRadius:20,
   borderColor:'orange',
   overflow: 'hidden',
   backgroundColor:'white',

  },

  scrollView: {
   height:510,
  },

  text: {
    fontSize: 400,
    color:'blue',
  },

 recentText: {
     fontSize:20,
     fontWeight: 'bold',
     opacity: 0.9,
     alignSelf: 'flex-start',
     color: 'white',
     textShadowColor:'black',
     textShadowRadius: 5,
     textShadowOffset: { width: 1, height: 1 },
    },
pdf: {
    flex: 1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  }


});


export default CreatePDF;
