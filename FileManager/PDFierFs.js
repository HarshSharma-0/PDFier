import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Modal as ReactModal,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {RadioButton,TouchableRipple,ProgressBar, Divider, Modal, FAB, List, Checkbox } from 'react-native-paper';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Colors from '../constants/colours';
import { usePDFier } from '../PdfierProvider/DataProvider';
import RNFS from 'react-native-fs';

const FileManagerModal = () => {

  const [files, setFiles] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState(RNFS.ExternalStorageDirectoryPath);
  const [Progressed, setProgressed] = useState(0);
  const {Mode,setMode,MaxSelection,selectedPDFs,SetRecentDoc,setSelectedPDFs,setManagerMode,OpenFileManager,setOpenFileManager} = usePDFier();

  useEffect(() => {
    if (OpenFileManager === true) {
      fetchFiles(currentDirectory);
    } else {
      return;
    }
  }, [OpenFileManager]);

  useEffect(() => {
console.log("files Changed");
  }, [files]);


const fetchFiles = async (directory) => {
    const filesArray = await RNFS.readDir(directory);

    const filteredFiles = filesArray.filter(item => {
      const isPDFFile = item.name.endsWith('.pdf');
      const isPDFFiles = item.name.endsWith('.PDF');
      return item.isDirectory() || isPDFFile || isPDFFiles;
    });
    setFiles(filesArray);
    return;
};

const selectedPathsSet = new Set(selectedPDFs.map((selectedFile) => selectedFile.path));

const handlePress = async (file) => {
  const isSelected = selectedPathsSet.has(file.path);

  if (isSelected) {
    setSelectedPDFs((prevSelected) => prevSelected.filter((selectedFile) => selectedFile.path !== file.path));
    setProgressed((selectedPDFs.length - 1) / MaxSelection);
    return;
  }

  if (selectedPDFs.length !== MaxSelection) {
    setProgressed((selectedPDFs.length + 1) / MaxSelection);
    setSelectedPDFs((prevSelected) => [
      ...prevSelected,
      { path: file.path, name: file.name },
    ]);
    return;
  }  console.log("i am here2");
};


const handleBack = () => {
  if (currentDirectory !== RNFS.ExternalStorageDirectoryPath) {
    const parentDirectory = currentDirectory.substring(0, currentDirectory.lastIndexOf('/'));
    fetchFiles(parentDirectory);
    setCurrentDirectory(parentDirectory);
  }
};


  const handleDone = () => {
   if(Mode == 2){
       SetRecentDoc();
       handleCancle();
       return;
    }
    handleCancle();
    return;
  };
  function handleCancle () {
     setProgressed(0);
     setOpenFileManager(false);
     return;
  };

  const renderIcon = (file) => {
    if (file.isDirectory()) {
      return <Ionicons name="folder-open-outline" size={24} color={Colors.primaryAlpha} />;
    } else if (file.name.endsWith('.pdf') || file.name.endsWith('.PDF')) {
      return <FontAwesome name="file-pdf-o" size={24} color={Colors.redAlpha} />;
    } else {
      return <AntDesign name="file1" size={24} color="black" />;
    }
  };

  return (
    <ReactModal visible={OpenFileManager}
        onRequestClose={() => {
           handleCancle ();
           setSelectedPDFs([]);
        }}
>
      <BlurView intensity={10} tint="dark" style={{flex:1}}>
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <List.Item
              title={currentDirectory}
              left={() => <List.Icon icon="arrow-left" color={Colors.pink} />}
              theme={{ colors: { primary: Colors.pink }}}
              onPress={() => handleBack()}
            />
          <ProgressBar progress={Progressed} />
          <List.Section title="Files and Folders" />
          <Divider />

      <ScrollView style={{ flex: 1 }}>
            {files.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => {
  if (item.isDirectory()) {
    setCurrentDirectory(item.path);
    fetchFiles(item.path);
    return;
  }
handlePress(item);
}}>
<View>
               <View style={{flexDirection:'row'}}>
      <View style={styles.leftContent}>{renderIcon(item)}
                </View>
<View style={styles.itemContainer}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{item.isDirectory() ? 'Directory' : 'File'}</Text>
    </View>
 {item.isDirectory() ? null :
      <View style={styles.rightContent}>
    <View style={styles.radioContainer}>
  <TouchableOpacity onPress={() => {
  if (item.isDirectory()) {
    setCurrentDirectory(file.path);
    fetchFiles(file.path);
    return;
  }
handlePress(item);
}} disabled={selectedPDFs.length === 0}>
    <View style={styles.radioButton}>
      {selectedPDFs.some(selectedFile => selectedFile.path === item.path) ? (
        <View style={styles.checkedCircle} />
      ) : (
        <View style={styles.uncheckedCircle}/>
      )}
    </View>
  </TouchableOpacity>
</View>
      </View>
  }
         </View>
<Divider style={{ marginLeft: 10, marginRight: 10 }} />
		</View>
              </TouchableOpacity>
            ))}
        </ScrollView>
        </View>
      </BlurView>
    </ReactModal>
  );
};

export default FileManagerModal;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'white',
  },
  description: {
    fontSize: 14,
    color: 'grey',
  },
  leftContent: {
    margin: 10,
    alignSelf:'center',
  },
  rightContent: {
    marginLeft: 'auto',
    alignSelf:'center',
  },
  divider: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'grey',
  },
radioContainer: {
    marginRight: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.greenAlpha, // Change this to your desired color
  },
  uncheckedCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderColor:Colors.redAlpha, // Change this to your desired color
    borderWidth: 2,
  },
});
