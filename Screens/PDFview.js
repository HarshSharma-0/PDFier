import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import {Divider,Appbar, FAB, Card,useTheme, Title, Paragraph, TextInput, Modal, Portal, Button } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BlurView } from 'expo-blur';
import Colors from '../constants/colours';
import { usePDFier } from '../PdfierProvider/DataProvider';

export default function Home() {
const {colors} = useTheme();
  const {CreatedPdfBook,selectedPDFs,setSelectedPDFs,setOpenFileManager} = usePDFier();


  const [isDialogVisible, setDialogVisible] = useState(false);
  const [bookName, setBookName] = useState('');

  const showFilePicker = async () => {
setOpenFileManager(true);
  };

  function CancleCreation(){
        setSelectedPDFs([]);
        setBookName('');
        setDialogVisible(false);
   }


  const createNewBook = () => {

    setBookName('');
    setSelectedPDFs([]);
    setDialogVisible(false);
  };

  return (
     <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill}>
      <Appbar.Header style={{backgroundColor:'transparent',elevation:0}}>
        <Appbar.Content
          title="PDFview"
          titleStyle={{
    fontSize: 50, // Set your desired font size
    fontWeight: 'bold',
    alignSelf:'center',
    color:colors.accent,
  }}
        />
      </Appbar.Header>
<Divider />
    <SafeAreaView style={styles.root}>
      <View style={styles.buttonContainer}>
        <Button style={[styles.button,{backgroundColor:colors.accent}]} mode="contained" onPress={() => setDialogVisible(true)}>
              Create PDFbook
        </Button>
        <Button style={[styles.button,{backgroundColor:colors.accent}]} onPress={() => setDialogVisible(true)} mode="contained">
             View PDFs
        </Button>
      </View>
   <Title>Your Created Books</Title>
<Divider />
       <Card style={styles.cardContainer}>
          <Card.Content>
          </Card.Content>
          <ScrollView>
            {CreatedPdfBook && CreatedPdfBook.map((book) => (
              <Card.Content key={book.id}>
                <Title>{book.title}</Title>
                <Paragraph>{book.description}</Paragraph>
              </Card.Content>
            ))}
          </ScrollView>
        </Card>
<Divider style={{backgroundColor:colors.accent}}/>
      <Portal>
        <Modal visible={isDialogVisible} onDismiss={() => setDialogVisible(false)} contentContainerStyle={styles.modalContainer}>
      <BlurView intensity={50} tint="dark" style={styles.blurView}>

            <Title>Create New Book</Title>
            <TextInput
              mode="outlined"
              label="Book Name"
              value={bookName}
              onChangeText={(text) => setBookName(text)}
              activeOutlineColor={colors.accent}
              textColor={colors.accent}
            />
      <Button mode="contained" onPress={showFilePicker} style={[styles.filePickerButton,{backgroundColor:colors.accent}]}>
              Open File Browser
            </Button>
        <Card style={styles.cardContainerCreate}>
          <Card.Content>
            <Title>Recently Viewed PDFs</Title>
          </Card.Content>
          <ScrollView>
            {selectedPDFs && selectedPDFs.map((pdf) => (
           <Card key={pdf.id} style={styles.card}>
            <Card.Content style={styles.content}>
              <Title style={styles.title}>{pdf.title}</Title>
              <Paragraph style={styles.description}>{pdf.description}</Paragraph>
            </Card.Content>
          </Card>
            ))}
          </ScrollView>
        </Card>
       <View style={{flexDirection:'row',justifyContent:'space-between'}}>
         <Button onPress={() => CancleCreation()} style={[styles.createButton,{backgroundColor:colors.accent}]} mode="contained" >
              Cancle
            </Button>
            <Button onPress={createNewBook} style={[styles.createButton,{backgroundColor:colors.accent}]} mode="contained" >
              Create
            </Button>
        </View>
          </BlurView>

        </Modal>
       </Portal>
    </SafeAreaView>
</BlurView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: RFPercentage(2),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RFPercentage(2),
  },
  fab: {
  },
  cardContainer: {
    flex:1,
    marginTop:RFPercentage(2),
  },
  cardContainerCreate:{
    flex:1,
    marginTop:RFPercentage(2),
    backgroundColor:'transparent',
    elevation:0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  blurView: {
    padding: RFPercentage(2),
    paddingTop:RFPercentage(5),
    flex:1,
  },
  filePickerButton: {
    marginVertical: RFPercentage(1),
    backgroundColor:Colors.greenAlpha,
  },
  selectedPDFItem: {
    marginVertical: RFPercentage(1),
  },
  createButton: {
    marginTop: RFPercentage(2),
    marginRight: RFPercentage(1),
    flex:1,
    backgroundColor:Colors.greenAlpha,
  },
button: {
    flex: 1,
    marginRight: RFPercentage(1),
    backgroundColor:Colors.greenAlpha,
  },
card: {
    marginVertical: RFPercentage(1),
    flexDirection: 'row',
  },
  thumbnail: {
    width: RFPercentage(10), // Set your desired width
    height: RFPercentage(10), // Set your desired height
    borderRadius: RFPercentage(2), // Set your desired border radius
    marginRight: RFPercentage(2), // Adjust as needed
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: RFPercentage(2.5), // Set your desired font size
    fontWeight: 'bold',
  },
  description: {
    fontSize: RFPercentage(2), // Set your desired font size
  },

});
