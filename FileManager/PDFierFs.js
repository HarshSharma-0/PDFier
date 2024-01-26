import React, { useState, useEffect } from 'react';
import { Modal as ReactModal,BackHandler, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import {ProgressBar, Divider, Modal,FAB, List, Checkbox, Portal, Appbar } from 'react-native-paper';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import RNFS from 'react-native-fs';
import Colors from '../constants/colours';
import { usePDFier } from '../PdfierProvider/DataProvider';

const FileManagerModal = () => {

  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState(RNFS.ExternalStorageDirectoryPath);
  const [Progressed,setProgressed] = useState(0);
  const {MaxSelection,selectedPDFs,SetRecentDoc,ManagerMode,setSelectedPDFs,setManagerMode,OpenFileManager,setOpenFileManager} = usePDFier();

const handleBack = () => {
  if (currentDirectory !== RNFS.ExternalStorageDirectoryPath) {
    const parentDirectory = currentDirectory.substring(0, currentDirectory.lastIndexOf('/'));
    setCurrentDirectory(parentDirectory);
  }
};

  useEffect(() => {
   if(OpenFileManager === true){
    fetchFiles(currentDirectory);
    }else{
    return;
   }
  }, [currentDirectory,OpenFileManager]);




const fetchFiles = async (directory) => {
  try {
    const filesArray = await RNFS.readDir(directory);
    const filteredFiles = filesArray.filter(item => {
      const isPDFFile = item.name.endsWith('.pdf');
      return item.isDirectory() || isPDFFile;
    });
    setFiles(filteredFiles.slice(1,10));
  } catch (error) {
  }
};

const handlePress = async (file) => {

  if (file.isDirectory()) {
    setCurrentDirectory(file.path);
  } else {
    const isSelected = selectedPDFs.some((selectedFile) => selectedFile.path === file.path);
    if (isSelected) {
      setSelectedPDFs((prevSelected) => prevSelected.filter((selectedFile) => selectedFile.path !== file.path));
      setProgressed((selectedPDFs.length - 1)/MaxSelection);
    } else {

   if(selectedPDFs.length != MaxSelection){
    setProgressed((selectedPDFs.length + 1)/MaxSelection);
      setSelectedPDFs((prevSelected) => [
        ...prevSelected,
        { path: file.path, name: file.name },
      ]);
}
    }
}
};

  const handleDone = () => {
if(ManagerMode == 1){
      handleCancle();
}
   if(ManagerMode == 2){
       SetRecentDoc();
       handleCancle();
}
   if(ManagerMode == 3){

}
    handleCancle();
  };
  function handleCancle () {
     setProgressed(0);
     setOpenFileManager(false);
     return;
  };

  const renderIcon = (file) => {
    if (file.isDirectory()) {
      return <Ionicons name="folder-open-outline" size={24} color={Colors.primaryAlpha} />;
    } else if (file.name.endsWith('.pdf')) {
      return <FontAwesome name="file-pdf-o" size={24} color={Colors.redAlpha} />;
    } else {
      return <AntDesign name="file1" size={24} color="black" />;
    }
  };

  const MemoizedListItem = React.memo(({ item ,index }) => (
    <List.Item
      title={item.name}
      description={item.isDirectory() ? 'Directory' : 'File'}
      left={() => renderIcon(item)}
      right={() => (
        <>
          {item.isDirectory() ? null : (
            <Checkbox
              status={selectedPDFs.some(selectedFile => selectedFile.path === item.path) ? 'checked' : 'unchecked'}
              onPress={() => handlePress(item)}
              disabled={selectedPDFs.length === 0}
            />
          )}
        </>
      )}
    />
  ));

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <MemoizedListItem item={item} />
      <Divider style={{ marginLeft: 10, marginRight: 10 }} />
    </TouchableOpacity>
  );



  return (
      <ReactModal visible={OpenFileManager}>
        <BlurView intensity={10} tint="dark" style={StyleSheet.absoluteFill}>
          <View style={{ flex: 1 ,backgroundColor:'transparent'}}>
            <List.Item
              title={currentDirectory}
              left={() => <List.Icon icon="arrow-left" color={Colors.pink} />}
              theme={{ colors: { primary: Colors.pink }}}
              onPress={() => handleBack()}
            />
            <ProgressBar progress={Progressed} />
            <List.Section title="Files and Folders">
              <Divider />
              <FlatList data={files} keyExtractor={(item) =>  item.path} renderItem={renderItem} />
            </List.Section>
            {selectedPDFs.length > 0 && (
              <FAB
                icon="check"
                label="Proceed"
                style={{ position: 'absolute', bottom: 16, right: 16, borderRadius: 10 }}
                onPress={handleDone}
              />
            )}

            {currentDirectory !== RNFS.ExternalStorageDirectoryPath && (
              <FAB
                icon="keyboard-backspace"
                label="Back"
                style={{ position: 'absolute', bottom: 16, left: 16, borderRadius: 10}}
                onPress={handleBack}
              />
            )}

            {currentDirectory == RNFS.ExternalStorageDirectoryPath && (
              <FAB
                icon="keyboard-backspace"
                label="Cancle"
                style={{ position: 'absolute', bottom: 16, left: 16, borderRadius: 10 ,backgroundColor:Colors.redAlpha}}
                onPress={() => handleCancle ()}
              />
            )}

          </View>
        </BlurView>
      </ReactModal>
  );
};

export default FileManagerModal;
