import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import {StyleSheet,Modal, Text,Pressable, View,FlatList} from 'react-native';
import React, {useEffect,useState} from 'react';
import { Link,Stack } from 'expo-router';
import Colors from "../../constants/colours"
import {isUpdateView , isUpdateHome, Save_Edit_Book, handleAdd , showToastWithGravity , remove_CreatedPdfs , open_RecentCreated , open_recent , Open_recent_Pdf , open_book , remove_Book} from "../../constants/DataAccess";
import { RFPercentage} from "react-native-responsive-fontsize";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Pdf from 'react-native-pdf';
import { BlurView } from 'expo-blur';
import RNFS from 'react-native-fs';
import * as Sharing from 'expo-sharing';
import Animated , {
  Easing,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';




const RecentView = (props) => {

const [openEditWindow,setopenEditWindow] = useState(false);
const [configure ,setopenConfigure] = useState(false);
const [queryIndex,setQueryIndex] = useState(0);
const [isRerender,setRe] = useState(false);



async function remove(index){

await remove_Book(index);
props.Set(!props.reRender);
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
props.Set(!props.reRender);
};


function Download(int_Ret) {
  return (
    props.TableData[int_Ret].isCached === false ? (
      <Pressable
        onPress={async () => {
          const tmp =  props.TableData[int_Ret].file;
          const extPath = RNFS.ExternalStorageDirectoryPath +"/PDFier/"+ props.TableData[int_Ret].name + ".pdf";
          const FolderExist = await FileSystem.getInfoAsync( "file://" + extPath);
          if(FolderExist.exists === false){
          await RNFS.copyFile(tmp, extPath);
          showToastWithGravity("File Copied");
           return;
           }
          showToastWithGravity("Already Exist");
        }}
        style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}
      >
        <FontAwesome
          size={RFPercentage(3)}
          style={{ /* any additional styles */ }}
          name="download"
          color={props.bgColor}
        />
      </Pressable>
    ) : null
  );
}

const renderItem = ({ item , index }) => {


return (
<Animated.View
    style={[styles.listItem,props.isCreated ? {borderWidth:RFPercentage(0.2),borderColor:props.bgColor} : null ]}
>
  <Pressable
    delayLongPress = {350}
    onLongPress = {() => {
props.isCreated ? Remove_recent_Pdf(index) : remove(index)}}
    onPress ={() => {
props.isCreated ?  Open_recent_Pdf(index) : open(index) ;

}}
style={{flex:1,flexDirection:'row'}}
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
     <Text  style={{fontSize:RFPercentage(0.2),fontWeight:'bold' , color:props.bgColor}}>  </Text>
     <Text  style={{fontSize:RFPercentage(2),fontWeight:'bold' , color:props.bgColor}}> File Path :-   <Text style={{color:'grey'}}>{item.file} </Text> </Text>
  </View>
<View style={{flex:0.5}}>
    <Pressable
    onPress ={async() => {
    const tmp ="file://" + props.TableData[index].file;
    await Sharing.shareAsync(tmp,{
     dialogTitle:"PDFier Share Dialog",
  });

}}
      style={{flex:1 , backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>

 <FontAwesome
              size={RFPercentage(3)}
              style={{  }}
              name="share-alt"
              color={props.bgColor}
/>
</Pressable>

{Download(index)}
</View>

</>

:
<>
 <View style={{flex:0.3 , backgroundColor:props.bgColor}} sharedTransitionTag="recent" >
    <Text style={{fontWeight:'bold', color:'white'}}>Book Name: {item.BookName}</Text>
    <Text style={{color:'white'}}>Max: {item.Max}</Text>
    <Text style={{color:'white'}}>Current: {item.current}</Text>
   </View>

  <View style={{alignItems:'center',justifyContent:'center',gap:RFPercentage(0.6), flex:0.5 , backgroundColor:'white'}}>
  { item.current === 0 ?
  <>
   <Text style={{color:'#ff3600' , fontSize:RFPercentage(2)}} > EMPTY </Text>
   <Text style={{color:'grey' , fontSize:RFPercentage(2)}} > LongPress Here to Delete </Text>
  </> :
 <>
   <Text style={{color:'grey' , fontSize:RFPercentage(2)}} > Press Here to View </Text>
   <Text style={{color:'grey' , fontSize:RFPercentage(2)}} > LongPress Here to Delete </Text>
  </>
}
  </View>
  <Pressable style={{flex:0.2 ,alignItems:'center',justifyContent:'center', backgroundColor: 'white'}}
    onPress ={() => {
    setQueryIndex(index);
    setopenEditWindow(true);

 }}
>
<FontAwesome
              size={RFPercentage(3)}
              style={{  }}
              name="edit"
              color={props.bgColor}
/>
  </Pressable>
</>
}
  </Pressable>
  </Animated.View>
);
}


const renderEdit = ({ item , index }) => (

  <View>
  <Pressable
      delayLongPress = {150}
      onLongPress = {async () => {
      await RNFS.unlink(props.TableData[queryIndex].Paths[index].toString());
      const filter_data = props.TableData[queryIndex].Paths.filter((item,Index) => Index !== index );
      props.TableData[queryIndex].Paths = filter_data;
      const filter_Name = props.TableData[queryIndex].DocName.filter((item,Index) => index !== Index );
      props.TableData[queryIndex].DocName = filter_Name ;

      setRe(!isRerender);
      props.TableData[queryIndex].current = filter_Name.length;

      Save_Edit_Book();

}}
    style={styles.listItem}
>
   <View style={{
         height:RFPercentage(15),
         width:RFPercentage(15) ,
         backgroundColor:props.bgColor,
         overflow:'hidden',
     }}>
            <Pdf
          trustAllCerts={false}
          source={{ uri:item, cache: false }}
          singlePage={true}
          style={{
    flex: 1,
    alignSelf:'stretch',
    backgroundColor: 'white',
}}
        />

   </View>
    <View style={{marginLeft:RFPercentage(2),flex:2 , backgroundColor:'white'}}>
     <Text  style={{fontSize:RFPercentage(2),fontWeight:'bold' , color:props.bgColor}}> File Name :-   <Text style={{color:'grey'}}>{props.TableData[queryIndex].DocName[index]}</Text> </Text>
     <Text  style={{fontSize:RFPercentage(0.3),fontWeight:'bold' , color:props.bgColor}}></Text>
     <Text  style={{fontSize:RFPercentage(2),fontWeight:'bold' , color:props.bgColor}}> File Path :-   <Text style={{color:'grey'}}> {item} </Text> </Text>
  </View>

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
    <Text style={{fontWeight:'bold',alignSelf:'center', color:'white'}}>{index+1}) RecentlyOpened</Text>
   </View>

  <View style={{flex:2}}>
{item ? item.map((docName, mapIndex) => (
          <Text key={mapIndex} style={{ padding: RFPercentage(0.1), fontSize: RFPercentage(2), fontWeight: 'bold', color: 'grey' }}> {mapIndex+1})
            {docName.length > 30 ? `  ${docName.slice(0, 20)}...` : '  ' + docName}
          </Text>
        )) : null}

     </View>

  </Pressable>
 </View>
);




