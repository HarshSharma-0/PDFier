import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text,Pressable, View,ScrollView,FlatList} from 'react-native';
import { Link,Stack } from 'expo-router';
import Colors from "../../constants/colours"
import { open_recent , open_book , remove_Book} from "../DataAccess";
import { RFPercentage} from "react-native-responsive-fontsize";

const RecentView = (props) => {

function remove(index){
remove_Book(index);
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

const renderItem = ({ item , index }) => (
  <View>
  <Pressable
    delayLongPress = {150}
    onLongPress = {() => remove(index)}
    onPress ={() =>  open(index)}
    style={styles.listItem}
    >

   <View style={{flex:0.3 , backgroundColor:props.bgColor}}>
    <Text style={{fontWeight:'bold', color:'white'}}>Book Name: {item.BookName}</Text>
    <Text style={{color:'white'}}>Max: {item.Max}</Text>
    <Text style={{color:'white'}}>Current: {item.current}</Text>
   </View>

  <View style={{flex:0.5 , backgroundColor:'white'}}>
  </View>
  <View style={{flex:0.2 , backgroundColor: 'white'}}>
  </View>

  </Pressable>
 </View>
);

const renderRecent = ({ item , index }) => (
  <View>
  <Pressable
    onPress ={() => Open_Recent(index)}
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
   borderRadius:10,
   borderWidth:2,
   overflow: 'hidden',
   backgroundColor:'white',
  },
listItem: {
    backgroundColor:'white',
    display:'flex',
    overflow:'hidden',
    flexDirection:'row',
    margin: 8,
    borderRadius: 8,
    elevation:10,

  },
});


export default RecentView;
