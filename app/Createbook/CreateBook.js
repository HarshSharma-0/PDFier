import React, { useState,useEffect,useRef } from 'react';
import {Animated,Easing, Modal,Text, View, StyleSheet, TextInput , Dimensions , Pressable , FlatList } from 'react-native';
import { RFPercentage} from "react-native-responsive-fontsize";
import { setBookName , isUpdateView , isUpdateHome , Add_Book , name_list} from '../constants/DataAccess';
import Pdf from 'react-native-pdf';
import { BlurView } from 'expo-blur';


const CreateBook = (props) => {

  const  height  = Dimensions.get('window').height;
  const [textVal, onChangeText] = useState(' ');
  const [modalVisible, setModalVisible] = useState(true);
  const [paths,setPaths] = useState([]);
  const [show,setshow] = useState(true);
  const [More,setMore] = useState(false);
  const BlurAnim = useRef(new Animated.Value(0)).current;
  const [open,setopen] = useState(0);

const renderItem = ({ item , index }) => (

 <Pressable
    delayLongPress={150}
    onLongPress={() => { setopen(index);
    setMore(true);
    }}
    onPress={() => console.log(paths)}
    style={{flex:1,flexDirection:'row',margin:10, borderRadius:10 ,overflow:'hidden', borderWidth:2,borderColor:props.color}}
   >
    <View style={{ height:RFPercentage(15),width:RFPercentage(15) ,borderTopRightRadius:10,borderBottomRightRadius:10,overflow:'hidden'}}>

        <Pdf
          singlePage={true}
          trustAllCerts={false}
          source={{ uri: paths.Doc_Paths[index].toString(), cache: false }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {

          }}
          onError={(error) => {
            console.log(error);
          }}
          style={{flex:1 ,
              alignSelf:'stretch',
          }}
        />
</View>

 <View style={{flex:1 ,padding:RFPercentage(1),gap:1 }}>
   <Text style={{ fontWeight: 'bold', color: props.color }}>Doc Name :-   <Text style={{color:'grey' }}>  {paths.DocName[index]} </Text> </Text>
      <Text style={{ fontWeight: 'bold', color: props.color }}>Doc Paths :-      </Text>
      <Text style={{color:'grey'}}>   {paths.Doc_Paths[index]}</Text>
  </View>

</Pressable>


);



const CreateBookLocal = async () => {
  const proceed = await Add_Book();
    if(proceed != false){
     const get_name = name_list();
     const combinedData = {
    Doc_Paths : proceed,
    DocName : get_name,
       };
setshow(false);
setPaths(combinedData);

};
};


 function Cancle(){
    props.updateValue(false);
    setModalVisible(false);
}
async function OK(){

   await setBookName(textVal);
   if(props.isHome === false ){
      isUpdateView(1);
 }else{
     isUpdateHome(1);
};
    props.updateValue(false);

};

useEffect(() => {

  Animated.timing(BlurAnim, {
    toValue: 1,
    duration: 1000,
    easing: Easing.linear,
    useNativeDriver: false,
  }).start();

  }, []);

  return (
   <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          props.updateValue(false);
        }}>
 <Animated.View style={{flex:1, opacity:BlurAnim}}>
<BlurView intensity={20} tint="dark" style={{flex:1 }}>
   <View style={{flex:1}}>

    <View style={styles.Create}>
      <Text style={styles.headtext}>Name Your Book</Text>
    <View style={{flexDirection:'row', justifyContent:'space-between',width:'100%'}}>
   <Text style={{fontSize:RFPercentage(2),color:'white', fontWeight:'bold'}}> Book Name :-</Text>
      <TextInput
        editable
        maxLength={20}
        onChangeText={(text) => onChangeText(text)}
        placeholder="Name your book"
        style={styles.Input}
      />
  </View>
</View>



<View style={{flex:3 ,}}>
<Text style={{alignSelf:'center',fontWeight:'bold',color:'white',
    fontSize:RFPercentage(5)}}> Added PDFs </Text>
         <FlatList
      data={paths.DocName}
      renderItem={renderItem}
      keyExtractor={(index) => index.toString()}
      initialNumToRender={12}
      style={{height:'100%'}}

    />

</View>
{show ?
<View style={{flex:0.8 ,justifyContent:'center',alignItems:'center'}}>
        <Pressable onPress = {() => CreateBookLocal()} style={[styles.Add,{borderColor:props.color}]}>
          <Text style={{ fontSize:RFPercentage(2), color: props.color, fontWeight: 'bold' }}>Add PDFs</Text>
        </Pressable>
</View> : null}


      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
        <Pressable onPress = {() => Cancle()} style={styles.Cancle}>
          <Text style={{ fontSize:RFPercentage(2.5), color: 'white', fontWeight: 'bold' }}>CANCLE</Text>
        </Pressable>

        <Pressable onPress = {() => OK() } style={styles.Save}>
          <Text style={{fontSize:RFPercentage(2.5), color: 'white', fontWeight: 'bold', color: 'white' }}>SAVE</Text>
        </Pressable>

      </View>
   </View>

{More ?
<Modal animationType="fade" transparent={true} visible={More}
 onRequestClose={() => {
          setMore(!More);
}}>

<BlurView intensity={20} tint="dark" style={{flex:1 ,padding:20}}>

        <Pdf
          trustAllCerts={false}
          source={{ uri: paths.Doc_Paths[open].toString(), cache: false }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {

          }}
          onError={(error) => {
            console.log(error);
          }}
          style={{flex:1 ,
              alignSelf:'stretch',
              backgroundColor:'transparent',
          }}
        />

</BlurView>
</Modal>
 : null }

</BlurView>
  </Animated.View>
    </Modal>

  );
};

const styles = StyleSheet.create({
  Create: {
    top:'5%',
    width:'100%',
    display:'flex',
    flex:0.8,
    gap:20,

  },
  headtext: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    color: 'white',
  },
  Input: {
    width: '60%',
  },
  Save: {
    width: '40%',
    height: '40%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#4bff11',
    borderWidth: 1,
    backgroundColor: '#77fe96',
  },
  Cancle: {
    width: '40%',
    height: '40%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff666a',
    borderWidth: 1,
    borderColor: 'red',
  },
listItem: {
    display:'flex',
    flexDirection:'row',
    height:'100%',
    overflow:'hidden',
    borderRadius:10,
    borderWidth:2,
    borderColor:'yellow',

  },
  Add: {
    width: '20%',
    height: '70%',
    backgroundColor:'white',
    borderRadius: RFPercentage(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    elevation:10,
  },


});

export default CreateBook;
