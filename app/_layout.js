import { useState, useEffect , React } from "react";
import { AppState } from "react-native";
import { Stack  } from "expo-router";
import {load_system_book} from './(tabs)/DataAccess.js';



export default function RootLayout() {

useEffect(() => {
  load_system_book();
}, []);

return <Stack />

}



