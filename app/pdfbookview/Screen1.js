import { Stack } from 'expo-router';
import { PixelRatio , View , Text , StyleSheet , Dimensions } from 'react-native';
import React, { useState, useEffect} from 'react';
import Pdf from 'react-native-pdf';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {getDocument , getDocumentName} from '../(tabs)/DataAccess';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Screen2 from './Screen2';
import Screen3 from './Screen3';
import Screen4 from './Screen4';
import Screen5 from './Screen5';
import Screen6 from './Screen6';


const Tab = createMaterialTopTabNavigator();

const ViewPdfBook = () => {

  const [DocPaths, setDocPaths] = useState([]);
  const [DocName,setDocName] = useState([]);

  return (

    <View style={{ flex: 1 }}>
   <Stack.Screen options={{headerShown:false}} />
             <Tab.Navigator
           tabBarPosition = 'bottom'
           swipeEnabled = {false}
     >
      <Tab.Screen name="book1" component={Screen2} />
      <Tab.Screen name="book2" component={Screen3} />
      <Tab.Screen name="book3" component={Screen4} />
      <Tab.Screen name="book4" component={Screen5} />
       </Tab.Navigator>

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
});



export default ViewPdfBook;
