import {BottomNavigation,Text,Surface,Divider, Provider as PaperProvider , MD2DarkTheme as  PaperDarkTheme , MD2LightTheme as  PaperLightTheme  , useTheme} from 'react-native-paper';
import {FontAwesome,MaterialCommunityIcons,Feather,SimpleLineIcons} from "@expo/vector-icons";
import {Button,Image, StyleSheet,SafeAreaView, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { getHeaderTitle } from '@react-navigation/elements';
import { CommonActions } from '@react-navigation/routers';
import { StatusBar } from 'expo-status-bar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { BlurView } from 'expo-blur';
import {TabArray} from"./constants/tabroute";
import {TabButton} from './constants/TabButton';
import Settings from './Screens/Settings';
import CreatePdf from './Screens/CreatePDF';
import PDFview from './Screens/PDFview';
import Home from './Screens/Home';
import { PDFierProvider, usePDFier } from './PdfierProvider/DataProvider';

const Tab = createMaterialTopTabNavigator();


export default function App(){

const {colors} = useTheme();
return (
<PDFierProvider>
<PaperProvider theme={PaperDarkTheme}>
      <NavigationContainer theme={PaperDarkTheme}>
        <StatusBar  hidden={true} />
        <Tab.Navigator
        tabBarPosition="bottom"
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          shifting={true}
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
             navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}

>



          <Tab.Screen
name="home"
options={{
          tabBarLabel: 'PDFier',
          tabBarIcon: ({ color, size }) => {
            return (
    <MaterialCommunityIcons
                  name="home"
                  size={size}
                  color={color} />
 );
          },
        }}
 component={Home} />
           <Tab.Screen
name="pdfbook"
options={{
          tabBarLabel: 'PdfBooks',
          tabBarIcon: ({ color, size }) => {
            return <MaterialCommunityIcons
                  name="book"
                  size={size}
                  color={color} />;
          },
        }}
 component={PDFview} />
           <Tab.Screen
name="createpdf"
options={{
          tabBarLabel: 'CreatePdf',
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome
                  name="plus"
                  size={size}
                  color={color} />;
          },
        }}
 component={CreatePdf} />
           <Tab.Screen
name="settings"
options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => {
            return <Feather
                  name="settings"
                  size={size}
                  color={color} />;
          },
        }}
 component={Settings} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
</PDFierProvider>
);
}
