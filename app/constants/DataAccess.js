import * as DocumentPicker from 'expo-document-picker';
import {PixelRatio} from 'react-native';
import { router } from 'expo-router';
import {ToastAndroid} from 'react-native';
import {RunTimeLoad } from '../RuntimeDataManager';
import * as FileSystem from 'expo-file-system';
import RNFS from 'react-native-fs';

const FileName =   FileSystem.documentDirectory + "PDFbookdata" + "/PDFierBook";
const SETTINGS = FileSystem.documentDirectory + "PDFbookdata" + "/Settings";

const DataPdfTemplate = {

    Max: 6,
    current: 0,
    BookName:" ",
    Paths: [],
    DocName: [],


};

let Settings = {

    SwipeEnabled: false,
    DefaultView: 0 ,
    DocSavePath: false,
    MaxPdfView: 5,
    DefaultTheme: false,
    copyToCache:true,
    DocName:[],
    Paths:[],
    CreatedPdfs : [],

};

let Final_Data = [];


let shareIntent_Data = [];

let selectedDocPaths = [];
let selectedDocName = [];

let QueryIndex = 0;
let OpenBookIndex = 0;
let book_Transfer = false;
let recent_Transfer = false;
let recentCreated_Transfer = false;
let CanUpdateHome = false;
let CanUpdateView = false;


