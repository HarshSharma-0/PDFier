import {Modal,StyleSheet,View,Text,Pressable,FlatList} from 'react-native';
import { RFPercentage} from "react-native-responsive-fontsize";
import {Image} from 'expo-image';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { MaterialIcons } from '@expo/vector-icons';
import React, {useState,useEffect , memo } from 'react';

const ReorderImage = (props) => {

const [isRerender,setRerender] = useState(false);
const [isSelected,setIsSelected] = useState(false);
const [isOther ,setOther] = useState(false);
const [copied,setCopied] = useState([]);


useEffect(() => {

async function set_data_copy(){
await setCopied([...props.ImageData]);
}
set_data_copy();
  }, []);

useEffect(()=> {

async function ChangeIndex () {
if(isOther !== false){
let tmp_data = [...copied];

  [tmp_data[isSelected].uri, tmp_data[isOther].uri] = [copied[isOther].uri, copied[isSelected].uri];
  [tmp_data[isSelected].height, tmp_data[isOther].height] = [copied[isOther].height, copied[isSelected].height];
  [tmp_data[isSelected].width, tmp_data[isOther].width] = [copied[isOther].width, copied[isSelected].width];
  [tmp_data[isSelected].token, tmp_data[isOther].token] = [copied[isOther].token, copied[isSelected].token];

 setCopied(tmp_data);
 setIsSelected(false);
 setOther(false);
}
}

ChangeIndex();

  }, [isOther]);

const renderReOrder = ({ item, index }) => {
  return (
    <View>
      <Pressable
        onPress={async () => {
          if (isSelected === false) {
            setIsSelected(index);
          } else {
            setOther(index);
          }
        }}
        style={[
          styles.listItem,
          {
            borderColor: isSelected === index ? '#11ff34' : isOther === index ? '#ff103a' : 'white',
            borderWidth: RFPercentage(0.2),
          },
        ]}
      >
        <Image
          style={{ height: RFPercentage(13), width: RFPercentage(13) }}
          source={item.uri}
          contentFit="cover"
        />
      </Pressable>
      <Text
        style={{
          fontWeight: 'bold',
          color: isSelected === index ? '#11ff34' : isOther === index ? '#ff103a' : 'grey',
          alignSelf: 'center',
          fontSize: RFPercentage(1.6),
        }}
      >
        {index+1}
      </Text>
    </View>
  );
};




return (
   <Modal
        animationType="fade"
        transparent={true}
        visible={props.up}
        onRequestClose={() => {
          props.down(!props.up);
        }}>


  <Pressable
   onPress={() => props.down(!props.up)}
 style={{flex:1,backgroundColor:'grey',opacity:0.3}} />


          <FlatList
      data={copied}
      renderItem={renderReOrder}
      keyExtractor={(item, index) => index.toString()}
      style={{backgroundColor:'white',height:"50%"}}
      extraData={isRerender}
      numColumns={3}
      columnWrapperStyle={styles.row}
    />
  <Pressable
   onPress={() => props.down(!props.up)}
 style={{flex:1,backgroundColor:'grey',opacity:0.3}} />


</Modal>
);
}

const styles = StyleSheet.create({

row: {
    flex: 1,
    gap:RFPercentage(3),
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


export default ReorderImage;
