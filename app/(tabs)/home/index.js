import { Pressable , StyleSheet, View, Text ,SafeAreaView } from 'react-native';
import { useFocusEffect, Stack , router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import RecentView from './recent';
import { RFPercentage} from "react-native-responsive-fontsize";
import {Add_Book ,ViewDefault,pickDocument , get_BookData , load_system_book , getRecentDoc} from "../DataAccess";
import CreateBook from '../../Createbook/CreateBook';
import ViewTapView from '../../pdfbookview/Screen6';
import Colors from "../../constants/colours";
import SingleView from '../../pdfbookview/SinglePdfView';
import ViewSwipePdfBook from '../../pdfbookview/Screen1';


export default function Home() {

const text = "PDFier";
const [value, setValue] = useState(false);
const [ListData,setListData] = useState([]);
const [Trigger,setTrigger] = useState(false);
const [TriggerView,setTriggerView] = useState(0);
const [Out,setOut] = useState(false);
const [Visible,setVisible] = useState(false);
const [Track , setTrack] = useState(true);
const [RecentData , setRecentData] = useState([]);
let List = [];



const canViewPdf = async () => {
 const CanProceed = await pickDocument();
  if(CanProceed === true){
      setVisible(true);

  }
  else{

}
 const rec_data = getRecentDoc();
      setRecentData(rec_data);

};

useFocusEffect(() => {
   const ret_data = ViewDefault(7);
   const rec_data = getRecentDoc();
    setRecentData(rec_data);
    setTriggerView(ret_data);
    List = get_BookData();
    setListData(List);

  });

useEffect(() => {

   List = get_BookData();
   setListData(List);

}, [  value ]);


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
      <RecentView TableData={ListData} Set={setOut} BorderColor="blue" bgColor={Colors.primary} Open={setVisible} abc = {true}/>
      <Text style={styles.BookText}> Recently Viewed PDFs </Text>
      <RecentView TableData={RecentData} Set={setOut} BorderColor="blue" bgColor={Colors.primary} Open={setVisible} abc = { false }/>
    <View style={styles.footer}>
    </View>
      {value ? <CreateBook updateValue={setValue} color={Colors.primary}  /> : null }
      {Visible & TriggerView === 0 ? <ViewTapView Close={setVisible}/> : null }
      {Visible & TriggerView === 1 ? <SingleView Close={setVisible}/> : null }
      {Visible & TriggerView === 2 ? <ViewSwipePdfBook Close={setVisible}/> : null }
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
