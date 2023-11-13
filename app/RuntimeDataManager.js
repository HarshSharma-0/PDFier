import * as FileSystem from 'expo-file-system';
import RNFS from 'react-native-fs';
import React, { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

 let PDFierFileExist = false;
 const FolderName = FileSystem.documentDirectory + "PDFbookdata";
 const FileName =   FolderName + "/PDFierBook";
 const Settings = FolderName + "/Settings";
 const extPath = RNFS.ExternalStorageDirectoryPath +"/PDFier";

export const RunTimeLoad = () => {
  return new Promise(async (resolve, reject) => {
    try {
   Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
      const FolderExist = await FileSystem.getInfoAsync(FolderName);

      if (FolderExist.exists === false) {
        await FileSystem.makeDirectoryAsync(FolderName);
      }

      const FileExist = await FileSystem.getInfoAsync(FileName);

      if (FileExist.exists === false) {
        await FileSystem.writeAsStringAsync(FileName, ' ');
        await FileSystem.writeAsStringAsync(Settings, ' ');
        await RNFS.mkdir(extPath);
        resolve(FileExist.exists);
      } else {
        const ReadDataFromFile = await FileSystem.readAsStringAsync(FileName);
        resolve(ReadDataFromFile);
      }
    } catch (error) {
      reject(error);
    }
  });
};



