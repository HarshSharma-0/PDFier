import React, { useState, useEffect , useRef} from 'react';
import {ScrollView, StyleSheet, View, SafeAreaView, FlatList } from 'react-native';
import {TouchableRipple,Banner,ProgressBar,ActivityIndicator,IconButton,Text,Avatar,Divider,Appbar, FAB, Card,useTheme, Title, Paragraph, TextInput, Modal, Portal, Button } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BlurView } from 'expo-blur';
import Colors from '../constants/colours';
import ImagePicker from 'react-native-image-crop-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import { usePDFier } from '../PdfierProvider/DataProvider';
import Pdf from 'react-native-pdf';
import * as Sharing from 'expo-sharing';

const LeftContent = props => <Avatar.Icon {...props} icon="image" />

export default function CreatePDF() {

  const {colors} = useTheme();
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [bookName, setBookName] = useState('');
  const [loading,setLoading] = useState(-1);
  const {removeCreatedPdfList,setCreatedPdfList,OpenCreated,CreatedPdfList,InvokeCreationSession,imagePaths,setImagePaths,LogsCreation,setLogsCreation,taskerBusy} = usePDFier();


const showFilePicker = async () => {
  ImagePicker.openPicker({
    multiple: true,
  }).then(images => {
    if (imagePaths !== null) {
      setImagePaths(prevValue => [...images, ...prevValue]);
       return;
    } else {
      setImagePaths(images);
    }
   return;
  });
};

function RemoveImage(Index) {
  setImagePaths((prevValue) => prevValue.filter((item, i) => i !== Index));
};



  const createNewPDF = () => {
    const TmpName = bookName;
    if (TmpName.trim().length > 0){
    InvokeCreationSession(TmpName);
    setBookName('');
    setDialogVisible(false);
    }
  };
  const Exit = () => {
    setImagePaths(null);
    setBookName('');
    setDialogVisible(false);
  };

  return (
     <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill}>
      <Appbar.Header style={{backgroundColor:'transparent',elevation:0}}>
        <Appbar.Content
          title="CreatePDF"
          titleStyle={{
    fontSize: RFPercentage(6), // Set your desired font size disabled={taskerBusy}
    fontWeight: 'bold',
    alignSelf:'center',
    color:Colors.redAlpha,
  }}
        />
      </Appbar.Header>
<Divider />
    <SafeAreaView style={styles.root}>
      {taskerBusy ? (
      <View style={{margin:RFPercentage(1),backgroundColor:colors.background,height:RFPercentage(10),borderRadius:5,padding:RFPercentage(1),justifyContent:'center'}}>
            <Text>{LogsCreation.text}</Text>
            <ProgressBar progress={LogsCreation.Progress} />
      </View>

         )
       : (
       <View style={styles.buttonContainer}>
        <Button style={[styles.button,{backgroundColor:taskerBusy ? 'grey' : Colors.redAlpha}]} onPress={() => setDialogVisible(true)}  mode="contained">
              Create PDF
        </Button>
      </View>
      )}
   <Title>Your Created PDFs</Title>
<Divider />

       <Card style={styles.cardContainer}>
        <FlatList
  data={CreatedPdfList}
  renderItem={({ item: pdf, index }) => (
    <View style={{ margin: RFPercentage(1)}} key={index}>
      <TouchableRipple
          onPress={() => OpenCreated(index)}
          onPressIn={() => setLoading(index)}
          onPressOut={() => setLoading(-1)}
          onLongPress={() => {removeCreatedPdfList(index,pdf.Paths.toString()); setLoading(-1); }}
          rippleColor="rgba(0, 0, 0, .32)"
      >
     <View>
      <Divider key={`divider-${index}`} style={{ backgroundColor: Colors.redAlpha ,marginRight:"5%",marginLeft:"5%" }} />
      <View key={`content-${index}`} style={{ flexDirection: 'row', padding: RFPercentage(1), gap: RFPercentage(1) }}>
        <View style={{ flex: 0.5 }}>
          <Pdf
            singlePage={true}
            trustAllCerts={false}
            source={{ uri: pdf.Paths.toString(), cache: false }}
            style={styles.thumbnail}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text>
            Doc Name :-{' '}
            <Text style={{ color: 'grey', fontSize: RFPercentage(2) }}>{pdf.DocName}</Text>
          </Text>
          <Text>
            Doc Paths :- <Text style={{ color: 'grey' }}>{pdf.Paths}</Text>
          </Text>
        </View>
        <View style={{justifyContent:'center'}}>
     <IconButton
      icon="share-circle"
      onPress={async() => {
      const isAvailable = await Sharing.isAvailableAsync();

  if (isAvailable) {
    const SharePath = "file://"+pdf.Paths[index];
    await Sharing.shareAsync(SharePath);
  } else {
    return;
  }
       }}
      animated={true}
      loading={loading === index ? true : false}
      size={RFPercentage(3)}
    />
          </View>
      </View>
      <Divider key={`divider2-${index}`} style={{ backgroundColor:Colors.redAlpha ,marginRight:"5%",marginLeft:"5%" }} />
      </View>
      </TouchableRipple>
    </View>
  )}
  keyExtractor={(pdf, index) => index.toString()}
/>
        </Card>
<Divider style={{backgroundColor:Colors.redAlpha}}/>

      <Portal>
        <Modal visible={isDialogVisible} onDismiss={() => {setDialogVisible(false); setImagePaths(null);}} contentContainerStyle={styles.modalContainer}>
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
            {imagePaths && imagePaths.map((data,index) => (
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

  setImagePaths((prevValue) =>
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
    backgroundColor: Colors.redAlpha,
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
    backgroundColor:'transparent',
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

     < Banner
  visible={Disconnect}
  style={{
    backgroundColor: 'transparent',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  {TriggerServer ? (
    <>
      {renderConnectingAnimation({colors})}
      <Text style={{ color: colors.accent, marginLeft: 8 }}>Connecting...</Text>
    </>
  ) : (
  <>
  <MaterialCommunityIcons name="server" size={24} color={colors.error} style={{ }} />
    <Text style={{ color: colors.error , fontSize: 16 }}>
      Waiting to connect to the server
    </Text>
    </>
  )}
</Banner>

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

