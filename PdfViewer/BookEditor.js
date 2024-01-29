import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity,FlatList } from 'react-native';
import {Title,SegmentedButtons, Divider,Dialog, TextInput, Button, List, IconButton, Portal } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { usePDFier } from '../PdfierProvider/DataProvider';

const EditModal = ({ visible, onDismiss, onSave, data, color, openFileManager, onFileManagerClose, FileManagerReturn }) => {

  const {setMode,copyFiles,BookDir,setMaxSelection} = usePDFier();
  const [BookName, setBookName] = useState('');
  const [ MaxPdfView, setMaxView] = useState(0);
  const [DocName, setDocName] = useState([]);
  const [Paths, setPaths] = useState([]);
  const [isAdd, setAdd] = useState(false);
  const [current,setCurrent] = useState(0);
  const [Cached,setCached] = useState(false);
  const [error,setError] = useState(false);


  const addPdf = () => {
    setMode(1);
    const Max = MaxPdfView - current;
    setMaxSelection(Max);
    openFileManager(true);
    setAdd(true);
  };

  const deletePdf = (indexToRemove) => {
    setDocName((prevDocName) => prevDocName.filter((_, index) => index !== indexToRemove));
    setPaths((prevPaths) => prevPaths.filter((_, index) => index !== indexToRemove));
    setCurrent((prevVal) => prevVal - 1);
  };

  const saveChanges = () => {
const tmpName = BookName;
if (tmpName.trim().length > 0 && tmpName.length >= 5) {
    onSave({ BookName,MaxPdfView, DocName, Paths ,current,Cached});
} else {
setError(true);
}
  };

  useEffect(() => {
    if (data) {
      setBookName(data.BookName || '');
      setMaxView(data.MaxPdfView || 0);
      setDocName(data.DocName || []);
      setPaths(data.Paths || []);
      setCurrent( data.current || 0);
      setCached(data.Cached || false);
      setMaxSelection(data.MaxPdfView || 0);
    }
  }, [data]);

async function handleAdd(){
    if (isAdd && !onFileManagerClose) {
      const CopyPath = BookDir +"/"+ data.BookName;
      const newDocNames = FileManagerReturn.map((pdf) => pdf.name);
      const newPaths = FileManagerReturn.map((pdf) => CopyPath +"/"+pdf.name);
      const ExactPath = FileManagerReturn.map((pdf) => pdf.path);
      if(!Cached){
       await copyFiles(ExactPath,CopyPath);
      }
      const current = DocName.length + newPaths.length;
      setDocName((prevDocName) => [...prevDocName, ...newDocNames]);
      setPaths((prevPaths) => [...prevPaths, ...newPaths]);
      setCurrent(current);
      setAdd(false);
    }
}
  useEffect(() => {
    handleAdd();
  }, [onFileManagerClose]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Edit Book</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Name"
            value={BookName}
             onChangeText={(text) => {
                 setBookName(text);
                 setError(text.trim().length === 0 || text.length < 5);
             }}
            textColor={color}
            activeUnderlineColor={color}
            error={error}
   />
            <Title>MaxPdf</Title>
             <Divider  style={{backgroundColor:color,margin:RFPercentage(1)}}/>
          <SegmentedButtons
theme={{ colors: { primary: color } }}
        value={MaxPdfView}
        onValueChange={(val) => {
         setMaxView(val);
}}
        buttons={[
          {
            value: 5,
            label: "5",
            showSelectedCheck: true,
            disabled: 5 < current ? true : false,
          },
          {
            value: 8,
            label: '8',
            showSelectedCheck: true,
            disabled: 8 < current ? true : false,
          },
          {
            value: 12 ,
            label: '12',
            showSelectedCheck: true,
            disabled: 12 < current ? true : false,
          },
          {
            value: 15 ,
            label: '15',
            showSelectedCheck: true,
          },
        ]}
      />
            <Divider  style={{backgroundColor:color,margin:RFPercentage(1)}}/>
            <List.Subheader>Current PDFs :- {current} </List.Subheader>
          <ScrollView style={{height:RFPercentage(20)}}>
              {Paths.map((pdf, index) => (
              <View key={index}>
                <List.Item
                  description={pdf}
                  title={DocName[index]}
                  right={() => (
                    <TouchableOpacity onPress={() => deletePdf(index)}>
                      <IconButton icon="delete" />
                    </TouchableOpacity>
                  )}/>
                <Divider style={{backgroundColor:color,marginLeft:'5%',marginRight:'5%'}}/>
                </View>
              ))}
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={addPdf} textColor={color}>Add PDF</Button>
          <Button onPress={onDismiss} textColor={color}>Cancle</Button>
          <Button onPress={saveChanges} textColor={color}>Save</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>

  );
};

export default EditModal;




