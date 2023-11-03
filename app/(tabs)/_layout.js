import { Tabs,Stack} from 'expo-router';
import { useState ,useEffect , useRef  } from 'react';
import {Text, SafeAreaView ,Modal,View, StyleSheet , Animated , Easing } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RFPercentage } from "react-native-responsive-fontsize";
import {useShareIntent} from "../constants/useShareIntent";
import {ViewDefault} from "../constants/DataAccess";
import {TabArray} from"../constants/tabroute";
import {TabButton} from '../constants/TabButton';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import ViewTapView from '../pdfbookview/Screen6';
import Colors from "../constants/colours";
import SingleView from '../pdfbookview/SinglePdfView';
import ViewSwipePdfBook from '../pdfbookview/Screen1';

import Pdf from 'react-native-pdf';

export default function Layout() {

const [ShowMiddle,setShowMiddle] = useState(false);
const slideAnim = useRef(new Animated.Value(-300)).current;
const colorAnim = useRef(new Animated.Value(0)).current;
const borderAnim = useRef(new Animated.Value(RFPercentage(0))).current;
const { shareIntent, resetShareIntent } = useShareIntent();
const [modalVisible, setModalVisible] = useState(false);
const [Visible,setVisible] = useState(false);
const [TriggerView,setTriggerView] = useState(0);
const [ isPdf , setPdf ] = useState("");

useEffect(() => {
    if (shareIntent) {
      setPdf(shareIntent);
      const ret_data = ViewDefault(7);
      setTriggerView(ret_data);
      setVisible(true);
      resetShareIntent();
    }
  }, [shareIntent]);



const colorInterpolation = colorAnim.interpolate({
  inputRange: [0, 1 ,2 , 3, 4 ,5 ],
  outputRange: ['#f9ff11','#22ff24','#ff341a','#1dffff','#ff8f11','#18f994'],
});


const startColorAnimation = () => {
  Animated.loop(
    Animated.sequence([

      Animated.parallel([
        Animated.timing(borderAnim, {
          toValue: RFPercentage(0.5),
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 5,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]),

      Animated.parallel([
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]),
    ])
  ).start();
}

const slideIn = () => {
  Animated.spring(slideAnim, {
      toValue: RFPercentage(5),
      duration: 400,
      useNativeDriver: false,
    }).start();
  };
const slideOut = (bookName) => {
  Animated.timing(slideAnim, {
    toValue: -300,
    duration: 400,
    useNativeDriver: false,
  }).start(() => {
       setShowMiddle(false);
  });
};

useEffect(() => {
 startColorAnimation();
  slideIn();
},[]);

  return (
 <View style={{flex:1,}}>
<Stack.Screen options={{ headerShown:false, }} />
    <StatusBar style="light" />
    <Tabs
        screenOptions={{
           tabBarStyle: {
                   position:'absolute',
                   bottom:0,
                   backgroundColor: 'white',
                   borderTopLeftRadius:15,
                   borderTopRightRadius:15,
                   width:'100%',
                   height:'10%',
                   overflow:'hidden',
                        },
          }}>


{TabArray.map((item, index) => {
        return (
          <Tabs.Screen key={index} name={item.route}
            options={{
              title:item.label,
              tabBarShowLabel: false,
              header: () => (
            <View style={{ width: '100%',justifyContent:'flex-end', alignItems:'center', height: RFPercentage(15), borderRadius: 10, backgroundColor: item.alphaClr }}>
              <Text style={{fontSize:RFPercentage(8), color:'white'}}>{item.label}</Text>
            </View>
          ),
              tabBarButton: (props) => <TabButton {...props} item={item} />,
            }}
          />
        )
      })}



    </Tabs>
{ShowMiddle ?
    <Animated.View style={[styles.ActivePop , {bottom:slideAnim ,borderColor:colorInterpolation ,borderWidth:borderAnim }]}>
            <FontAwesome
              size={RFPercentage(4)}
              style={{ }}
              name="book"
              color="red"
            />
       </Animated.View>
    : null}


      {Visible & TriggerView === 0 ? <ViewTapView Close={setVisible} ViewData = {isPdf} /> : null }
      {Visible & TriggerView === 1 ? <SingleView Close={setVisible} ViewData = {isPdf} /> : null }
      {Visible & TriggerView === 2 ? <ViewSwipePdfBook Close={setVisible} ViewData = {isPdf} /> : null }

</View>
  );
}


const styles = StyleSheet.create({

ActivePop: {
display:'flex',
alignSelf: 'center',
alignItems: 'center',
justifyContent: 'center',
position:'absolute',
height:RFPercentage(9),
width:RFPercentage(9),
borderRadius:RFPercentage(4.5),
backgroundColor:'white',
elevation:6,



},

pdfVisible:{
    flex: 1,
    alignSelf:'stretch',
    backgroundColor: 'transparent',

  },



});
