import * as FileSystem from 'expo-file-system';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import * as Notifications from 'expo-notifications';
import { showToastWithGravity , SaveRecentPdf , SetStorage } from '../constants/DataAccess';
import { useProgress } from './useProgress';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export function get_PdfGenerated(base64Image, NameOfFile , Update ) {


  return new Promise(async (resolve, reject) => {
    try {

Update({text:"Process Invoked" , size:2.5});
showToastWithGravity("Process Invoked");
const name = NameOfFile;
let SizeArray = [];
let totalSize = 0;
let Compress = 0;
const extPath = RNFS.ExternalStorageDirectoryPath +"/PDFier/"+NameOfFile + ".pdf";
 Update({text:"Checking Size For Compression" , size:2.5});
for (let i = 0; i < base64Image.length; i++) {
 Update({text:"Extracting Size of" + base64Image[i].uri.toString(), size:1.2});
   const ret = await FileSystem.getInfoAsync(base64Image[i].uri.toString(),{
       size:true,
      });
const Size = ret.size /(1024*1000);
totalSize = totalSize + Size;
SizeArray.push(Size);

}
console.log(base64Image);
Update({text:"Extracting Completed" , size:2.5});
if(totalSize > 15 ){
  for (let j = 0; j < base64Image.length; j++) {
    Update({text:"Invoked Compression" + base64Image[j].uri.toString(), size:1.5});
    const manipResult = await manipulateAsync(
       base64Image[j].uri.toString(),
       [{
    resize:{
      height:800,
      }
      }],
      { compress: 1 , format: SaveFormat.PNG }
    );
     base64Image[j].uri = manipResult.uri;
     Update({text:"Compressed" + base64Image[j].uri.toString(), size:1.5});
 }
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
 Update({text:"Generating PDF",size:2.5});
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
                     Update({text:"SaveFolder Doesn't exist Creating",size:2.5});
       }

    Update({text:"Saving To Internal Storage",size:2.5});
    await RNFS.moveFile(CreatePdf.filePath, extPath);
    Update({text:"Upadting refs",size:2.5});
    await SaveRecentPdf(extPath , NameOfFile );
    Update({text:"Saved",size:2.5});
    Notifications.scheduleNotificationAsync({
       content: {
         title: 'Creation Success',
         body: "Creation for your PDF completed \n Name:-" + NameOfFile + "\n Path :-" + extPath ,
       },
       trigger:null,
});

}else{
  Update({text:"Saving To Cache Storage",size:2.5});
  await SaveRecentPdf(CreatePdf.filePath , NameOfFile);
  Update({text:"SAVED",size:2.5});
  Notifications.scheduleNotificationAsync({
  content: {
    title: 'Creation Success',
    body: "Creation for your PDF completed \n Name:-" + NameOfFile + "\n Path :-" + CreatePdf.filePath ,
  },

  trigger:null,
});

}


   resolve(true);

    } catch (error) {

      reject(error);
    }
  });
}
