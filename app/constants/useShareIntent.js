import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import Constants from "expo-constants";

import ReceiveSharingIntent from "react-native-receive-sharing-intent";

export const getShareIntentAsync = async () => {
  return new Promise((resolve, reject) => {
    ReceiveSharingIntent.getReceivedFiles(
      (isdata) => {

        const intent = isdata.map((isData, index) => ({
            uri: isData.contentUri,
            mimeType: isData.mimeType,
            fileName: isData.fileName,
            }));
          resolve(intent);
      },
      (err) => {
       console.log(err);
       reject(false);
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
      .catch((err) => setError("shareIntent error : " + err?.message));

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
