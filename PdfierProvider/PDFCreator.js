import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';





export const PDFCreator = async (
  notification,
  orientation,
  pageSize,
  save,
  setLogsCreation,
  setTaskerBusy,
  imagePaths,
  pdfName,
  extPath
) => {

  const lengthData = imagePaths.length;
  let htmlContent = `<html>
                      <body>
                    `;

  for (let j = 0; j < lengthData; j++) {
    const path = imagePaths[j].path.toString();
    const manipResult = await ImageResizer.createResizedImage(
      path,
      imagePaths[j].width > 1500 ? imagePaths[j].width * 0.5 : imagePaths[j].width,
      imagePaths[j].height > 1500 ? imagePaths[j].height * 0.5 : imagePaths[j].height,
      'JPEG',
      50,
      0,
      null,
      false,
      {
        mode: 'cover',
        onlyScaleDown: true,
      },
    );
    setLogsCreation({ text: `Compressed Image (${j + 1}/${lengthData})`, Progress: (j + 1) / lengthData });
    htmlContent += `<div style="height: 100%; width: 100%; overflow: hidden; page-break-before: always; display: flex; justify-content: center; align-items: center ">
                      <div style="height: 100%; width: 100%; display: flex; justify-content: center; align-items: center;">
                        <img src="file://${manipResult.path}" style="max-height: 100%; max-width: 100%;">
                      </div>
                    </div>`;
  }

  htmlContent += ` </body>
                  </html>`;
    setLogsCreation({ text:"Creating PDF", Progress: 1 });
  try {
    const pdfFile = await RNHTMLtoPDF.convert({
      html: htmlContent,
      fileName: pdfName,
      height: pageSize.dpHeight,
      width: pageSize.dpWidth,
    });
    await RNFS.moveFile(pdfFile.filePath,extPath);
    setLogsCreation({ text:"PDF Created", Progress: 1 });
    return true;
  } catch (error) {
    setLogsCreation({text:"Error CreatingPdf",Progress:0});
    return null;
  }
};

