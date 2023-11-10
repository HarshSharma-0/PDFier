import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text,Pressable, View,ScrollView,FlatList} from 'react-native';
import { Link,Stack } from 'expo-router';
import Colors from "../../constants/colours"
import { remove_CreatedPdfs , open_RecentCreated , open_recent , Open_recent_Pdf , open_book , remove_Book} from "../../constants/DataAccess";
import { RFPercentage} from "react-native-responsive-fontsize";
import Pdf from 'react-native-pdf';

const RecentView = (props) => {


async function remove(index){
await remove_Book(index);
props.Set(true);
};
function open(index){
open_book(index);
props.Open(true);

};
function Open_Recent(index){
open_recent(index);
props.Open(true);
};
function Open_recent_Pdf(index){
open_RecentCreated(index);
props.Open(true);
};
async function Remove_recent_Pdf(index){
await remove_CreatedPdfs(index);
props.Set(true);
};

const renderItem = ({ item , index }) => (
  <View>
  <Pressable
    delayLongPress = {150}
    onLongPress = {() => {
props.isCreated ? Remove_recent_Pdf(index) : remove(index)}}
    onPress ={() => {
props.isCreated ?  Open_recent_Pdf(index) : open(index) ;

}}
    style={[styles.listItem, props.isCreated ? {borderWidth:RFPercentage(0.2),borderColor:props.bgColor} : null ]}
    >
{props.isCreated ?
<>
   <View style={{
         height:RFPercentage(15),
         width:RFPercentage(15) ,
         backgroundColor:props.bgColor,
         overflow:'hidden',
     }}>
            <Pdf
          trustAllCerts={false}
          source={{ uri: item.file, cache: false }}
          singlePage={true}
          style={{
    flex: 1,
    alignSelf:'stretch',
    backgroundColor: 'white',
}}
        />

   </View>
    <View style={{marginLeft:RFPercentage(2),flex:2 , backgroundColor:'white'}}>
     <Text  style={{fontSize:RFPercentage(2),fontWeight:'bold' , color:props.bgColor}}> File Name :-   <Text style={{color:'grey'}}>{item.name}</Text> </Text>
     <Text  style={{fontSize:RFPercentage(0.3),fontWeight:'bold' , color:props.bgColor}}></Text>
     <Text  style={{fontSize:RFPercentage(2),fontWeight:'bold' , color:props.bgColor}}> File Path :-   <Text style={{color:'grey'}}>{item.file} </Text> </Text>
  </View>
</>

:
<>
 <View style={{flex:0.3 , backgroundColor:props.bgColor}}>
    <Text style={{fontWeight:'bold', color:'white'}}>Book Name: {item.BookName}</Text>
    <Text style={{color:'white'}}>Max: {item.Max}</Text>
    <Text style={{color:'white'}}>Current: {item.current}</Text>
   </View>

  <View style={{flex:0.5 , backgroundColor:'white'}}>
  </View>
  <View style={{flex:0.2 , backgroundColor: 'white'}}>
  </View>
</>
}
  </Pressable>
 </View>
);

const renderRecent = ({ item , index }) => (
  <View>
  <Pressable
    onPress ={() => {
Open_Recent(index) ;

}}
    style={styles.listItem}
    >

   <View style={{flex:1 , backgroundColor:props.bgColor,justifyContent:'center'}}>
    <Text style={{fontWeight:'bold',alignSelf:'center', color:'white'}}>RecentlyOpened</Text>
   </View>

  <View style={{flex:2 , backgroundColor:'white'}}>
  {item ? item.map((docName, index) => (
  <Text key = {index} style={{fontSize:RFPercentage(2),fontWeight:'bold' , color:'grey'}}> {docName} </Text>
    )) : null}

     </View>
  </Pressable>
 </View>
);


return (
 <View style={[styles.viewContainer, { borderColor: props.BorderColor }]}>

         <FlatList
      data={props.TableData}
      renderItem={props.abc ? renderItem : renderRecent}
      keyExtractor={(item, index) => index.toString()}
      style={{backgroundColor:'white',height:"100%"}}
    />
   </View>

  );

};

const styles = StyleSheet.create({
  viewContainer: {
   flex:1.5,
   borderRadius:RFPercentage(0.5),
   borderWidth:RFPercentage(0.17),
   overflow: 'hidden',
   backgroundColor:'white',
  },

listItem: {
    backgroundColor:'white',
    display:'flex',
    overflow:'hidden',
    flexDirection:'row',
    margin: RFPercentage(1),
    borderRadius: RFPercentage(0.6),
    elevation:10,
  },
});


export default RecentView;
