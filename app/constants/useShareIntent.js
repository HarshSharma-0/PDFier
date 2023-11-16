import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import Constants from "expo-constants";

import ReceiveSharingIntent from "react-native-receive-sharing-intent";

export const getShareIntentAsync = async () => {
  return new Promise((resolve, reject) => {
    ReceiveSharingIntent.getReceivedFiles(
      (isdata) => {
        // Assuming isdata is an array

        // Filter elements with the same MIME type as the first one
        const filteredDataImage = isdata.filter(
          (isData) =>
            isData.mimeType === 'image/png' ||
            isData.mimeType === 'image/jpeg' ||
            isData.mimeType === 'image/jpg'
        );
        const filteredDataPdf = isdata.filter((isData) => isData.mimeType === 'application/pdf');

        // Map the filtered array to create the intent array
        const imageData = filteredDataImage.map((filteredImage) => ({
          uri: "file://" + filteredImage.filePath, // Corrected variable name
        }));

        const pdfData = filteredDataPdf.map((filteredPdf) => ({
          uri: filteredPdf.filePath,
          fileName: filteredPdf.fileName,
        }));

        resolve({ PDF: pdfData, Image: imageData });
      },
      (err) => {
        resolve(null);
      },
      Constants.expoConfig.scheme
    );
  });
};

export const clearShareIntent = () => {
  ReceiveSharingIntent?.clearReceivedFiles();
};

export function useShareIntent() {
  const appState = useRef(AppState.currentState);
  const [shareIntent, setShareIntent] = useState(null);
  const [error, setError] = useState();

  const refreshShareIntent = () =>
    getShareIntentAsync()
      .then(setShareIntent)
      .catch((err) => setError(null) );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        refreshShareIntent();
      } else if (
        appState.current === "active" &&
        ["inactive", "background"].includes(nextAppState)
      ) {
        setShareIntent(null);
      }

      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    refreshShareIntent();
    return clearShareIntent;
  }, []);


  return {
    shareIntent,
    resetShareIntent: () => setShareIntent(null),
    error,
  };
}
