import {Button, ScrollView, Pressable, Modal, Text , View,  StyleSheet ,Dimensions} from 'react-native';
import React, { useState, useEffect , useRef } from 'react';
import { Stack , useFocusEffect } from "expo-router";
import RecentView from '../home/recent';
import Createpdf from '../../Createbook/CreatePdf';
import Colors from "../../constants/colours";
import { RFPercentage} from "react-native-responsive-fontsize";
import { ViewDefault,getDocumentName ,getRecentCreatedDoc , getDocument , getRecentCreatedDocPath } from "../../constants/DataAccess";
import ViewTapView from '../../pdfbookview/Screen6';
import SingleView from '../../pdfbookview/SinglePdfView';
import ViewSwipePdfBook from '../../pdfbookview/Screen1';
import Pdf from 'react-native-pdf';
import { BlurView } from 'expo-blur';

const CreatePDF = () => {

const [visibles , setVisibles] = useState(false);
const [Trigger,setTrigger] = useState(false);
const [ListData,setListData] = useState([]);
const [Visible,setVisible] = useState(false);
const [modalVisible, setModalVisible] = useState(true);
const [Progress,setProgress] = useState(null);


function Path_Extract(){
const result = getDocument();
return result.file;

};


function exit_modal(){
 setVisible(false);
};

useEffect(() => {

const List = getRecentCreatedDocPath();
setListData(List);

}, [Trigger]);


  return (
   <View style={{ flex: 1 ,}}>
   <Stack.Screen options={{ headerShown: false, }}/>
         <View style={{ flex:0.5, flexDirection:'row' , alignItems:'center', justifyContent:'space-evenly'}}>
     { Progress && ( <Pressable  onPress={() =>  setLogVisibles(true)} style={styles.Createpdf}>
          <Text style={{fontSize:RFPercentage(Progress.size), color:'white' , fontWeight: 'bold' }}> {Progress.text}</Text>
       </Pressable>
     )}

       <Pressable onPress={() =>  setVisibles(true)} style={styles.Createpdf}>
          <Text style={{fontSize:RFPercentage(2.5), color:'white' , fontWeight: 'bold' }}> Create PDF </Text>
       </Pressable>

         </View>
      <Text style={styles.RecentText}> Recently Created PDF </Text>
   {visibles ? <Createpdf updateValue={setVisibles} parentHook={setProgress} color={Colors.redAlpha} /> : null }
     <View style={{flex:4.5}}>
        <RecentView TableData={ListData} Set={setTrigger} BorderColor="rgba(255,0,0,0.7)" bgColor={Colors.redAlpha}  Open={setVisible} abc={ true } isCreated = { true } reRender = {Trigger} />
    </View>
    <View style={{flex:0.7}}/>
      {Visible ?
       <Modal
        animationType="fade"
        transparent={true}
        visible={Visible}
        onRequestClose={() => {
          exit_modal();
        }}>
<BlurView intensity={20} tint="dark" style={{flex:1 , padding:RFPercentage(1)}}>
        <Pdf
          trustAllCerts={false}
          source={{ uri: Path_Extract(), cache: false }}
          style={styles.pdfVisible}
        />
</BlurView>
</Modal>
 : null }

    </View>
  );
}

const styles = StyleSheet.create({
Createpdf: {
    width:"40%",
    height:"90%",
    borderRadius:RFPercentage(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:Colors.redAlpha,
    borderWidth:RFPercentage(0.15),
    borderColor:Colors.red,
},
RecentText: {
  marginTop:'2%',
  fontSize: RFPercentage(2),
  fontWeight:'bold',
  color:Colors.redAlpha,
},
pdfVisible:{
    flex: 1,
    alignSelf:'stretch',
    backgroundColor: 'transparent',

  },

});


export default CreatePDF;
