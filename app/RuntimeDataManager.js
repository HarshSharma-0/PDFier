import * as FileSystem from 'expo-file-system';
import React, { useState, useEffect } from 'react';

 let PDFierFileExist = false;
 const FolderName = FileSystem.documentDirectory + "PDFbookdata";
 const FileName =   FolderName + "/PDFierBook";
 const Settings = FolderName + "/Settings";

export const RunTimeLoad = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const FolderExist = await FileSystem.getInfoAsync(FolderName);

      if (FolderExist.exists === false) {
        await FileSystem.makeDirectoryAsync(FolderName);
      }

      const FileExist = await FileSystem.getInfoAsync(FileName);

      if (FileExist.exists === false) {
        await FileSystem.writeAsStringAsync(FileName, ' ');
        await FileSystem.writeAsStringAsync(Settings, ' ');
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



