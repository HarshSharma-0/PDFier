import React, { useState, useEffect , useRef} from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import {ActivityIndicator,IconButton,Text,Avatar,Divider,Appbar, FAB, Card,useTheme, Title, Paragraph, TextInput, Modal, Portal, Button } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BlurView } from 'expo-blur';
import Colors from '../constants/colours';
import ImagePicker from 'react-native-image-crop-picker';
import { CropView } from 'react-native-image-crop-tools';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';


const LeftContent = props => <Avatar.Icon {...props} icon="image" />

export default function Home() {

  const {colors} = useTheme();
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [bookName, setBookName] = useState('');
  const [SelectedImages,setSelectedImages] = useState(null);


const showFilePicker = async () => {
  ImagePicker.openPicker({
    multiple: true,
  }).then(images => {
    if (SelectedImages !== null) {
      setSelectedImages(prevValue => [...images, ...prevValue]);
       return;
    } else {
      setSelectedImages(images);
    }
   return;
  });
};

function RemoveImage(Index) {
  setSelectedImages((prevValue) => prevValue.filter((item, i) => i !== Index));
};

  const createNewPDF = () => {
  /*
    setSelectedImages(null);
    setBookName('');
    setDialogVisible(false);
    */
  };
  const Exit = () => {
    setSelectedImages(null);
    setBookName('');
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
            {/* */}
          </ScrollView>
        </Card>
<Divider style={{backgroundColor:Colors.redAlpha}}/>
      <Title>LOG OF PDF CREATION</Title>
<Divider />
        <Card style={[styles.cardContainer,{backgroundColor:'transparent',elevation:0}]}>
          <Card.Content>
          </Card.Content>
          <ScrollView>
            {/*recentPDFs.map((pdf) => (
              <Card.Content key={pdf.id}>
                <Title>{pdf.title}</Title>
                <Paragraph>{pdf.description}</Paragraph>
              </Card.Content>
            ))*/}
          </ScrollView>
        </Card>
<Divider style={{backgroundColor:Colors.redAlpha}}/>

      <Portal>
        <Modal visible={isDialogVisible} onDismiss={() => {setDialogVisible(false); setSelectedImages(null);}} contentContainerStyle={styles.modalContainer}>
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
            {
SelectedImages && SelectedImages.map((data,index) => (
             <Card key={index} style={{margin:16,elevation:0}}>

    <Card.Title title="Dimensions" subtitle={`${data.width} x ${data.height}`} left={LeftContent} />
    <Card.Content>
      <Text variant="titleLarge">{`PAGE :- ${index+1}`}</Text>
      <Text variant="bodyMedium" style={{color:'grey'}}>{data.path}</Text>
    </Card.Content>
<Card.Cover
  source={{ uri: data.path }}
  style={{
    margin: 5,
    backgroundColor: 'transparent',
  }}
  resizeMode="contain"
/>
    <Card.Actions>
<IconButton
  icon="image-remove"
  onPress={()=> RemoveImage(index)}
  style={{
    marginTop: RFPercentage(2),
    marginRight: RFPercentage(1),
}}
    iconColor={Colors.red}
/>
<IconButton
  icon="image-edit-outline"
  onPress={()=> {
  ImagePicker.openCropper({
  path: data.path,
  freeStyleCropEnabled:true,
  cropperToolbarWidgetColor:colors.primary,
  cropperToolbarColor:colors.background,
  cropperStatusBarColor:colors.background,
  cropperActiveWidgetColor:colors.primary,
}).then(image => {

  setSelectedImages((prevValue) =>
    prevValue.map((item, i) => (i === index ? image : item))
  );
  console.log(image);
});
  }}
  style={{
    marginTop: RFPercentage(2),
    marginRight: RFPercentage(1),
}}
  iconColor={colors.accent}
  mode="outlined"
/>
    </Card.Actions>
<Divider style={{backgroundColor:Colors.redAlpha}}/>
  </Card>
            ))}

          </ScrollView>
        </Card>
       <View style={{flexDirection:'row',justifyContent:'space-between'}}>
         <Button onPress={Exit} style={styles.createButton} mode="contained" >
              Cancle
            </Button>
            <Button onPress={createNewPDF} style={styles.createButton} mode="contained" >
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
    backgroundColor:Colors.redAlpha,
    flex:1,
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
fab: {
    position: 'absolute',
    right: 16,
  },
bottom: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },

});


/*

onImageCrop={(res) => {
  console.warn(res);
  const PackedData = {
    width: res.width,
    height: res.height,
    path: res.uri,
  };
  const Copied_Index = CropIndex;
  console.log(PackedData, Copied_Index);
RNFS.exists(res.uri)
  .then((exists) => {
    console.log(`File ${filePath} exists: ${exists}`);
  })
  .catch((error) => {
    console.error(`Error checking file existence: ${error}`);
  });



  setCropIndex(null);
  setCropVisible(false);
  setProcessingImage(false);
}}


       <Portal>
        <Modal visible={CropVisible} onDismiss={() => setCropVisible(false)} contentContainerStyle={styles.modalContainer}>
      <BlurView intensity={50} tint="dark" style={styles.blurView}>
      <Appbar.Header style={{backgroundColor:'transparent',elevation:0}}>
        <Appbar.Content
          title="PDFier Editor"
          titleStyle={{
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf:'center',
    color:Colors.redAlpha,
  }}
        />
      </Appbar.Header>
{tmp && <CropView
          sourceUrl={tmp[0].path}
          style={{flex:1,margin:10}}
          ref={CropperRef}
          onImageCrop={(res) => console.warn(res)}
        />
}
<Appbar
      style={[
        styles.bottom,
        {
          height: BOTTOM_APPBAR_HEIGHT + bottom,
          backgroundColor:'transparent',
          elevation:0,
        },
      ]}
      safeAreaInsets={{ bottom }}
    >
      <Appbar.Action icon="archive" onPress={() => {}} />
      <Appbar.Action icon="email" onPress={() => {}} />
      <Appbar.Action icon="label" onPress={() => {}} />
      <Appbar.Action icon="delete" onPress={() => {}} />
      <FAB
        mode="flat"
        size="medium"
        icon="plus"
        onPress={() => {}}
        style={[
          styles.fab,
          { top: (BOTTOM_APPBAR_HEIGHT - MEDIUM_FAB_HEIGHT) / 2 },
        ]}
      />
    </Appbar>
          </BlurView>
        </Modal>
       </Portal>



*/