return (
 <View sharedTransitionTag="tag" style={[styles.viewContainer, { borderColor: props.BorderColor }]}>

         <FlatList
      data={props.TableData}
      renderItem={props.abc ? renderItem : renderRecent}
      keyExtractor={(item, index) => index.toString()}
      style={{backgroundColor:'white',height:"100%"}}
      extraData={props.forcedData}
      sharedTransitionTag="tag"
    />
{openEditWindow ?
   <Modal
        animationType="slide"
        transparent={true}
        visible={openEditWindow}
        onRequestClose={() => {
          setopenEditWindow(!openEditWindow);
        }}>
<View style={{flex:1}}>
<Pressable
 style={{flex:1, backgroundColor:'grey',opacity:0.1}}
    onPress ={() => {
          setopenEditWindow(!openEditWindow);
}}
/>
<View style={{flex:2,overflow:'hidden',borderTopLeftRadius:RFPercentage(2),borderTopRightRadius:RFPercentage(2), borderWidth:RFPercentage(0.1) , borderColor: props.BorderColor }}>
<BlurView intensity={20} tint="light" style={{flex:1 }}>
<View style={{flex:0.5,justifyContent:'space-between',alignItems:'center',flexDirection:'row',backgroundColor:'transparent'}}>
<Text style={{fontSize:RFPercentage(2),color:'grey'}}> Edit Book :-   {props.TableData[queryIndex].BookName} </Text>
<Pressable
style={{flex:0.5,alignItems:'center'}}

    onPress ={async () => {
   if(props.TableData[queryIndex].Max > props.TableData[queryIndex].current ){

const thresh = props.TableData[queryIndex].Max - props.TableData[queryIndex].current;
const Prev_Current = props.TableData[queryIndex].current;

  const Data_ret = await handleAdd(thresh,queryIndex);
   for (let i = 0; i < Data_ret.file.length; i++) {
    props.TableData[queryIndex].Paths.push(Data_ret.file[i]);
    props.TableData[queryIndex].DocName.push(Data_ret.Name[i]);
}
props.TableData[queryIndex].current = Prev_Current + Data_ret.file.length;
setRe(!isRerender);
Save_Edit_Book();
} else{ return }
}}
>
<FontAwesome
              size={RFPercentage(3)}
              style={{  }}
              name="plus"
              color={props.bgColor}
/>
</Pressable>
</View>
          <FlatList
      data={props.TableData[queryIndex].Paths}
      renderItem={renderEdit}
      keyExtractor={(item, index) => index.toString()}
      style={{backgroundColor:'white',height:"50%"}}
      extraData={isRerender}
    />
</BlurView>
</View>
</View>
    </Modal>
: null}
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