export const showToastWithGravity = (text) => {
    ToastAndroid.showWithGravity(
     text,
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  };

export const pickDocument = async () => {

  let resultdoc = await DocumentPicker.getDocumentAsync({
    multiple: true,
    type: "application/pdf",
  });
if (!resultdoc.canceled) {

if(resultdoc.assets.length > Settings.MaxPdfView){
   showToastWithGravity("Selection Out of MaxView doing cleanUp");
for (let i = 0; i < resultdoc.assets.length; i++) {
  await FileSystem.deleteAsync(resultdoc.assets[i].uri, { idempotent: true });
}
   return false;
}

   selectedDocPaths = []
   selectedDocName = [];
   selectedDocPaths.push(...resultdoc.assets.map((asset) => asset.uri));
   selectedDocName.push(...resultdoc.assets.map((asset) =>  asset.name));
   Settings.DocName.unshift(selectedDocName);
   Settings.Paths.unshift(selectedDocPaths);
   book_Transfer = false;
   recent_Transfer = false;
   recentCreated_Transfer = false;
   Setting_Configration();
 return true;
}else{ return false; }

};

export const getQueryFile = () => {


if(QueryIndex === (Settings.MaxPdfView -1 )) {QueryIndex = 0;}
if (book_Transfer === true){
 selectedDocPaths = Final_Data[OpenBookIndex].Paths[QueryIndex];
 QueryIndex = QueryIndex + 1;
 return  selectedDocPaths;
}else if (recent_Transfer === true){
   const ret_val = Settings.Paths[OpenBookIndex];
   QueryIndex = QueryIndex + 1;
   return ret_val[QueryIndex]
} else {

 QueryIndex = QueryIndex + 1;
 return  selectedDocPaths[QueryIndex];
}


};

export const getDocument = () => {

if (book_Transfer === true){
 selectedDocPaths = Final_Data[OpenBookIndex].Paths;
 return  selectedDocPaths;
}else if (recent_Transfer === true){
   return Settings.Paths[OpenBookIndex];
}else if( recentCreated_Transfer === true ){
  return Settings.CreatedPdfs[OpenBookIndex];
} else {  return  selectedDocPaths;}

};

export const getDocumentName = () => {

if(book_Transfer === true){
  selectedDocName = Final_Data[OpenBookIndex].DocName;

   return selectedDocName;
}else if (recent_Transfer === true){
   return Settings.DocName[OpenBookIndex];
} else if( recentCreated_Transfer === true ){
  return Settings.CreatedName[OpenBookIndex];
} else{  return selectedDocName }
};



export const Add_Book = async () => {
   const RetVal = await DocumentPicker.getDocumentAsync({
    multiple: true,
    base64: true,
    type: "application/pdf",
  });
if (!RetVal.canceled) {

if(RetVal.assets.length > Settings.MaxPdfView){
  showToastWithGravity("Selection Out of MaxView doing cleanUp");
for (let i = 0; i < RetVal.assets.length; i++) {
  await FileSystem.deleteAsync(RetVal.assets[i].uri, { idempotent: true });
}
   return false;
    }
    DataPdfTemplate.Paths = [];
    DataPdfTemplate.DocName = [];
    DataPdfTemplate.Paths.push(...RetVal.assets.map((asset) => asset.uri));
    DataPdfTemplate.DocName.push(...RetVal.assets.map((asset) =>  asset.name));
    DataPdfTemplate.current = DataPdfTemplate.Paths.length;
    DataPdfTemplate.Max = Settings.MaxPdfView;

  return DataPdfTemplate.Paths;
}else{return false;}
};
export function name_list(){
return DataPdfTemplate.DocName;

};

export function setSharedBook(data_shared){
    DataPdfTemplate.Paths = [];
    DataPdfTemplate.DocName = [];
    DataPdfTemplate.Paths.push(...data_shared.map((asset) => "file://"+asset.uri));
    DataPdfTemplate.DocName.push(...data_shared.map((asset) =>  asset.fileName));
    DataPdfTemplate.current = DataPdfTemplate.Paths.length;
    DataPdfTemplate.Max = Settings.MaxPdfView;

}

export async function setBookName(value){
   DataPdfTemplate.BookName = value;
   await  SaveBook();
}


export async function remove_Book(Index){
const CheckPath = FileSystem.documentDirectory + "PDFbookdata/" + Final_Data[Index].BookName ;
await FileSystem.deleteAsync(CheckPath, { idempotent: true });
const test = await FileSystem.getInfoAsync(CheckPath);
const filter_data = Final_Data.filter((item,index) => index !== Index );
Final_Data = filter_data;
const dataToWrite = JSON.stringify(Final_Data);
await FileSystem.writeAsStringAsync(FileName, dataToWrite);
}


export const load_system_book = async () => {


const Init_Data = await RunTimeLoad();

if(Init_Data === false){

  return false;

}else if(Init_Data === " "){

 //  return false;

}else{

   Final_Data = JSON.parse(Init_Data);
//    Final_Data = JSON.parse("twjskwjishd");


}
};
export async function load_Settings() {


    try {
        const set_data = await FileSystem.readAsStringAsync(SETTINGS);
        const Settings_Data = JSON.parse(set_data);
        Settings.SwipeEnabled = Settings_Data.SwipeEnabled;
        Settings.DefaultView = Settings_Data.DefaultView;
        Settings.MaxPdfView = Settings_Data.MaxPdfView;
        Settings.DocSavePath = Settings_Data.DocSavePath;
        Settings.copyToCache = Settings_Data.copyToCache;
        Settings.DocName = Settings_Data.DocName;
        Settings.Paths = Settings_Data.Paths;
        Settings.CreatedPdfs = Settings_Data.CreatedPdfs;
        Settings.CreatedName = Settings_Data.CreatedName;
    } catch (error) {

    }
}

async function SaveBook (){

const CheckPath = FileSystem.documentDirectory + "PDFbookdata/" + DataPdfTemplate.BookName ;
const FolderExist = await FileSystem.getInfoAsync(CheckPath);
let tmp_Path = [];
if(FolderExist.exists === false){

   await FileSystem.makeDirectoryAsync(CheckPath);

for (let i = 0; i < DataPdfTemplate.Paths.length; i++) {
const fileName = DataPdfTemplate.DocName[i].toString();
const Tofile = CheckPath + "/"+ fileName +".pdf";
const From = DataPdfTemplate.Paths[i].toString();
 await FileSystem.moveAsync({
from: From,
to: Tofile

});
tmp_Path.push(Tofile);
}
   DataPdfTemplate.Paths = tmp_Path;
   Final_Data.unshift({...DataPdfTemplate});
   const dataToWrite = JSON.stringify(Final_Data);
   DataPdfTemplate.Id = 0;
   DataPdfTemplate.current = 0;

await FileSystem.writeAsStringAsync(FileName, dataToWrite);
showToastWithGravity("Book Saved");
}else{

}

}


export function displayData(){
return shareIntent_Data;

};
export async function get_BookData(){
return Final_Data;
};

export function open_book(bookId){
OpenBookIndex = bookId ;
book_Transfer = true;
recentCreated_Transfer = false;
recent_Transfer = false;
};

export function open_recent(bookId){
OpenBookIndex = bookId ;
book_Transfer = false;
recentCreated_Transfer = false;
recent_Transfer = true;
};

export function open_RecentCreated(bookId){
OpenBookIndex = bookId ;
book_Transfer = false;
recentCreated_Transfer = true;
recent_Transfer = false;
};


export function Setting_Configration(){


const SettingsWrite = JSON.stringify(Settings);
FileSystem.writeAsStringAsync(SETTINGS, SettingsWrite);

};


export function gestureEnable( state ){
if(state === 2) { return Settings.SwipeEnabled};
Settings.SwipeEnabled =  state;
};

export function ViewDefault( state ) {

if(state === 7) {
return Settings.DefaultView
};
Settings.DefaultView = state;

};
export function SetMaxView( state ) {

if(state === 1) {
return Settings.MaxPdfView
};
Settings.MaxPdfView = state;

};

export function SetStorage(state){

if(state === 2) {
return Settings.DocSavePath
};
Settings.DocSavePath = state;

};

export function SetCache( state ){
if(state === 2) { return Settings.copyToCache};
Settings.copyToCache =  state;
};

export async function getRecentDoc(){
return Settings.DocName ;
}




export async function getRecentCreatedDocPath(){
return Settings.CreatedPdfs ;
};

export function SaveRecentPdf(filePath , NameOfFile , storedState){

Settings.CreatedPdfs.unshift({file:filePath, name:NameOfFile , isCached:Settings.DocSavePath ? true : false });
Setting_Configration();

};

export async function remove_CreatedPdfs(Index){

const filePath = Settings.CreatedPdfs[Index].file.toString();
await RNFS.unlink(filePath);
const filter_data = Settings.CreatedPdfs.filter((item,index) => index !== Index );
Settings.CreatedPdfs = filter_data;
Setting_Configration();
};


export const handleAdd = async (end,data_Locate) => {

let tmp_data = [];
let tmp_Name = [];
  let resultdoc = await DocumentPicker.getDocumentAsync({
    multiple: true,
    base64: true,
    type: "application/pdf",
  });
if (!resultdoc.canceled) {

if(resultdoc.assets.length > end){
   showToastWithGravity("Selection Out of MaxView doing cleanUp");
for (let i = 0; i < resultdoc.assets.length; i++) {
  await FileSystem.deleteAsync(resultdoc.assets[i].uri, { idempotent: true });
}
   return false;
}
tmp_Name.push(...resultdoc.assets.map((asset) =>  asset.name));
const CheckPath = FileSystem.documentDirectory + "PDFbookdata/" + Final_Data[data_Locate].BookName ;

for (let i = 0; i < tmp_Name.length; i++) {
const Tofile = CheckPath + "/"+ resultdoc.assets[i].name +".pdf";
const From = resultdoc.assets[i].uri.toString();
 await FileSystem.moveAsync({
from: From,
to: Tofile
});
tmp_data.push(Tofile);
}

   return {
file:tmp_data,
Name:tmp_Name,
};
}else{ return false; }


};

export async function Save_Edit_Book(){
   const dataToWrite = JSON.stringify(Final_Data);
   DataPdfTemplate.Id = 0;
   DataPdfTemplate.current = 0;

await FileSystem.writeAsStringAsync(FileName, dataToWrite);

return;
}

export function isUpdateHome(ret_int){

if(ret_int === 1){ CanUpdateHome = true;

 }
else if(ret_int === 2){ CanUpdateHome = false;
 }

return CanUpdateHome;


}

export function isUpdateView(ret_int){

if(ret_int === 1){
CanUpdateView = true;

 }
else if(ret_int === 2){
CanUpdateView = false;

 }

return CanUpdateView;


}

export function share_will_proceed(value){
if(value === 1){
shareIntent_Data = [];
}else if(value === 2){
return shareIntent_Data;
}else if(value === 3){
return  shareIntent_Data.length;
}
else{
shareIntent_Data = value;
return;
}

}
