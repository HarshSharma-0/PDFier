import {StyleSheet , Text , View , Switch } from 'react-native';
import { RFPercentage} from "react-native-responsive-fontsize";
import React, { useState, useEffect } from 'react';
import { Stack } from "expo-router";
import { SwipeEnabledText,
         DefaultViewText,
         DocSavePath,
         MaxPdfView,
         DefaultTheme,
     } from './text';
import { SettingsViewTheme , SettingsViewMaxView , SettingsViewDocSave , SettingsViewDefault , SettingsViewToggle } from './viewSettings';
import { load_Settings } from "../../constants/DataAccess";

export default function Page() {




   return (
    <View style={{flex:1,gap:10, backgroundColor:'white' , marginTop:'2%'}}>
     <Stack.Screen options={{ headerShown: false, }}/>


     <SettingsViewToggle  Label="SwipeEnabled" Description={SwipeEnabledText}  />
     <SettingsViewDefault Label="DefaultView"  Description={DefaultViewText}   />
     <SettingsViewDocSave  Label="MaxPdfView" Description={MaxPdfView}        />
     <SettingsViewMaxView  Label="DocSavePath" Description={DocSavePath}        />
     <SettingsViewTheme  Label="DefaultTheme" Description={DefaultTheme}       />

    <View style={{flex:0.8}} />
    </View>
  );
}

const styles = StyleSheet.create({

Settings: {
flex:1.5,
backgroundColor:'#780eff',
borderBottomRightRadius:15,
borderBottomLeftRadius:15,
alignItems:'center',
justifyContent:'center',
},
TextSetting: {
fontSize:RFPercentage(6),
fontWeight:'bold',
color:'white',
},


});
