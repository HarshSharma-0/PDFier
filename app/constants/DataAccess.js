import * as DocumentPicker from 'expo-document-picker';
import {PixelRatio} from 'react-native';
import { router } from 'expo-router';
import {ToastAndroid} from 'react-native';
import {RunTimeLoad } from '../RuntimeDataManager';
import * as FileSystem from 'expo-file-system';
import { useState } from "react";

const FileName =   FileSystem.documentDirectory + "PDFbookdata" + "/PDFierBook";
const SETTINGS = FileSystem.documentDirectory + "PDFbookdata" + "/Settings";

const DataPdfTemplate = {

    Id: 1,
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
    copyToCache:false,
    DocName:[],
    Paths:[],

};

let Final_Data = [];


let shareIntent_Data = [];

let selectedDocPaths = [];
let selectedDocName = [];

let QueryIndex = 0;
let OpenBookIndex = 0;
let book_Transfer = false;
let recent_Transfer = false;

const showToastWithGravity = () => {
    ToastAndroid.showWithGravity(
     'Max 6 PDFs Supported in Book view',
      ToastAndroid.LONG,
      ToastAndroid.TOP,
    );
  };

export const pickDocument = async () => {

  let resultdoc = await DocumentPicker.getDocumentAsync({
    multiple: true,
    base64: true,
    type: "application/pdf",
    copyToCacheDirectory: Settings.copyToCache ? true : false ,
  });
if (!resultdoc.canceled) {

if(resultdoc.assets.length > Settings.MaxPdfView){
    showToastWithGravity();
   return false;
}

   selectedDocPaths = []
   selectedDocName = [];
   selectedDocPaths.push(...resultdoc.assets.map((asset) => asset.uri));
   selectedDocName.push(...resultdoc.assets.map((asset) =>  asset.name));
   Settings.DocName.push(selectedDocName);
   Settings.Paths.push(selectedDocPaths);
   book_Transfer = false;
   recent_Transfer = false;
   Setting_Configration();
 return true;
}else{ return false; }

};

export const getQueryFile = () => {

QueryIndex = QueryIndex + 1;
if(QueryIndex === 3 ) {QueryIndex = 0;}
if (book_Transfer === true){
 selectedDocPaths = Final_Data[OpenBookIndex].Paths[QueryIndex];
 return  selectedDocPaths;
}else if (recent_Transfer === true){
   const ret_val = Settings.Paths[OpenBookIndex];
   return ret_val[QueryIndex]
} else {  return  selectedDocPaths[QueryIndex];}


};

export const getDocument = () => {
if (book_Transfer === true){
 selectedDocPaths = Final_Data[OpenBookIndex].Paths;
 return  selectedDocPaths;
}else if (recent_Transfer === true){
   return Settings.Paths[OpenBookIndex];
} else {  return  selectedDocPaths;}

};

export const getDocumentName = () => {
if(book_Transfer === true){
  selectedDocName = Final_Data[OpenBookIndex].DocName;

   return selectedDocName;
}else if (recent_Transfer === true){
   return Settings.DocName[OpenBookIndex];
}
else{  return selectedDocName }
};



export const Add_Book = async () => {
   const RetVal = await DocumentPicker.getDocumentAsync({
    multiple: true,
    base64: true,
    type: "application/pdf",
    copyToCacheDirectory: Settings.copyToCache ? true : false ,
  });
if (!RetVal.canceled) {

if(RetVal.assets.length > Settings.MaxPdfView){
    showToastWithGravity();
   return false;
    }
    DataPdfTemplate.Paths = [];
    DataPdfTemplate.DocName = [];
    DataPdfTemplate.Paths.push(...RetVal.assets.map((asset) => asset.uri));
    DataPdfTemplate.DocName.push(...RetVal.assets.map((asset) =>  asset.name));
    DataPdfTemplate.Id = Final_Data.length + 1;
    DataPdfTemplate.current = DataPdfTemplate.Paths.length;

  return DataPdfTemplate.Paths;
}else{return false;}
};
export function name_list(){
return DataPdfTemplate.DocName;

};

export function setBookName(value){
   DataPdfTemplate.BookName = value;
   Final_Data.push({...DataPdfTemplate});
   DataPdfTemplate.Id = 0;
   DataPdfTemplate.current = 0;
   SaveBook();
}


export function remove_Book(index){

if(index === 0 && Final_Data.length === 1) { Final_Data = [];

  }else{
Final_Data.splice(index, index);
}

SaveBook();
};


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
    console.log("called load settings");

    try {
        const set_data = await FileSystem.readAsStringAsync(SETTINGS);
        console.log(set_data);
        const Settings_Data = JSON.parse(set_data);
        Settings.SwipeEnabled = Settings_Data.SwipeEnabled;
        Settings.DefaultView = Settings_Data.DefaultView;
        Settings.MaxPdfView = Settings_Data.MaxPdfView;
        Settings.DocSavePath = Settings_Data.DocSavePath;
        Settings.copyToCache = Settings_Data.copyToCache;
        Settings.DocName = Settings_Data.DocName;
        Settings.Paths = Settings_Data.Paths;
    } catch (error) {
        console.error("Error loading settings:", error);
    }
}

function SaveBook (){

 const dataToWrite = JSON.stringify(Final_Data);
 FileSystem.writeAsStringAsync(FileName, dataToWrite);



}


export function displayData(){
return shareIntent_Data;

};
export function get_BookData(){
return Final_Data;
};

export function open_book(bookId){
OpenBookIndex = bookId ;
book_Transfer = true;
recent_Transfer = false;
};

export function open_recent(bookId){
OpenBookIndex = bookId ;
book_Transfer = false;
recent_Transfer = true;
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

}
export function SetMaxView( state ) {

if(state === 1) {
return Settings.MaxPdfView
};
Settings.MaxPdfView = state;

}

export function SetStorage(state){

if(state === 2) {
return Settings.DocSavePath
};
Settings.DocSavePath = state;

}

export function SetCache( state ){
if(state === 2) { return Settings.copyToCache};
Settings.copyToCache =  state;
};

export function getRecentDoc(){
return Settings.DocName ;
}
