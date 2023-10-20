import { Pressable , StyleSheet, View, Text ,SafeAreaView } from 'react-native';
import { useFocusEffect, Stack , router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import RecentView from './recent';
import { RFPercentage} from "react-native-responsive-fontsize";
import {Add_Book ,pickDocument , get_BookData } from "../DataAccess";
import CreateBook from '../../Createbook/CreateBook';
import ViewTapView from '../../pdfbookview/Screen6';
import Colors from "../../constants/colours";


export default function Home() {

const text = "PDFier";
const [value, setValue] = useState(false);
const [ListData,setListData] = useState([]);
const [Trigger,setTrigger] = useState(false);
const [TriggerView,setTriggerView] = useState(false);
let List = [];



const canViewPdf = async () => {
 const CanProceed = await pickDocument();
  if(CanProceed === true){
      router.push("/pdfbookview/Screen6");
  }
  else{

}
};
useFocusEffect(() => {
   setTrigger(true);
  }),

useEffect(() => {

List = get_BookData();
setListData(List);
setTrigger(false);


}, [ Trigger ]);


  return (
    <SafeAreaView style = {styles.root}>
        <Stack.Screen options={{ headerShown: false, }}/>
       <View style={{ flex:0.4, flexDirection:'row' , alignItems:'center', justifyContent:'space-evenly'}}>
       <Pressable onPress={() =>  setValue(true)} style={styles.CreateBook}>
          <Text style={{fontSize:RFPercentage(2.5), color:'white' , fontWeight: 'bold' }}> Create PDFbook </Text>
       </Pressable>


             <Pressable onPress={() => canViewPdf()} style={styles.ViewPdf}>
                <Text style={{ fontSize:RFPercentage(2.5), color:'white' , fontWeight: 'bold' }}> ViewPdf  </Text>
             </Pressable>

   </View>
      <Text style={styles.RecentText}> Recently Created Book </Text>
      <RecentView TableData={ListData} Set={setTrigger} BorderColor="blue" bgColor={Colors.primary} Open={setTriggerView}/>
      <Text style={styles.BookText}> Recently Viewed PDFs </Text>
      <RecentView />
    <View style={styles.footer}>
    </View>
      {value ? <CreateBook updateValue={setValue} color={Colors.primary}  /> : null }
      { TriggerView ? <ViewTapView Close={setTriggerView}/> : null }
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

root: {
flex:1,
 },
BookText:{
  marginTop:'2%',
  fontSize: RFPercentage(2),
  fontWeight:'bold',
  color:Colors.primary,



},

RecentText: {
  marginTop:'2%',
  fontSize: RFPercentage(2),
  fontWeight:'bold',
  color:Colors.primary,

},

footer: {
flex:0.6,
borderTopRightRadius: 30,
borderTopLeftRadius: 30,
},

CreateBook: {
    width:"40%",
    height:"90%",
    borderRadius:10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:Colors.primary,
    borderWidth:1,
    borderColor:'blue',
    elevation:10,
},
ViewPdf: {

   width:"40%",
   height:"90%",
   borderRadius:10,
   alignItems: 'center',
   justifyContent: 'center',
   borderWidth:1,
   borderColor:'blue',
   backgroundColor:Colors.primary,
   elevation:10,

},


});
