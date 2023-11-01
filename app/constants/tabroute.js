import Colors from "./colours"


export const TabArray = [
  { route: 'home',
    label: 'PDFier',
    icon:'home',
      color: Colors.primary,
      alphaClr: Colors.primaryAlpha },

  { route: 'pdfview',
      label: 'PDFbook',
       icon: 'search',
       color: Colors.green,
       alphaClr: Colors.greenAlpha },
  { route: 'createpdf',
     label: 'CreatePDF',
     icon: 'plus-square',
     color: Colors.redAlpha,
     alphaClr: Colors.redAlpha },
  { route:'settings',
     label: 'Settings',
     icon: 'gear',
     color: Colors.purple,
     alphaClr: Colors.purpleAlpha },
];
