import React, { useState, useEffect } from 'react';
import { Modal as ReactModal,FlatList,StyleSheet, View, SafeAreaView, ScrollView} from 'react-native';
import {TouchableRipple,List,IconButton,Divider,Appbar, FAB, Card,useTheme,Text, Title, Paragraph, TextInput, Modal, Portal, Button } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BlurView } from 'expo-blur';
import Colors from '../constants/colours';
import { usePDFier } from '../PdfierProvider/DataProvider';
import Pdf from 'react-native-pdf';
import PDFViewer from '../PdfViewer/PDFViewer.js';
import EditDialog from '../PdfViewer/BookEditor.js';
import RNFS from 'react-native-fs';

export default function Home() {
  const {colors} = useTheme();

  const {deleteDirectoryContents,setMode,MaxPdfView,setMaxSelection,BookDir,setCreatedPdfBook,OpenFileManager,OpenRecent,OpenBook,RemovePdfBook,AddPdfBook,CreatedPdfBook,RecentViewed,selectedPDFs,setSelectedPDFs,setOpenFileManager} = usePDFier();

  const [isDialogVisible, setDialogVisible] = useState(false);
  const [ error,setError ] = useState(false);
  const [bookName, setBookName] = useState('');
  const [loadIndex,setLoadIndex] = useState(null);

  const [EditWindow,setEditWindow] = useState(false);
  const [Edit,setEdit] = useState(null);
  const [TmpEditData,setTmpEditData] = useState(null);

  async function CancleCreation(){
        setMode(0);
        setBookName('');
        setDialogVisible(false);
        if(selectedPDFs.length > 0){
       	deleteDirectoryContents(selectedPDFs);
        }
         setSelectedPDFs([]);
   }

  const showFilePicker = async () => {
      const Max = MaxPdfView-selectedPDFs.length;
      setMaxSelection(Max);
      setMode(1);
      setOpenFileManager(true);
      return;
  };

 const OpenView = async () => {
      setMode(2);
      setMaxSelection(MaxPdfView);
      setOpenFileManager(true);
      return;
  };

  const createNewBook = () => {
  const tmpName = bookName;

if (tmpName.trim().length > 0 && tmpName.length >= 5) {
    AddPdfBook(tmpName);
    setSelectedPDFs([]);
    setBookName('');
    setDialogVisible(false);
} else {
setError(true);

}

  };

  return (
      <View style={{flex:1}}>
      <Appbar.Header style={{backgroundColor:'transparent',elevation:0}}>
        <Appbar.Content
          title="PDFier"
          titleStyle={{
    fontSize: RFPercentage(6),
    fontWeight: 'bold',
    alignSelf:'center',
    color:colors.primary,
  }}
        />
      </Appbar.Header>
<Divider />
    <SafeAreaView style={styles.root}>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} mode="contained" onPress={() => setDialogVisible(true)}>
              Create PDFbook
        </Button>
        <Button style={styles.button} onPress={() => OpenView()} mode="contained">
             View PDFs
        </Button>
      </View>
   <Title>Your Created Books</Title>
<Divider />
       <Card style={styles.cardContainer}>
          <ScrollView>
            {CreatedPdfBook && CreatedPdfBook.map((book,index) => (

<View>
<TouchableRipple
    onPress={() => OpenBook(index)}
    onLongPress={() => {
       setTimeout(() => {
       RemovePdfBook(index);
       setLoadIndex(null);
     }, 500);
    }}
    onPressIn={() => setLoadIndex(index)}
    onPressOut={() => setLoadIndex(null)}
    rippleColor="rgba(0, 0, 0, .32)"
  >
<View style={{flexDirection:'row'}}>
 <View style={{backgroundColor:colors.primary,borderTopLeftRadius:RFPercentage(0.5),borderBottomLeftRadius:RFPercentage(0.5)}}>
    <Text style={{color:'white'}}>Book Name: {book.BookName.slice(0, 5)}</Text>
    <Text style={{color:'white'}}>Max: {book.MaxPdfView}</Text>
    <Text style={{color:'white'}}>Current: {book.current}</Text>
   </View>

  <View style={{alignitems:'center',justifyContent:'center',gap:RFPercentage(0.6)}}>
  { book.current === 0 ?
  <>
   <Text style={{color:'#ff3600' , fontSize:RFPercentage(2),alignSelf:'center'}} > EMPTY </Text>
   <Text style={{color:'grey' , fontSize:RFPercentage(2),alignSelf:'center'}} > LongPress to Delete </Text>
  </> :
 <>
   <Text style={{color:'grey' , fontSize:RFPercentage(2),alignSelf:'center'}} > Press Here to View </Text>
   <Text style={{color:'grey' , fontSize:RFPercentage(2.3),alignSelf:'center'}} > LongPress to Delete </Text>
  </>
}
  </View>
  <View style={{backgroundColor:colors.primary,borderRadius:RFPercentage(50),margin:RFPercentage(1)}}>
 <IconButton
      icon="circle-edit-outline"  // Replace with your edit icon
      onPress={() => {
       setEditWindow(true);
       setEdit(index);
       setTmpEditData({...CreatedPdfBook[index]});
       }}  // Replace with your edit action
      animated={true}
      loading={loadIndex == index ? true : false}
      size={RFPercentage(3)}
    />
  </View>
  </View>
</TouchableRipple>
<Divider style={{backgroundColor:colors.primary,margin:RFPercentage(1)}}/>
</View>
            ))}
          </ScrollView>
        </Card>
<Divider style={{backgroundColor:colors.primary}}/>

      <Title>Recently Viewed PDFs</Title>
<Divider />
        <Card style={styles.cardContainer}>
          <Card.Content>
          </Card.Content>
          <ScrollView>
            {RecentViewed && RecentViewed.map((pdf,index) => (
<View>
  <TouchableRipple
    onPress={() => OpenRecent(index)}
    rippleColor="rgba(0, 0, 0, .32)"
  >
  <View style={styles.listItem}>
   <View style={{flex:1 , backgroundColor:colors.primary,justifyContent:'center'}}>
    <Text style={{fontWeight:'bold',alignSelf:'center', color:'white'}}>{index+1}) RecentlyOpened</Text>
   </View>

  <View style={{flex:2}}>
{pdf.DocName ? pdf.DocName.map((docName, mapIndex) => (
          <Text key={mapIndex} style={{ padding: RFPercentage(0.1), fontSize: RFPercentage(2), fontWeight: 'bold', color: 'grey' }}> {mapIndex+1})
            {docName.length > 30 ? `  ${docName.slice(0, 20)}...` : '  ' + docName}
          </Text>
        )) : null}

     </View>
 </View>
</TouchableRipple>
<Divider style={{backgroundColor:colors.primary,margin:RFPercentage(1)}}/>
</View>

            ))}
          </ScrollView>
        </Card>
