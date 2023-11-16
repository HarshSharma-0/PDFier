import {Modal,StyleSheet,View,Text,Pressable,FlatList} from 'react-native';
import { RFPercentage} from "react-native-responsive-fontsize";
import React, {useState,useEffect} from 'react';
import Pdf from 'react-native-pdf';

const ReorderImageSingle = (props) => {

const [isRerender,setRerender] = useState(false);
const [isSelected,setIsSelected] = useState(false);
const [isOther ,setOther] = useState(false);
const [copied,setCopied] = useState([]);
const [ isVisible,setVisible] = useState(true);
const [intChanged,setChanged] = useState(0);
useEffect(() => {

async function set_data_copy(){
await setCopied([...props.PdfData]);
}
set_data_copy();
  }, []);




const renderReOrder = ({ item , index }) => (
  <View>
  <Pressable
    onPress ={ async () => {
   if(props.up[index] === true || props.isSlected === index){
   }else{
   let tmp_flex = [...props.up];
       tmp_flex[props.indexSlected] = false;
       tmp_flex[index] = true;
       props.setIndexSelected(index);
       setOther(index);
       props.down(tmp_flex);
}

      }}

       style={[
     styles.listItem,{
    borderColor: props.up[index]
  ? isOther === index
    ? "#ff103a"
    : props.indexSlected === index
    ? 'yellow'
    : '#11ff34'
  : isOther === index
  ? "#ff103a"
  : 'grey',
    borderWidth:RFPercentage(0.3)}]}
     >
   <View style={{height:RFPercentage(13),width:RFPercentage(13)}}>
            <Pdf
          trustAllCerts={false}
          source={{ uri: item, cache: false }}
          singlePage={true}
          style={{flex:1,
              alignSelf:'stretch',
          }}
        />
    </View>
  </Pressable>
<Text style={{
    fontWeight:'bold',
color: props.up[index]
  ? isOther === index
    ? "#ff103a"
    : props.indexSlected === index
    ? 'yellow'
    : '#11ff34'
  : isOther === index
  ? "#ff103a"
  : 'grey',
    alignSelf:'center',
   fontSize:RFPercentage(1.6)
  }}>
  {index+1}
</Text>
 </View>
);

return (
   <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          setVisible(false);
          props.close(!props.open);
        }}>
  <Pressable
   onPress={() => {
  setVisible(false);
  props.close(!props.open);
}}
 style={{flex:1,backgroundColor:'grey',opacity:0.3}} />
          <FlatList
      data={copied}
      renderItem={renderReOrder}
      keyExtractor={(item, index) => index.toString()}
      style={{backgroundColor:'white',height:"50%",borderRadius:RFPercentage(1),borderWidth:RFPercentage(0.2),borderColor:'rgba(255,0,0,0.5)'}}
      extraData={isRerender}
      numColumns={3}
      columnWrapperStyle={styles.row}
    />
  <Pressable
   onPress={() => {
   setVisible(false);
   props.close(!props.open);
}}
 style={{flex:1,backgroundColor:'grey',opacity:0.3}} />
</Modal>
);
}

const styles = StyleSheet.create({

row: {
    flex: 1,
    gap:RFPercentage(2.5),
    marginVertical: RFPercentage(3),
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


export default ReorderImageSingle;
