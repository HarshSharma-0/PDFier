import {Alert, Pressable , StyleSheet, View, Text ,SafeAreaView } from 'react-native';
import { Stack , router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import RecentView from './recent';
import { RFPercentage} from "react-native-responsive-fontsize";
import {isUpdateHome , Add_Book ,ViewDefault,pickDocument , get_BookData , load_system_book , getRecentDoc} from "../../constants/DataAccess";
import CreateBook from '../../Createbook/CreateBook';
import ViewTapView from '../../pdfbookview/Screen6';
import Colors from "../../constants/colours";
import SingleView from '../../pdfbookview/SinglePdfView';
import ViewSwipePdfBook from '../../pdfbookview/Screen1';
import { useIsFocused } from '@react-navigation/native';


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
const isFocused = useIsFocused();


useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
       setOut(!Out);
      }, 200);
    }
  }, [isFocused]);



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

useEffect(() => {
 function Fetch_Book(){
   const rec_data = getRecentDoc();
   const List =  get_BookData();
   const ret_data = ViewDefault(7);
   isUpdateHome(2);
   setRecentData(rec_data);
   setTriggerView(ret_data);
   setListData(List);
}
Fetch_Book();
}, [  Out ]);


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
      <RecentView   TableData={ListData}  reRender = { Out } Set={setOut} BorderColor="blue" bgColor={Colors.primary} Open={setVisible} abc = {true} isCreated = { false }  isHome = {false} />
      <Text style={styles.BookText}> Recently Viewed PDFs </Text>
      <RecentView TableData={RecentData}   reRender = { Out }  Set={setOut} BorderColor="blue" bgColor={Colors.primary} Open={setVisible} abc = { false } isCreated = { false }/>
    <View style={styles.footer}>
    </View>
      {value ? <CreateBook updateValue={setValue} color={Colors.primary}  isHome = {false} /> : null }
      {Visible & TriggerView === 0 ? <ViewTapView Close={setVisible}  ViewData = {[]}  /> : null }
      {Visible & TriggerView === 1 ? <SingleView Close={setVisible} ViewData = {[]} /> : null }
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
    borderRadius:RFPercentage(1.5),
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
   borderRadius:RFPercentage(1.5),
   alignItems: 'center',
   justifyContent: 'center',
   borderWidth:1,
   borderColor:'blue',
   backgroundColor:Colors.primary,
   elevation:10,

},


});
