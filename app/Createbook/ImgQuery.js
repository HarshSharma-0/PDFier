import * as FileSystem from 'expo-file-system';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import { SaveRecentPdf } from '../constants/DataAccess';

export function get_PdfGenerated(base64Image, NameOfFile) {
  return new Promise(async (resolve, reject) => {
    try {

const name = NameOfFile;

for (let i = 0; i < base64Image.length; i++) {
   const ret = await FileSystem.getInfoAsync(base64Image[i].uri.toString(),{
       size:true,
      });

const size = ret.size /(1024*1000);
console.log(size);
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

const CreatePdf = await RNHTMLtoPDF.convert({
      html: htmlContent ,
      fileName: NameOfFile,
      directory: 'documents',
});
   await RNFS.moveFile(CreatePdf.filePath,RNFS.ExternalStorageDirectoryPath +"/Alarms/test.pdf");
   SaveRecentPdf(CreatePdf.filePath , NameOfFile);

   resolve(true);

    } catch (error) {

      reject(error);
    }
  });
}
