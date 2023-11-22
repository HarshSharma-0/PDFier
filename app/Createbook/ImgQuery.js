import * as FileSystem from 'expo-file-system';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import * as Notifications from 'expo-notifications';
import { showToastWithGravity ,share_will_proceed, SaveRecentPdf , SetStorage } from '../constants/DataAccess';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import ImageResizer from '@bam.tech/react-native-image-resizer';

export function get_PdfGenerated(base64Image, NameOfFile , Update ) {

const extPath = RNFS.ExternalStorageDirectoryPath +'/PDFier/'+NameOfFile+'.pdf';


  return new Promise(async (resolve, reject) => {
    try {

Update({text:"Process Invoked" , size:2.5, textOffed:null});
showToastWithGravity("Process Invoked");
const name = NameOfFile;
let SizeArray = [];
let totalSize = 0;
let Compress = 0;
let offed = 0;

  for (let j = 0; j < base64Image.length; j++) {

   offed  = offed + 1;
   Update({text:"Invoked Compression " + base64Image[j].uri.toString() , textOffed:"(" + offed + " of " + base64Image.length + ")" , size:1.2});
   const manipResult = await ImageResizer.createResizedImage(
      base64Image[j].uri.toString(),
      base64Image[j].width > 1500 ? base64Image[j].width *0.5 : base64Image[j].width,
      base64Image[j].height > 1500 ? base64Image[j].height* 0.5 : base64Image[j].height,
      'JPEG',
       50,
       0,
       null,
       false,
       {
         mode:'cover',
         onlyScaleDown:true,
       }
    );
     await RNFS.unlink(base64Image[j].uri.toString());
     base64Image[j].uri = manipResult.uri;
     Update({text:"Compressed" + base64Image[j].uri.toString(), size:1.2, textOffed:null});
 }


let htmlContent = `<html>
      <body>`;

for (let i = 0; i < base64Image.length; i++) {
htmlContent += `<div style="height: 100% ; width: 100%; overflow: hidden; page-break-before: always; display: flex; justify-content: center; align-items: center ">
  <div style="height: 100% ; width: 100% ; display: flex; justify-content: center; align-items: center;">
    <img src="${base64Image[i].uri.toString()}" style="max-height: 100%; max-width: 100%;">
  </div>
</div>`;
}

htmlContent += ` </body>
    </html>`;
 Update({text:"Generating PDF",size:2.5,textOffed:null});
const CreatePdf = await RNHTMLtoPDF.convert({
      html: htmlContent ,
      fileName: NameOfFile,
      directory: 'documents',
});



const  internal = SetStorage(2);
if(internal === true){
      const FolderExist = await FileSystem.getInfoAsync(RNFS.ExternalStorageDirectoryPath +"/PDFier");

      if (FolderExist.exists === false) {
               await RNFS.mkdir(RNFS.ExternalStorageDirectoryPath +"/PDFier");
                     Update({text:"SaveFolder Doesn't exist Creating",size:2.5,textOffed:null});
       }

    Update({text:"Saving To Internal Storage",size:2.5 , textOffed:null });
    await RNFS.moveFile(CreatePdf.filePath, extPath);
    Update({text:"Upadting refs",size:2.5 , textOffed:null });
    await SaveRecentPdf(extPath , NameOfFile );
    Update({text:"Saved",size:2.5 , textOffed:null});
    Notifications.scheduleNotificationAsync({
       content: {
         title: 'Creation Success',
         body: "Creation for your PDF completed \n Name:-" + NameOfFile + "\n Path :-" + extPath ,
       },
       trigger:null,
});
      share_will_proceed(1);

}else{
  await Update({text:"Saving To Cache Storage",size:2.5 , textOffed:null});
  await SaveRecentPdf(CreatePdf.filePath , NameOfFile);
  Update({text:"SAVED",size:2.5, textOffed:null});
  Notifications.scheduleNotificationAsync({
  content: {
    title: 'Creation Success',
    body: "Creation for your PDF completed \n Name:-" + NameOfFile + "\n Path :-" + CreatePdf.filePath ,
  },

  trigger:null,
});
  share_will_proceed(1);
}

for(let k = 0 ; k < base64Image.length ; k++){
    share_will_proceed(1);
    await RNFS.unlink(base64Image[k].uri.toString());
    Update({text:"Cleaning resources ", size:2.0 , textOffed:"(" + (k+1) + " of " + base64Image.length + ")" });
    }
      Update(null);
      resolve(true);
    } catch (error) {

      Update({text:"Error Occured" , size:2.5, textOffed:null});
      Notifications.scheduleNotificationAsync({
      content: {
         title: 'Creation Failure',
         body: "Creation for your PDF Failed \n Name:-" + NameOfFile + "\n Path :-" + extPath ,
       },
       trigger:null,
    });
      reject(error);
    }
  });
}
