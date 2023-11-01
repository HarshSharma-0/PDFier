import { Stack } from 'expo-router';
import { PixelRatio , View , Text ,Modal, StyleSheet , Dimensions } from 'react-native';
import React, { useState, useEffect} from 'react';
import Pdf from 'react-native-pdf';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {gestureEnable,getDocument , getDocumentName} from '../constants/DataAccess';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Screen2 from './Screen2';
import Screen3 from './Screen3';
import Screen4 from './Screen4';
import Screen5 from './Screen5';
import { BlurView } from 'expo-blur';


const Tab = createMaterialTopTabNavigator();

const ViewSwipePdfBook = (props) => {

  const [DocPaths, setDocPaths] = useState([]);
  const [DocName,setDocName] = useState([]);
  const [modalVisible, setModalVisible] = useState(true);
  const [eSwipe,setESwipe] = useState(false);

useEffect(() => {

    const ret_data = gestureEnable(2);
    setESwipe(ret_data);

}, []);


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

             <Tab.Navigator
           tabBarPosition = 'bottom'
           screenOptions={{
           tabBarStyle: {
               backgroundColor:'transparent',
                        },
           swipeEnabled : eSwipe ? true : false,


          }}
      sceneContainerStyle={{ backgroundColor:'transparent',padding:10 }}

     >
      <Tab.Screen name="book1" component={Screen2} />
      <Tab.Screen name="book2" component={Screen3} />
      <Tab.Screen name="book3" component={Screen4} />
      <Tab.Screen name="book4" component={Screen5} />
       </Tab.Navigator>

   </BlurView>
</Modal>
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



export default ViewSwipePdfBook;
