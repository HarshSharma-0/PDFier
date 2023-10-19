import React, { useState,useEffect,useRef } from 'react';
import { Modal, Animated , Text, View, StyleSheet, TextInput , Dimensions , Pressable } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { setBookName } from '../(tabs)/DataAccess';
import { BlurView } from 'expo-blur';


const CreateBook = (props) => {

  const  height  = Dimensions.get('window').height;
  const [textVal, onChangeText] = useState(' ');
  const [modalVisible, setModalVisible] = useState(false);



useEffect(() => {
 setModalVisible(true);
}, []);

  return (
<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
<BlurView intensity={20} tint="dark" style={{flex:1}}>
   <View style={{flex:1}}>
    <View style={styles.Create}>
      <Text style={styles.headtext}>Name Your Book</Text>
      <TextInput
        editable
        maxLength={10}
        onChangeText={(text) => onChangeText(text)}
        placeholder="Name your book"
        style={styles.Input}
      />
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
        <Pressable  style={styles.Cancle}>
          <Text style={{ fontSize:RFPercentage(2.5), color: 'white', fontWeight: 'bold' }}>CANCEL</Text>
        </Pressable>

        <Pressable  style={styles.Save}>
          <Text style={{fontSize:RFPercentage(2.5), color: 'white', fontWeight: 'bold', color: 'white' }}>SAVE</Text>
        </Pressable>
  </View>
      </View>
   </View>
</BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  Create: {
    top:'20%',
    width: '80%',
    height: '20%',
    left:'10%',
    right:'10%',
    borderRadius: 10,
    borderColor: '#f75710',
    backgroundColor:'white',
    borderWidth:2,
    display:'flex',

  },
  headtext: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#5b2afb',
  },
  Input: {
    width: '80%',
    borderRadius: 5,
    marginTop: '5%',
    marginLeft: '10%',
    marginRight: '10%',
    borderWidth: 1,
    borderColor: '#fff408',
    textAlign: 'center',
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
});

export default CreateBook;
