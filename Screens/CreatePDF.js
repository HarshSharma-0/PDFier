import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import {Divider,Appbar, FAB, Card,useTheme, Title, Paragraph, TextInput, Modal, Portal, Button } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BlurView } from 'expo-blur';
import Colors from '../constants/colours';

export default function Home() {

  const {colors} = useTheme();

  const [createdBooks, setCreatedBooks] = useState([
    { id: 1, title: 'Book 1', description: 'Description 1' },
    { id: 2, title: 'Book 2', description: 'Description 2' },
    { id: 3, title: 'Book 3', description: 'Description 3' },
    // Add more dummy data as needed
  ]);

  const [recentPDFs, setRecentPDFs] = useState([
    { id: 1, title: 'PDF 1', description: 'Description 1' },
    { id: 2, title: 'PDF 2', description: 'Description 2' },
    { id: 3, title: 'PDF 3', description: 'Description 3' },
    { id: 4, title: 'Book 1', name: 'Description 1' },
    { id: 5, title: 'Book 2', name: 'Description 2' },
    { id: 6, title: 'Book 3', name: 'Description 3' },
    // Add more dummy data as needed
  ]);

  const [isDialogVisible, setDialogVisible] = useState(false);
  const [bookName, setBookName] = useState('');
  const [selectedPDFs, setSelectedPDFs] = useState([
    { id: 1, title: 'Book 1', name: 'Description 1' },
    { id: 2, title: 'Book 2', name: 'Description 2' },
    { id: 3, title: 'Book 3', name: 'Description 3' },
    { id: 4, title: 'Book 1', name: 'Description 1' },
    { id: 5, title: 'Book 2', name: 'Description 2' },
    { id: 6, title: 'Book 3', name: 'Description 3' },
    // Add more dummy data as needed
  ]);

  const showFilePicker = async () => {

  };

  const createNewBook = () => {

    setBookName('');
    setSelectedPDFs([]);
    setDialogVisible(false);
  };

  return (
     <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill}>
      <Appbar.Header style={{backgroundColor:'transparent',elevation:0}}>
        <Appbar.Content
          title="CreatePDF"
          titleStyle={{
    fontSize: 50, // Set your desired font size
    fontWeight: 'bold',
    alignSelf:'center',
    color:Colors.redAlpha,
  }}
        />
      </Appbar.Header>
<Divider />
    <SafeAreaView style={styles.root}>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} onPress={() => setDialogVisible(true)} mode="contained">
              Create PDF
        </Button>
      </View>
   <Title>Your Created PDFs</Title>
<Divider />

       <Card style={styles.cardContainer}>
          <Card.Content>
          </Card.Content>
          <ScrollView>
            {createdBooks.map((book) => (
              <Card.Content key={book.id}>
                <Title>{book.title}</Title>
                <Paragraph>{book.description}</Paragraph>
              </Card.Content>
            ))}
          </ScrollView>
        </Card>
<Divider style={{backgroundColor:Colors.redAlpha}}/>
      <Title>LOG OF PDF CREATION</Title>
<Divider />
        <Card style={[styles.cardContainer,{backgroundColor:'transparent',elevation:0}]}>
          <Card.Content>
          </Card.Content>
          <ScrollView>
            {recentPDFs.map((pdf) => (
              <Card.Content key={pdf.id}>
                <Title>{pdf.title}</Title>
                <Paragraph>{pdf.description}</Paragraph>
              </Card.Content>
            ))}
          </ScrollView>
        </Card>
<Divider style={{backgroundColor:Colors.redAlpha}}/>

      <Portal>
        <Modal visible={isDialogVisible} onDismiss={() => setDialogVisible(false)} contentContainerStyle={styles.modalContainer}>
      <BlurView intensity={50} tint="dark" style={styles.blurView}>

            <Title>Create New PDF</Title>
            <TextInput
              mode="outlined"
              label="PDF Name"
              value={bookName}
              onChangeText={(text) => setBookName(text)}
              activeOutlineColor={Colors.redAlpha}
              textColor={Colors.redAlpha}
            />
      <Button mode="contained" onPress={showFilePicker} style={styles.filePickerButton}>
              Open Image Browser
            </Button>
        <Card style={styles.cardContainerCreate}>
          <Card.Content>
            <Title>Added Images</Title>
          </Card.Content>
          <ScrollView>
            {recentPDFs.map((pdf) => (
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
         <Button onPress={createNewBook} style={styles.createButton} mode="contained" >
              Cancle
            </Button>
            <Button onPress={createNewBook} style={styles.createButton} mode="contained" >
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
    backgroundColor:Colors.redAlpha,
  },
  selectedPDFItem: {
    marginVertical: RFPercentage(1),
  },
  createButton: {
    marginTop: RFPercentage(2),
    marginRight: RFPercentage(1),
    flex:1,
    backgroundColor:Colors.redAlpha,
  },
button: {
    flex: 1,
    marginRight: RFPercentage(1),
    backgroundColor:Colors.redAlpha,
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
