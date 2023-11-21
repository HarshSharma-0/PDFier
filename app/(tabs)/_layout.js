import { Tabs,Stack,router} from 'expo-router';
import { useState , useEffect , useRef  } from 'react';
import {Alert,Text, Pressable, SafeAreaView ,Modal,View, StyleSheet , Animated , Easing } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RFPercentage } from "react-native-responsive-fontsize";
import {useShareIntent} from "../constants/useShareIntent";
import {ViewDefault , share_will_proceed } from "../constants/DataAccess";
import {TabArray} from"../constants/tabroute";
import {TabButton} from '../constants/TabButton';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import ViewTapView from '../pdfbookview/Screen6';
import Colors from "../constants/colours";
import SingleView from '../pdfbookview/SinglePdfView';
import ViewSwipePdfBook from '../pdfbookview/Screen1';
import Pdf from 'react-native-pdf';
import HandleBoth from '../HandleInput';
export default function Layout() {

const [ShowMiddle,setShowMiddle] = useState(true);
const slideAnim = useRef(new Animated.Value(-300)).current;
const colorAnim = useRef(new Animated.Value(0)).current;
const borderAnim = useRef(new Animated.Value(RFPercentage(0))).current;
const { shareIntent, resetShareIntent } = useShareIntent();
const [modalVisible, setModalVisible] = useState(false);
const [Visible,setVisible] = useState(false);
const [TriggerView,setTriggerView] = useState(0);
const [ isPdf , setPdf ] = useState([]);
const [track,setTrack] = useState(false);


useEffect(() => {
    if (shareIntent) {
     setPdf(shareIntent);
     setModalVisible(true);
    }
  }, [shareIntent]);




const slideIn = (val) => {

  Animated.spring(slideAnim, {
      toValue: RFPercentage(val),
      duration: 50,
      easing:Easing.linear,
      useNativeDriver: true,
    }).start();
  };

const slideUp = (val) => {

  Animated.spring(slideAnim, {
      toValue: RFPercentage(val),
      duration: 50,
      easing:Easing.linear,
      useNativeDriver: true,
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
if(!Visible){
  setTimeout(() => {
           slideIn(94);
        }, 100);
}
},[Visible]);

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
{ modalVisible ?
<HandleBoth CallBack={setVisible} someData={isPdf} canExit={setModalVisible}  />
: null}

{ShowMiddle ?
   <Animated.View style={[styles.ActivePop , {transform: [
      {
        translateY:slideAnim,
      },
    ], borderColor:'rgba(0, 0, 0, 0.5)',borderWidth:1}]}>
<BlurView intensity={20} tint="light" style={{
height:RFPercentage(9),
width:RFPercentage(9),
}}>
     <Pressable
    delayLongPress = {150}
    onPress ={() => {
if(isPdf.PDF !== undefined ){
if(isPdf.PDF.length > 0 ){
      const ret_data = ViewDefault(7);
      setTriggerView(ret_data);
      slideUp(50);
      setTrack(false);
setTimeout(() => {
          setVisible(true);
        }, 120);
}else{
           slideIn(94);
}
}
}}
    onLongPress = {() => {
    const ret_data = ViewDefault(7);
    setTriggerView(ret_data);
    slideUp(50);
    setTrack(true);
setTimeout(() => {
          setVisible(true);
        }, 120);
  }}
    style={{
       flex:1,
       alignItems:'center',
       justifyContent:'center',
    }}
    >
            <FontAwesome
              size={RFPercentage(4)}
              style={{ }}
              name="book"
              color="rgba(0, 0, 0, 0.5)"
            />
     </Pressable>
</BlurView>
       </Animated.View>
    : null}


      {Visible & TriggerView === 0 ? <ViewTapView Close={setVisible} ViewData = { track ? [] : isPdf.PDF } /> : null }
      {Visible & TriggerView === 1 ? <SingleView Close={setVisible} ViewData = { track ? [] : isPdf.PDF }  /> : null }

</View>
  );
}


const styles = StyleSheet.create({

ActivePop: {
overflow:'hidden',
display:'flex',
alignSelf: 'center',
alignItems: 'center',
justifyContent: 'center',
position:'absolute',
height:RFPercentage(9),
width:RFPercentage(9),
borderRadius:RFPercentage(4.5),
elevation:6,



},

pdfVisible:{
    flex: 1,
    alignSelf:'stretch',
    backgroundColor: 'transparent',

  },



});
