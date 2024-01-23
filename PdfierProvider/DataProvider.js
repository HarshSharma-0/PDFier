import React, {useEffect, createContext, useState, useContext } from 'react';
import RNFS from 'react-native-fs';

const MyContext = createContext();

const PDFierProvider = ({ children }) => {

const BookDir = RNFS.ExternalDirectoryPath +'/PDFier';
const SettingsPath = BookDir +'/Settings.json';
const BookPath = BookDir + '/BookData.json';


const pageSizes = [
  { label: 'A4', width: 2480, height: 3508, dimensions: '210mm x 297mm' },
  { label: 'Letter', width: 2550, height: 3300, dimensions: '215.9mm x 279.4mm' },
  { label: 'Legal', width: 2550, height: 4200, dimensions: '215.9mm x 355.6mm' },
  { label: 'A3', width: 3508, height: 4961, dimensions: '297mm x 420mm' },
  { label: 'A5', width: 1748, height: 2480, dimensions: '148mm x 210mm' },
  { label: 'Tabloid', width: 3300, height: 2550, dimensions: '279.4mm x 215.9mm' },
  { label: 'B5', width: 2050, height: 2886, dimensions: '176mm x 250mm' },
  { label: 'Executive', width: 2175, height: 3300, dimensions: '184.15mm x 279.4mm' },
  { label: 'A6', width: 1240, height: 1748, dimensions: '105mm x 148mm' },
  { label: 'Folio', width: 2100, height: 3300, dimensions: '210mm x 330mm' },
  { label: 'Quarto', width: 2440, height: 3300, dimensions: '210mm x 297mm' }, // Note: Quarto dimensions are the same as A4
  { label: 'Postcard', width: 1536, height: 1024, dimensions: '105mm x 148mm' },
  { label: 'DL Envelope', width: 2200, height: 1100, dimensions: '110mm x 220mm' },
  { label: 'C5 Envelope', width: 2480, height: 1748, dimensions: '162mm x 229mm' },
  { label: 'Monarch Envelope', width: 1900, height: 900, dimensions: '98mm x 190.5mm' },
  { label: 'B4', width: 2507, height: 3543, dimensions: '250mm x 353mm' },
  { label: 'C4 Envelope', width: 2550, height: 3600, dimensions: '229mm x 324mm' },
  { label: 'A2', width: 4961, height: 7016, dimensions: '420mm x 594mm' },
  // Add more page sizes with width, height, and dimensions
];

/**************** BothTabHook *************************/
const [CreatedPdfBook,setCreatedPdfBook] = useState([]);
const [RecentViewed,setRecentViewed] = useState([]);
/******************************************************/

/**************** FileManager *************************/
const [ManagerMode,setManagerMode] = useState(0);
const [selectedPDFs,setSelectedPDFs] = useState([]);
const [selectedImage,setSelectedImage] = useState([]);
const [OpenFileManager,setOpenFileManager] = useState(false);
/******************************************************/


/**************** ViewPdfManager **********************/
const [ViewData,setViewData] = useState({});
const [OpenViewer,SetOpenViewer] = useState(false);
/******************************************************/

/**************** CreatePdf Hook **********************/
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
return;
};
const parser = await RNFS.readFile(SettingsPath);
const BookParser =  await RNFS.readFile(BookPath);
if(BookParser !== ''){
    const parsedData = JSON.parse(BookParser);
    setCreatedPdfBook(parsedData);
}
if(parser != ''){
const parsedSettings = JSON.parse(parser);
isDark(parsedSettings.settings.dark);
setNotification(parsedSettings.settings.Notification);
setOrientation(parsedSettings.settings.Orientaion);
setPageSize(parsedSettings.settings.PageSize);
setMaxView(parsedSettings.settings.MaxPdfView);
setViewType(parsedSettings.settings.ViewType);
setSave(parsedSettings.settings.Save);
setCopyPdf(parsedSettings.settings.CopyPdf);
}
return;
}

useEffect(() => {
InitSystem();
},[]);

const copyFiles = async (paths, destinationFolder) => {
  try {
    const promises = paths.map(async (path) => {
      const fileName = path.split('/').pop(); // Extracting the file name
      const destinationPath = `${destinationFolder}/${fileName}`;

      await RNFS.copyFile(path, destinationPath);
      return destinationPath;
    });

    const copiedFiles = await Promise.all(promises);
    console.log('Files copied:', copiedFiles);
    // Do something with the copied files if needed
  } catch (error) {
    console.error('Error copying files:', error);
  }
};


const AddPdfBook = async (name) => {
const CheckPath = BookDir +"/"+name;
const DataPdfTemplate = {
  MaxPdfView,
  current: selectedPDFs.length,
  BookName: name,
  Paths: selectedPDFs.map(pdf => pdf.path),
  DocName: selectedPDFs.map(pdf => pdf.name),
};

const avail = await RNFS.exists(CheckPath);
if(!avail && CopyPdf == false){
await RNFS.mkdir(CheckPath);
copyFiles(DataPdfTemplate.Paths,CheckPath);
}
const NewArray = [DataPdfTemplate, ...CreatedPdfBook];
setCreatedPdfBook(NewArray);
await RNFS.writeFile(BookPath,JSON.stringify(NewArray));
return;
}

const RemovePdfBook = async (Index) => {
const UnlinkPath = BookDir +"/"+CreatedPdfBook[Index].BookName;
await RNFS.unlink(UnlinkPath);
const NewArray = CreatedPdfBook.filter((item,index) => index !== Index );
setCreatedPdfBook(NewArray);
await RNFS.writeFile(BookPath,JSON.stringify(NewArray));
return;
}

const SetRecentDoc = async () => {
const tempelate = {
  Paths: selectedPDFs.map(pdf => pdf.path),
  DocName: selectedPDFs.map(pdf => pdf.name)
};
setViewData(tempelate);
setRecentViewed([tempelate,...RecentViewed]);
setSelectedPDFs([]);
setManagerMode(0);
SetOpenViewer(true);
return;
};

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
       ManagerMode,
       setManagerMode,
       AddPdfBook,
       SaveSettings,
       RemovePdfBook,
       SetRecentDoc,
       ViewData,
       OpenViewer,
       SetOpenViewer,
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
