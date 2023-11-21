import React, { useState , useEffect } from 'react';
import { RFPercentage } from "react-native-responsive-fontsize";
import { TextInput , View, Text,Pressable ,TouchableOpacity, Modal, StyleSheet } from 'react-native';
import {ViewDefault , share_will_proceed ,setBookName, setSharedBook} from "./constants/DataAccess";
import { router} from 'expo-router';

const HandleBoth = (props) => {

  const [modalVisible, setModalVisible] = useState(true);
  const [trackInp, setInp] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [VisiInput , setInpVisible] = useState(false);
  const closeModal = () => setModalVisible(false);

useEffect(() => {
   if(props.someData.PDF.length > 0 && props.someData.Image.length > 0){
    setInp(1);
   }else if( props.someData.Image.length > 0 ){
   props.canExit(false);
   share_will_proceed(props.someData.Image);
   router.replace("/(tabs)/createpdf");
} else{
   setInp(3);
}
  }, []);

  return (

<Modal
  visible={modalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => {

  if(VisiInput === false){
    closeModal();
    props.canExit(false);
}

  }}
>
  <Pressable
    style={{ flex: 1 , backgroundColor:'rgba(0,0,0,0.3)'}}
    onPress={() => {

if(VisiInput === false){
    closeModal();
    props.canExit(false);
}

    }}
  >
    <View style={styles.modalContainer}>
      {VisiInput ? (
        <View style={styles.modalContent}>
          <TextInput
            style={styles.inputField}
            placeholder="Enter book name"
            value={inputValue}
            onChangeText={(text) => setInputValue(text)}
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={() => setInpVisible(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={ async () => {
              setSharedBook(props.someData.PDF);
              await setBookName(inputValue);
              router.replace("/(tabs)/pdfview");
              closeModal();
              props.canExit(false);
            }}>
              <Text style={styles.okButton}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.modalContent}>
            <Text style={{
       alignSelf:'center',
       fontSize:RFPercentage(2.5),
       color:'grey',
        }}>
              {trackInp === 1 ? 'Both PDF and Image Received' : trackInp === 3 ? 'PDF Received' : ' '}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => {
              if (trackInp === 1) {
                props.CallBack(true);
              } else if(trackInp === 3){
                setInpVisible(true);
              }else{}
            }}>
              <Text style={styles.button}>
                {trackInp === 1 ? 'View PDF' : trackInp === 3 ? 'Create Book' : ' '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              if (trackInp === 3) {
                props.CallBack(true);
              }else{
   props.canExit(false);
   share_will_proceed(props.someData.Image);
   router.replace("/(tabs)/createpdf");
        }
            }}>
              <Text style={styles.button}>
                {trackInp === 1 ? 'Create PDF' : trackInp === 3 ? 'View PDF' : ' '}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  </Pressable>
</Modal>

  );
};

const styles = StyleSheet.create({
  openButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  openButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: RFPercentage(2.7),
    borderTopWidth:RFPercentage(0.1),
    borderLeftWidth:RFPercentage(0.1),
    borderRightWidth:RFPercentage(0.1),
    borderTopLeftRadius: RFPercentage(2),
    borderTopRightRadius: RFPercentage(2),
    borderColor:'grey',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: RFPercentage(1),
    backgroundColor: '#f2f2f2',
    borderLeftWidth:RFPercentage(0.1),
    borderRightWidth:RFPercentage(0.1),
    borderColor:'grey',
  },
  button: {
    color: 'blue',
    fontWeight: 'bold',
  },
cancelButton: {
    color: 'red',
    fontWeight: 'bold',
  },
okButton: {
    color: 'green',
    fontWeight: 'bold',
  },
buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
});

export default HandleBoth;
