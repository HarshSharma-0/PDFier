import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import Constants from "expo-constants";
import ReceiveSharingIntent from "react-native-receive-sharing-intent";

export const getShareIntentAsync = async () => {
  try {
    const isData = await ReceiveSharingIntent.getReceivedFiles(
      Constants.expoConfig.scheme
    );

    if (!isData || !Array.isArray(isData)) {
      return { PDF: [], Image: [] };
    }

    const filteredDataImage = isData.filter(
      (data) =>
        data.mimeType === "image/png" ||
        data.mimeType === "image/jpeg" ||
        data.mimeType === "image/jpg"
    );

    const filteredDataPdf = isData.filter(
      (data) => data.mimeType === "application/pdf"
    );

    const imageData = filteredDataImage.map((data) => ({
      uri: "file://" + data.filePath,
    }));

    const pdfData = filteredDataPdf.map((data) => ({
      uri: data.filePath,
      fileName: data.fileName,
    }));

    return { PDF: pdfData, Image: imageData };
  } catch (error) {
    console.error(error);
    return { PDF: [], Image: [] };
  }
};

export const clearShareIntent = () => {
  ReceiveSharingIntent?.clearReceivedFiles();
};

export function useShareIntent() {
  const appState = useRef(AppState.currentState);
  const [shareIntent, setShareIntent] = useState({ PDF: [], Image: [] });
  const [error, setError] = useState();

  const refreshShareIntent = async () => {
    try {
      const intentData = await getShareIntentAsync();
      setShareIntent(intentData);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        refreshShareIntent();
      } else if (
        appState.current === "active" &&
        ["inactive", "background"].includes(nextAppState)
      ) {
        setShareIntent({ PDF: [], Image: [] });
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
    resetShareIntent: () => setShareIntent({ PDF: [], Image: [] }),
    error,
  };
}
