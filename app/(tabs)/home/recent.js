import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text,Pressable, View,ScrollView,FlatList} from 'react-native';
import { Link,Stack } from 'expo-router';
import Colors from "../../constants/colours"
import { open_book , remove_Book} from "../DataAccess";

const RecentView = (props) => {

function remove(index){
remove_Book(index);
props.Set(true);
};


const renderItem = ({ item , index }) => (
  <Pressable
    delayLongPress = {150}
    onLongPress = {() => remove(index)}
    onPress ={() => open_book(index)}
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
);

return (
 <View style={[styles.viewContainer, { borderColor: props.BorderColor }]}>
         <FlatList
      data={props.TableData}
      renderItem={renderItem}
      keyExtractor={(item) => item.Id.toString()}
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
