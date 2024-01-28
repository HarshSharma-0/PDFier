import React, {useEffect, createContext, useState, useContext } from 'react';
import RNFS from 'react-native-fs';
import {PDFCreator} from './PDFCreator';

const MyContext = createContext();

const PDFierProvider = ({ children }) => {

const BookDir = RNFS.ExternalDirectoryPath +'/PDFier';
const SettingsPath = BookDir +'/Settings.json';
const BookPath = BookDir + '/BookData.json';
const RecentPath = BookDir + '/RecentData.json';
const CreatedPdfPath = BookDir +'/CreatedPdfs.json';


const pageSizes = [
  { label: 'A4', width: 2480, height: 3508, dimensions: '210mm x 297mm', ptWidth: 595.28, ptHeight: 841.89 },
  { label: 'Letter', width: 2550, height: 3300, dimensions: '215.9mm x 279.4mm', ptWidth: 612, ptHeight: 792 },
  { label: 'Legal', width: 2550, height: 4200, dimensions: '215.9mm x 355.6mm', ptWidth: 612, ptHeight: 1008 },
  { label: 'A3', width: 3508, height: 4961, dimensions: '297mm x 420mm', ptWidth: 841.89, ptHeight: 1190.55 },
  { label: 'A5', width: 1748, height: 2480, dimensions: '148mm x 210mm', ptWidth: 419.53, ptHeight: 595.28 },
  { label: 'Tabloid', width: 3300, height: 2550, dimensions: '279.4mm x 215.9mm', ptWidth: 792, ptHeight: 612 },
  { label: 'B5', width: 2050, height: 2886, dimensions: '176mm x 250mm', ptWidth: 499.87, ptHeight: 708.66 },
  { label: 'Executive', width: 2175, height: 3300, dimensions: '184.15mm x 279.4mm', ptWidth: 521.85, ptHeight: 792 },
  { label: 'A6', width: 1240, height: 1748, dimensions: '105mm x 148mm', ptWidth: 298.58, ptHeight: 419.53 },
  { label: 'Folio', width: 2100, height: 3300, dimensions: '210mm x 330mm', ptWidth: 612, ptHeight: 792 },
  { label: 'Quarto', width: 2440, height: 3300, dimensions: '210mm x 297mm', ptWidth: 612, ptHeight: 792 },
  { label: 'Postcard', width: 1536, height: 1024, dimensions: '105mm x 148mm', ptWidth: 298.58, ptHeight: 419.53 },
  { label: 'DL Envelope', width: 2200, height: 1100, dimensions: '110mm x 220mm', ptWidth: 330.71, ptHeight: 612 },
  { label: 'C5 Envelope', width: 2480, height: 1748, dimensions: '162mm x 229mm', ptWidth: 612, ptHeight: 792 },
  { label: 'Monarch Envelope', width: 1900, height: 900, dimensions: '98mm x 190.5mm', ptWidth: 229, ptHeight: 396.85 },
  { label: 'B4', width: 2507, height: 3543, dimensions: '250mm x 353mm', ptWidth: 708.66, ptHeight: 1000 },
  { label: 'C4 Envelope', width: 2550, height: 3600, dimensions: '229mm x 324mm', ptWidth: 612, ptHeight: 792 },
  { label: 'A2', width: 4961, height: 7016, dimensions: '420mm x 594mm', ptWidth: 1190.55, ptHeight: 1683.78 },
  // Add more page sizes with width, height, dimensions, ptWidth, and ptHeight
0];

/**************** BothTabHook *************************/
const [CreatedPdfBook,setCreatedPdfBook] = useState([]);
const [RecentViewed,setRecentViewed] = useState([]);
const [CreatedPdfList,setCreatedPdfList] = useState([]);
/******************************************************/

/**************** FileManager *************************/
const [Mode,setMode] = useState(0);
const [selectedPDFs,setSelectedPDFs] = useState([]);
const [selectedImage,setSelectedImage] = useState([]);
const [OpenFileManager,setOpenFileManager] = useState(false);
/******************************************************/


/**************** ViewPdfManager **********************/
const [ViewData,setViewData] = useState({});
const [OpenViewer,SetOpenViewer] = useState(false);
/******************************************************/

/**************** CreatePdf Hook **********************/
const [imagePaths,setImagePaths] = useState(null);
const [LogsCreation,setLogsCreation] = useState(null);
const [taskerBusy,setTaskerBusy] = useState(false);
/******************************************************/

/**************** Settings Hook ***********************/
const [dark,isDark] = useState(true);
const [Notification,setNotification] = useState(true);
const [Orientaion,setOrientation] = useState(true);
const [PageSize,setPageSize] = useState(0);
const [MaxPdfView,setMaxView] = useState(5);
const [ViewType,setViewType] = useState(false);
const [Save,setSave] = useState(false);
const [CopyPdf,setCopyPdf] = useState(false);
const [isInit,setInit] = useState(false);
/******************************************************/

/**************** Tmp Hook ***********************/
const [MaxSelection , setMaxSelection] = useState(0);
/******************************************************/



const SaveSettings = async () => {
const settings = {
  dark,
  Notification,
  Orientaion,
  PageSize,
  MaxPdfView,
  ViewType,
  Save,
  CopyPdf,
};
const jsonString = JSON.stringify({ settings });
await RNFS.writeFile(SettingsPath, jsonString);
return;
}

const InitSystem = async () => {
const avail = await RNFS.exists(BookDir);
if(!avail){
await RNFS.mkdir(BookDir);
await RNFS.writeFile(SettingsPath, '');
await RNFS.writeFile(BookPath, '');
await RNFS.writeFile(RecentPath, '');
await RNFS.writeFile(CreatedPdfPath, '');
return;
};
const parser = await RNFS.readFile(SettingsPath);
const BookParser =  await RNFS.readFile(BookPath);
const RecentParser = await RNFS.readFile(RecentPath);
const CreatedParser = await RNFS.readFile(CreatedPdfPath);
if(BookParser !== ''){
    const parsedData = JSON.parse(BookParser);
    setCreatedPdfBook(parsedData);
}
if(RecentParser !== ''){
const ParsedRecent = JSON.parse(RecentParser);
setRecentViewed(ParsedRecent);
}
if(parser !== ''){
const parsedSettings = JSON.parse(parser);
isDark(parsedSettings.settings.dark);
setNotification(parsedSettings.settings.Notification);
setOrientation(parsedSettings.settings.Orientaion);
setPageSize(parsedSettings.settings.PageSize);
setMaxView(parsedSettings.settings.MaxPdfView);
setViewType(parsedSettings.settings.ViewType);
setSave(parsedSettings.settings.Save);
setCopyPdf(parsedSettings.settings.CopyPdf);
setMaxSelection(parsedSettings.settings.MaxPdfView);
}
if(CreatedParser !== ''){
const ParsedCreated = JSON.parse(CreatedParser);
setCreatedPdfList(ParsedCreated);
}
return;
}

useEffect(() => {
InitSystem();
},[]);


const copyFiles = async (paths, destinationFolder) => {
  try {
    const promises = paths.map(async (path) => {
      const fileName = path.split('/').pop();
      const destinationPath = `${destinationFolder}/${fileName}`;
      const exists = await RNFS.exists(destinationPath);

      if (!exists) {
        await RNFS.copyFile(path, destinationPath);
        return destinationPath;
      } else {
        return null;
      }
    });

    const copiedFiles = await Promise.all(promises);
    const validCopiedFiles = copiedFiles.filter((file) => file !== null);
    return validCopiedFiles;

  } catch (error) {
  }
};

const AddPdfBook = async (name) => {
const CheckPath = BookDir +"/"+name;
let DataPdfTemplate = {
  MaxPdfView,
  current: selectedPDFs.length,
  BookName: name,
  Paths: selectedPDFs.map(pdf => pdf.path),
  DocName: selectedPDFs.map(pdf => pdf.name),
  Cached: CopyPdf,
};

const avail = await RNFS.exists(CheckPath);
if(!avail && !CopyPdf){
await RNFS.mkdir(CheckPath);
DataPdfTemplate.Paths = await copyFiles(DataPdfTemplate.Paths,CheckPath);
}

const NewArray = [DataPdfTemplate, ...CreatedPdfBook];
setCreatedPdfBook(NewArray);
setSelectedPDFs([]);
await RNFS.writeFile(BookPath,JSON.stringify(NewArray));
return;
}

const RemovePdfBook = async (Index) => {
  try {
    const UnlinkPath = BookDir + "/" + CreatedPdfBook[Index].BookName;
    const avail = await RNFS.exists(UnlinkPath);
    if(avail){
    await RNFS.unlink(UnlinkPath);
     }
    // Remove item from the array
    const NewArray = CreatedPdfBook.filter((item, index) => index !== Index);
    setCreatedPdfBook(NewArray);

    // Write the updated array to the file
    await RNFS.writeFile(BookPath, JSON.stringify(NewArray));
    return;
  } catch (error) {
    // Handle the error (log, show a message, etc.)
  }
};

const SetRecentDoc = async () => {
const tempelate = [{
  Paths: selectedPDFs.map(pdf => pdf.path),
  DocName: selectedPDFs.map(pdf => pdf.name)
},...RecentViewed];
setViewData(tempelate[0]);
const NewArray = tempelate.slice(0,10);
setRecentViewed(NewArray);
setSelectedPDFs([]);
await RNFS.writeFile(RecentPath,JSON.stringify(NewArray));
setMode(0);
SetOpenViewer(true);
return;
};

const OpenBook = async (index) => {
setViewData(CreatedPdfBook[index]);
SetOpenViewer(true);
return;
};

const OpenRecent = async (index) => {
setViewData(RecentViewed[index]);
SetOpenViewer(true);
return;
};

const AddCreatedPdfList = async (Data) => {
const NewArray = [Data,...CreatedPdfList];
setCreatedPdfList(NewArray);
await RNFS.writeFile(CreatedPdfPath,JSON.stringify(NewArray));
return;
};


const removeCreatedPdfList = async (Index, path) => {
  const NewArray = CreatedPdfList.filter((item, index) => index !== Index);
  setCreatedPdfList(NewArray);
  await RNFS.writeFile(CreatedPdfPath, JSON.stringify(NewArray));
  await RNFS.unlink(path);
  return;
};

const deleteDirectoryContents = async (directoryPath) => {
  try {
    const items = await RNFS.readDir(directoryPath);

    // Calculate the total number of items for progress tracking
    const totalItems = items.length;
    let processedItems = 0;

    const deletePromises = items.map(async (item) => {
      if (item.isDirectory()) {
        await RNFS.unlink(item.path);
      } else {
        await RNFS.unlink(item.path);
      }

      // Update progress for each processed item
      processedItems += 1;
      const Progressed = processedItems / totalItems;
      setLogsCreation({ text: `removing ${item.path}`, Progress:Progressed });
      console.log(progress);
    });

    await Promise.all(deletePromises);
    return;
  } catch (error) {
  }
};
const InvokeCreationSession = async (name) => {
  setLogsCreation({text:"Starting System",Progress:0});
  const CachedDir = RNFS.CachesDirectoryPath;
  const ExtCacheDir = RNFS.ExternalCachesDirectoryPath;
  const Dir = Save ? BookDir : RNFS.DownloadDirectoryPath;
  const extPath = Dir + "/" + name + ".pdf";

  let tmp = {
    DocName: name,
    Cached: Save,
    Paths:[extPath],
  };
  setTaskerBusy(true);
  console.log(CachedDir,ExtCacheDir);
  await PDFCreator(
    Notification,
    Orientaion,
    pageSizes[PageSize],
    Save,
    setLogsCreation,
    setTaskerBusy,
    imagePaths,
    name,
    extPath
  );

  AddCreatedPdfList(tmp);
  setImagePaths(null);
  setLogsCreation({text:"Cleaning Resources",Progress:0});
  await deleteDirectoryContents(CachedDir);
  setLogsCreation({text:"Cleaning Resources",Progress:0});
  await deleteDirectoryContents(ExtCacheDir);
  setTaskerBusy(false);
  return;
};


const OpenCreated = async (index) => {setViewData(CreatedPdfList[index]); SetOpenViewer(true);}

  return (
    <MyContext.Provider
   value={{
       pageSizes,
       dark,
       isDark,
       Notification,
       setNotification,
       Orientaion,
       setOrientation,
       PageSize,
       setPageSize,
       MaxPdfView,
       setMaxView,
       ViewType,
       setViewType,
       Save,
       setSave,
       CopyPdf,
       setCopyPdf,
       OpenFileManager,
       setOpenFileManager,
       CreatedPdfBook,
       setCreatedPdfBook,
       RecentViewed,
       setRecentViewed,
       selectedPDFs,
       setSelectedPDFs,
       AddPdfBook,
       SaveSettings,
       RemovePdfBook,
       SetRecentDoc,
       ViewData,
       OpenViewer,
       SetOpenViewer,
       OpenBook,
       OpenRecent,
       copyFiles,
       BookDir,
       MaxSelection,
       setMaxSelection,
       imagePaths,
       setImagePaths,
       LogsCreation,
       setLogsCreation,
       taskerBusy,
       imagePaths,
       setImagePaths,
       InvokeCreationSession,
       CreatedPdfList,
       setCreatedPdfList,
       AddCreatedPdfList,
       removeCreatedPdfList,
       Mode,
       setMode,
       OpenCreated,
    }}>
      {children}
    </MyContext.Provider>
  );
};

const usePDFier = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};

// Example usage in a component:
// const { state, updateState } = useMyContext();

export { PDFierProvider, usePDFier };
