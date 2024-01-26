​export const PDFCreator = async (
  Notification,
  Orientaion,
  PageSize,
  Save,
  setLogsCreation,
  setTaskerBusy,
  imagePaths,
  setImagePaths,
  ) => {


let htmlContent = `<html>
                  <body>
                  `;

for(let j = 0 ; j < imagePaths.length; j++){
 const Path = ​imagePaths[​j​]​.​path.​toString​(​)​;
 const​ ​manipResult​ ​=​ ​await​ ​ImageResizer​.​createResizedImage​(
​       ​Path,
​       ​imagePaths[​j​]​.​width​ ​>​ ​1500​ ? ​imagePaths[​j​]​.​width​ ​*​0.5​ : ​imagePaths[​j​]​.​width​,
 ​      ​imagePaths[​j​]​.​height​ ​>​ ​1500​ ? ​imagePaths[​j​]​.​height​*​ ​0.5​ : ​imagePaths[​j​]​.​height​,
​      ​'JPEG'​,
​       ​50​,
​       ​0​,
​       ​Path,
​       ​false​,
​       ​{
​         ​mode​:​'cover'​,
​         ​onlyScaleDown​:​true​,
​       ​}
​    ​)​;
​htmlContent​ ​+=​ ​`<div style="height: 100% ; width: 100%; overflow: hidden; page-break-before: always; display: flex; justify-content: center; align-items: center ">
​  <div style="height: 100% ; width: 100% ; display: flex; justify-content: center; align-items: center;">
​    <img src="​${Path}​" style="max-height: 100%; max-width: 100%;">
​  </div>
​</div>`​;
};
htmlContent += ` </body>
              </html>`;


};




/*
​  ​const​ ​manipResult​ ​=​ ​await​ ​ImageResizer​.​createResizedImage​(
​      ​imagePaths[​j​]​.​uri​.​toString​(​)​,
​      ​imagePaths[​j​]​.​width​ ​>​ ​1500​ ? ​imagePaths[​j​]​.​width​ ​*​0.5​ : ​imagePaths[​j​]​.​width​,
​      ​imagePaths[​j​]​.​height​ ​>​ ​1500​ ? ​imagePaths[​j​]​.​height​*​ ​0.5​ : ​imagePaths[​j​]​.​height​,
​      ​'JPEG'​,
​       ​50​,
​       ​0​,
​       ​null​,
​       ​false​,
​       ​{
​         ​mode​:​'cover'​,
​         ​onlyScaleDown​:​true​,
​       ​}
​    ​)​;
​

*/
