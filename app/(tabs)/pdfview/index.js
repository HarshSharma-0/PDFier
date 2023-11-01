import { FlatList, Pressable, Text , View,  StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Stack , router, useFocusEffect} from "expo-router";
import {ViewDefault,Add_Book ,pickDocument , get_BookData } from "../../constants/DataAccess";
import CreateBook from '../../Createbook/CreateBook';
import Colors from "../../constants/colours";
import { RFPercentage} from "react-native-responsive-fontsize";
import ViewTapView from '../../pdfbookview/Screen6';
import RecentView from '../home/recent';
import SingleView from '../../pdfbookview/SinglePdfView';




const ViewPDF = () => {

const [Value, setValue] = useState(false);
const [Trigger,setTrigger] = useState(false);
const [ListData,setListData] = useState([]);
const [TriggerView,setTriggerView] = useState(0);
const [Visible,setVisible] = useState(false);
let ListPrevLength = 0;


const canViewPdf = async () => {
 const CanProceed = await pickDocument();
  if(CanProceed === true){
     setVisible(true);
  }
  else{

}
};
useFocusEffect(() => {
setTrigger(true);
const ret_data = ViewDefault(7);
setTriggerView(ret_data);
  });


useEffect(() => {

const List = get_BookData();
const ret_data = ViewDefault(7);
setTriggerView(ret_data);

if(List != null){ ListPrevLength = List.length}
setListData(List);
setTrigger(false);

}, [Trigger]);



return (

<View style={{ flex: 1 }}>
        <Stack.Screen options={{ headerShown: false, }}/>


   <View style={{ flex:0.5, flexDirection:'row' , alignItems:'center', justifyContent:'space-evenly'}}>
       <Pressable onPress={() => setValue(true)} style={styles.CreateBook}>
          <Text style={{ fontSize:RFPercentage(2.5) , color:'white' , fontWeight: 'bold' }}> Create PDFbook </Text>
       </Pressable>


             <Pressable onPress={() => canViewPdf()} style={styles.ViewPdf}>
                <Text style={{fontSize:RFPercentage(2.5), color:'white' , fontWeight: 'bold' }}> ViewPdf  </Text>
             </Pressable>

   </View>


   <View style={styles.BookAccessWindow}>
        <RecentView TableData={ListData} Set={setTrigger} BorderColor="lightgreen" bgColor={Colors.greenAlpha}  Open={setVisible} abc={true}/>
   </View>
  <View style={{flex:0.7}} />
  {Value ? <CreateBook updateValue={setValue} color={Colors.greenAlpha}  /> : null }
  {Visible & TriggerView === 0 ? <ViewTapView Close={setVisible}/> : null }
  {Visible & TriggerView === 1 ? <SingleView Close={setVisible}/> : null }


</View>

  );
}

const styles = StyleSheet.create({

BookAccessWindow: {
   flex:4.5,
},

CreateBook: {
    width:"40%",
    height:"90%",
    borderRadius:10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:Colors.greenAlpha,
    borderWidth:1,
    borderColor:"lightgreen",
    elevation:10,
},
ViewPdf: {

   width:"40%",
   height:"90%",
   borderRadius:10,
   alignItems: 'center',
   justifyContent: 'center',
   backgroundColor:Colors.greenAlpha,
   borderWidth:1,
   borderColor:"lightgreen",
   elevation:10,
},

});


export default ViewPDF;
