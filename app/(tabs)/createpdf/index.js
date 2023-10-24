import {Button, ScrollView, Pressable, Text , View,  StyleSheet ,Dimensions} from 'react-native';
import React, { useState, useEffect , useRef } from 'react';
import { Stack } from "expo-router";
import RecentView from '../home/recent';
import Createpdf from '../../Createbook/CreatePdf';
import Colors from "../../constants/colours";
import { RFPercentage} from "react-native-responsive-fontsize";

const CreatePDF = () => {

const [visible , setVisible] = useState(false);



  return (
   <View style={{ flex: 1}}>
   <Stack.Screen options={{ headerShown: false, }}/>
         <View style={{ flex:0.1, flexDirection:'row' , alignItems:'center', justifyContent:'space-evenly'}}>
       <Pressable onPress={() =>  setVisible(true)} style={styles.Createpdf}>
          <Text style={{fontSize:RFPercentage(2.5), color:'white' , fontWeight: 'bold' }}> Create PDFbook </Text>
       </Pressable>
         </View>
   <Text> recently Create PDFs </Text>
   {visible ? <Createpdf updateValue={setVisible} color={Colors.redAlpha} /> : null }
    </View>
  );
}

const styles = StyleSheet.create({
Createpdf: {
    width:"40%",
    height:"90%",
    borderRadius:10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:Colors.redAlpha,
    borderWidth:1,
    borderColor:Colors.red,
    elevation:5,
},

});


export default CreatePDF;
