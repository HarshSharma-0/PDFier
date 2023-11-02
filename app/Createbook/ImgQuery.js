import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

/*
export function get_PdfGenerated(dataMap) {
const html = `
    <html>
      <body>
        <h1>Hi hello</h1>
        <p style="color: red;">Hello. Bonjour. Hola.</p>
      </body>
    </html>
  `;

  return new Promise(async (resolve, reject) => {
  try {
    const CreatedPdf = await printToFileAsync({
      html: html,
      base64: false,
    });

    await shareAsync(CreatedPdf.uri);

    // If everything is successful, resolve the Promise
    resolve(CreatedPdf);
  } catch (error) {
    // If there's an error, reject the Promise
    reject(error);
  }
});
}
*/
export function get_PdfGenerated(base) {
  return new Promise(async (resolve, reject) => {
    try {
let htmlContent = `
        <html>
          <body>
      `;
base.forEach((Image) => {
        htmlContent += `
          <div style="height: 792px; width: 612px; overflow: hidden; display: flex; justify-content: center; align-items: center;">
            <img src="data:image/jpeg;base64,${Image}" style="max-height: 100%; max-width: 100%;" />
          </div>
        `;
      });

htmlContent += `
          </body>
        </html>
      `;



      const CreatedPdf = await printToFileAsync({
        html: htmlContent,
        base64: false,
      });
      console.log(CreatedPdf);
      await shareAsync(CreatedPdf.uri);

      // If everything is successful, resolve the Promise
      resolve(CreatedPdf);
    } catch (error) {
      // If there's an error, reject the Promise
      reject(error);
    }
  });
}