<Divider style={{backgroundColor:colors.primary}}/>

 <ReactModal visible={isDialogVisible} animationType="slide" transparent>
      <BlurView intensity={20} tint="dark" style={styles.blurView}>
            <Title>Create New Book</Title>
            <TextInput
              mode="outlined"
              label="Book Name"
              error={error}
              value={bookName}
              onChangeText={(text) => {
                 setBookName(text);
                 setError(text.trim().length === 0 || text.length < 5);
             }}
            />
      <Button mode="contained" onPress={showFilePicker} style={styles.filePickerButton}>
              Open File Browser
            </Button>
        <Card style={styles.cardContainerCreate}>
          <Card.Content>
            <Title>Selected PDFs</Title>
          </Card.Content>
<FlatList
  data={selectedPDFs}
  renderItem={({ item: pdf, index }) => (
    <View style={{ margin: RFPercentage(1) }} key={index}>
      <Divider key={`divider-${index}`} style={{ backgroundColor: colors.primary }} />

      <View key={`content-${index}`} style={{ flexDirection: 'row', padding: RFPercentage(1), gap: RFPercentage(1) }}>
        <View style={{ flex: 0.5 }}>
          <Pdf
            singlePage={true}
            trustAllCerts={false}
            source={{ uri: pdf.path, cache: false }}
            style={styles.thumbnail}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Title>
            Doc Name :-{' '}
            <Text style={{ color: 'grey', fontSize: RFPercentage(2) }}>{pdf.name}</Text>
          </Title>
          <Title>
            Doc Paths :-
          </Title>
          <Paragraph style={{ color: 'grey' }}>{pdf.path}</Paragraph>
        </View>
      </View>

      <Divider key={`divider2-${index}`} style={{ backgroundColor: colors.primary }} />
    </View>
  )}
  keyExtractor={(pdf, index) => index.toString()}

/>
        </Card>
       <View style={{flexDirection:'row',justifyContent:'space-between'}}>
         <Button onPress={() => CancleCreation()} style={styles.createButton} mode="contained" >
              Cancle
            </Button>
            <Button onPress={createNewBook} style={styles.createButton} mode="contained" >
              Create
            </Button>
        </View>
          </BlurView>
        </ReactModal>
    </SafeAreaView>
<PDFViewer />
<EditDialog
  visible={EditWindow}
  color={`${colors.primary}`}
  onDismiss={() => {
    setEditWindow(false);
    setEdit(null);
    setSelectedPDFs([]);
  }}
  openFileManager={()=> {setMode(1); setOpenFileManager(true);}}
  onFileManagerClose={OpenFileManager}
  FileManagerReturn={selectedPDFs}
  onSave={(updatedData) => {

  if (updatedData.BookName !== TmpEditData.BookName && !TmpEditData.Cached) {
    const oldPath = `${BookDir}/${TmpEditData.BookName}`;
    const newPath = `${BookDir}/${updatedData.BookName}`;
    updatedData.Paths = updatedData.DocName.map((filename) => `${BookDir}/${updatedData.BookName}/${filename}`);
    RNFS.moveFile(oldPath, newPath);
  }

  setCreatedPdfBook((prevDataArray) => prevDataArray.map((item, index) => (index === Edit ? updatedData : item)));
  setEdit(null);
  setEditWindow(false);
  setSelectedPDFs([]);
}}
  data={TmpEditData} // Pass the data you want to edit
/>
</View>
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
    padding:RFPercentage(1),
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
  },
  selectedPDFItem: {
  },
  createButton: {
    marginTop: RFPercentage(2),
    marginRight: RFPercentage(1),
    flex:1,
  },
button: {
    flex: 1,
    marginRight: RFPercentage(1),
  },
card: {
    marginVertical: RFPercentage(1),
},
  thumbnail: {
    flex:1,
    alignSelf:'stretch',
    backgroundColor:'transparent',
  },
  content: {
    alignItems: 'center',
    height:RFPercentage(15),
    borderTopRightRadius:10,
    borderBottomRightRadius:10,
    flexDirection: 'row',
    backgroundColor:'red',
  },
  title: {
    fontSize: RFPercentage(2.5), // Set your desired font size
    fontWeight: 'bold',
  },
  description: {
    fontSize: RFPercentage(2), // Set your desired font size
  },
listItem: {
    backgroundColor:'transparent',
    display:'flex',
    overflow:'hidden',
    flexDirection:'row',
    margin: RFPercentage(1),
    borderRadius: RFPercentage(0.6),

  },

});
