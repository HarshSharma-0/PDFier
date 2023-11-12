import {StyleSheet , Text , View , Switch , Pressable , Animated , Easing } from 'react-native';
import React, { useState, useEffect ,useRef } from 'react';
import { RFPercentage} from "react-native-responsive-fontsize";
import Colors from "../../constants/colours"
import { load_Settings ,Setting_Configration , gestureEnable , ViewDefault , SetMaxView , SetStorage , SetCache} from "../../constants/DataAccess";

const SettingsViewToggle = (props) => {


  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => { setIsEnabled(previousState => !previousState);
   gestureEnable(!isEnabled);
   Setting_Configration();

  }

useEffect(() => {

    const ret_data = gestureEnable(2);
    setIsEnabled(ret_data);

}, []);



    return (
      <View style={{flex:1, backgroundColor:'white', borderRadius:10, flexDirection:'row' , borderWidth:1 , borderColor:Colors.purpleAlpha,  }}>
       <View style={{flex:0.8, display:'flex', backgroundColor:'white',borderRadius:10 }}>
          <Text style={{fontSize:RFPercentage(2) , fontWeight:'bold', color:Colors.purpleAlpha}} > {props.Label} </Text>
             <Text style={{fontSize:RFPercentage(1.8) , color:Colors.purpleAlpha}}> {props.Description} </Text>
       </View>
  <View style ={{flex:0.2 , alignItems: 'center', justifyContent: 'center',}}>

     <Switch
        trackColor={{true: '#ce07ff' , false: "grey"}}
        thumbColor={isEnabled ? '#ce07ff' : 'grey'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
        style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
      />

  </View>
     </View>
    );
  };


const SettingsViewDefault = (props) => {

   const SizeAnimTaps = useRef(new Animated.Value(RFPercentage(2))).current;
   const SizeAnimtap = useRef(new Animated.Value(RFPercentage(2))).current;
   const SizeAnimTab = useRef(new Animated.Value(RFPercentage(2))).current;

   const[ token , setToken ] = useState(0);
   let colorArray =[ "grey", Colors.purpleAlpha ];
   let arraytext = ["Tap2View", "SinglePdfView" , "TabSwipeView"];


const ContextSwitch = (index) => {

setToken(index);
ViewDefault(index);
Setting_Configration();

if(index === 0){
      Animated.parallel([
        Animated.spring(SizeAnimTaps, {
          toValue: RFPercentage(3),
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(SizeAnimtap, {
          toValue: RFPercentage(2),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(SizeAnimTab, {
          toValue: RFPercentage(2),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
      ]).start();


}
else if(index === 1){
Animated.parallel([
        Animated.timing(SizeAnimTaps, {
          toValue: RFPercentage(2),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
        Animated.spring(SizeAnimtap, {
          toValue: RFPercentage(3),
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(SizeAnimTab, {
          toValue: RFPercentage(2),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
      ]).start();

}
else{
Animated.parallel([
        Animated.timing(SizeAnimTaps, {
          toValue: RFPercentage(2),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(SizeAnimtap, {
          toValue: RFPercentage(2),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
        Animated.spring(SizeAnimTab, {
          toValue: RFPercentage(3),
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start();

}



};
useEffect(() => {
    const ret_data = ViewDefault(7);
    if(ret_data === 0){
           Animated.spring(SizeAnimTaps, {
          toValue: RFPercentage(3),
          duration: 400,
          useNativeDriver: false,
        }).start();
     }
     else if(ret_data === 1){
           Animated.spring(SizeAnimtap, {
          toValue: RFPercentage(3),
          duration: 400,
          useNativeDriver: false,
        }).start();
    }
     else{
        Animated.spring(SizeAnimTab, {
          toValue: RFPercentage(3),
          duration: 400,
          useNativeDriver: false,
        }).start();
}
    setToken(ret_data);
}, []);



    return (
      <View style={{flex:1, backgroundColor:'white', borderRadius:10, flexDirection:'row',overflow:'hidden',borderWidth:1 , borderColor:Colors.purpleAlpha}}>
        <View style={{flex:1, display:'flex',backgroundColor:'white', overflow:'hidden'}}>
          <Text  style={{fontSize:RFPercentage(2), fontWeight:'bold', color:Colors.purpleAlpha}} > {props.Label} </Text>

     <View style={{flex:1 , flexDirection:'row', justifyContent:'space-between' , alignItems:'center' , borderRadius:10}}>
          <Text style={{fontSize:RFPercentage(2),color:Colors.purpleAlpha}}> {props.Description} </Text>
          <Text style={{fontSize:RFPercentage(2.5),color:Colors.purpleAlpha}}> { arraytext[token] } </Text>
     </View>
     <View style={{flex:1, flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',backgroundColor:'white' , borderRadius:10}}>

             <Pressable onPress={()=>ContextSwitch(0)}>
               <Animated.Text style={{

             fontSize:SizeAnimTaps,
             color:token === 0 ? colorArray[1] : colorArray[0]


                 }}>{arraytext[0]}</Animated.Text>
             </Pressable>

             <Pressable onPress={()=>ContextSwitch(1)}>
               <Animated.Text style={{

             fontSize:SizeAnimtap,
             color:token === 1 ? colorArray[1] : colorArray[0]

              }}>{arraytext[1]}</Animated.Text>

             </Pressable>

             <Pressable onPress={()=>ContextSwitch(2)}>
               <Animated.Text style={{

             fontSize:SizeAnimTab,
             color:token === 2 ? colorArray[1] : colorArray[0]

                }}>{arraytext[2]}</Animated.Text>
             </Pressable>
          </View>
        </View>
      </View>
    );
  };

const SettingsViewDocSave = (props) => {

   const SizeAnimTaps = useRef(new Animated.Value(RFPercentage(3))).current;
   const SizeAnimtap = useRef(new Animated.Value(RFPercentage(3))).current;
   const SizeAnimTab = useRef(new Animated.Value(RFPercentage(3))).current;
   const SizeAnimTabs = useRef(new Animated.Value(RFPercentage(3))).current;
   const [numToken,setnumToken] = useState(0);
   const [current , setCurrent] = useState(5);
   let colorArray =["grey", Colors.purpleAlpha ];
   let maxView = [5,8,9,12];

useEffect(() => {

    const ret_data = SetMaxView(1);
   if(ret_data === 5){
        Animated.spring(SizeAnimTaps, {
          toValue: RFPercentage(5),
          duration: 400,
          useNativeDriver: false,
        }).start();
}
   else if(ret_data === 8){
        Animated.spring(SizeAnimtap, {
          toValue: RFPercentage(5),
          duration: 400,
          useNativeDriver: false,
        }).start();
}
   else if(ret_data === 9){
        Animated.spring(SizeAnimTab, {
          toValue: RFPercentage(5),
          duration: 400,
          useNativeDriver: false,
        }).start();
}
   else{
        Animated.spring(SizeAnimTabs, {
          toValue: RFPercentage(5),
          duration: 400,
          useNativeDriver: false,
        }).start();
}
    setCurrent(ret_data);
    setnumToken(maxView.indexOf(ret_data));

}, []);

const ContextSwitch = (index) => {
setnumToken(index);
setCurrent(maxView[index]);
SetMaxView(maxView[index]);
Setting_Configration();
if(index === 0){
      Animated.parallel([
        Animated.spring(SizeAnimTaps, {
          toValue: RFPercentage(5),
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(SizeAnimtap, {
          toValue: RFPercentage(3),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(SizeAnimTab, {
          toValue: RFPercentage(3),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(SizeAnimTabs, {
          toValue: RFPercentage(3),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
      ]).start();


}
else if(index === 1){
Animated.parallel([
        Animated.timing(SizeAnimTaps, {
          toValue: RFPercentage(3),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
        Animated.spring(SizeAnimtap, {
          toValue: RFPercentage(5),
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(SizeAnimTab, {
          toValue: RFPercentage(3),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(SizeAnimTabs, {
          toValue: RFPercentage(3),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),

      ]).start();

}else if(index === 2){

Animated.parallel([
        Animated.timing(SizeAnimTaps, {
          toValue: RFPercentage(3),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(SizeAnimtap, {
          toValue: RFPercentage(3),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(SizeAnimTabs, {
          toValue: RFPercentage(3),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
        Animated.spring(SizeAnimTab, {
          toValue: RFPercentage(5),
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start();


}
else{
Animated.parallel([
        Animated.timing(SizeAnimTaps, {
          toValue: RFPercentage(3),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(SizeAnimtap, {
          toValue: RFPercentage(3),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
        Animated.spring(SizeAnimTabs, {
          toValue: RFPercentage(5),
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(SizeAnimTab, {
          toValue: RFPercentage(3),
          easing:Easing.linear,
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start();

}



};

    return (
      <View style={{flex:1, backgroundColor:'white', borderRadius:10,overflow:'hidden',borderWidth:1 , borderColor:Colors.purpleAlpha}}>
       <Text style={{fontSize:RFPercentage(2) , color:Colors.purpleAlpha , fontWeight:'bold'}} > {props.Label} </Text>
        <View style={{flex:1, flexDirection:'row', display:'flex',backgroundColor:'white',borderRadius:10, alignItems:'center',justifyContent:'space-between'}}>
           <Text style={{fontSize:RFPercentage(1.5) , color:Colors.purpleAlpha}}> {props.Description}  </Text>
           <Text style={{fontSize:RFPercentage(4) , color:Colors.purpleAlpha}}> {current}</Text>
        </View>
     <View style={{flex:1, flexDirection:'row',justifyContent:'space-evenly',alignItems:'center' , backgroundColor:'white',borderRadius:10}}>
             <Pressable onPress={()=>ContextSwitch(0)}>
               <Animated.Text style={{

                    fontSize:SizeAnimTaps ,
                    color: numToken === 0 ? colorArray[1] : colorArray[0]

                   }}>{ maxView [0]}</Animated.Text>
             </Pressable>

             <Pressable onPress={()=>ContextSwitch(1)}>
               <Animated.Text style={{

                fontSize:SizeAnimtap,
		color: numToken === 1 ? colorArray[1] : colorArray[0]

               }}>{ maxView [1]}</Animated.Text>
             </Pressable>

             <Pressable onPress={()=>ContextSwitch(2)}>
               <Animated.Text style={{
                   fontSize:SizeAnimTab,
                   color: numToken === 2 ? colorArray[1] : colorArray[0]
                }}>{ maxView [2]}</Animated.Text>
             </Pressable>

             <Pressable onPress={()=>ContextSwitch(3)}>
               <Animated.Text style={{

                fontSize:SizeAnimTabs,
                color: numToken === 3 ? colorArray[1] : colorArray[0]

                   }}>{ maxView [3]}</Animated.Text>
             </Pressable>
          </View>
      </View>
    );
  };

const SettingsViewMaxView = (props) => {

   const SizeAnimTaps = useRef(new Animated.Value(RFPercentage(2))).current;
   const SizeAnimtap = useRef(new Animated.Value(RFPercentage(2))).current;
   const colorAnim = useRef(new Animated.Value(0)).current;
   const colorDeactivate = useRef(new Animated.Value(0)).current;
   const[ token , setToken ] = useState(0);
   let colorArray =["grey", Colors.purpleAlpha ];
   let arraytext = [ "Cache" , "InternalStorage"];

useEffect(() => {

    const ret_data = SetStorage(2);
  if( ret_data  === true ){
        Animated.spring(SizeAnimtap, {
          toValue: RFPercentage(3),
          duration: 400,
          useNativeDriver: false,
        }).start()
    } else {
        Animated.spring(SizeAnimTaps, {
          toValue: RFPercentage(3),
          duration: 400,
          useNativeDriver: false,
        }).start();
}
    setToken ( ret_data ? 1 : 0);

}, []);

const ContextSwitch = (index) => {

setToken(index);
SetStorage(index === 0 ? false : true);
Setting_Configration();

if(index === 0){
      Animated.parallel([
        Animated.spring(SizeAnimTaps, {
          toValue: RFPercentage(3),
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(SizeAnimtap, {
          toValue: RFPercentage(2),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),

      ]).start();

}
else {
Animated.parallel([
        Animated.timing(SizeAnimTaps, {
          toValue: RFPercentage(2),
          duration: 400,
          easing:Easing.linear,
          useNativeDriver: false,
        }),
        Animated.spring(SizeAnimtap, {
          toValue: RFPercentage(3),
          duration: 400,
          useNativeDriver: false,
        }),

      ]).start();

}

};

    return (
      <View style={{flex:1, borderRadius:10, flexDirection:'row',overflow:'hidden' , borderWidth:1 , borderColor:Colors.purpleAlpha}}>
        <View style={{flex:1, display:'flex',backgroundColor:'white',borderRadius:10,}}>
          <Text  style={{fontSize:RFPercentage(2) , fontWeight:'bold' , color:Colors.purpleAlpha}} > {props.Label} </Text>
     <View style={{flex:1 , flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <Text style={{fontSize:RFPercentage(1.5), color:Colors.purpleAlpha}}> {props.Description} </Text>
          <Text style={{fontSize:RFPercentage(2.5), color:Colors.purpleAlpha}}> { arraytext[token] } </Text>
     </View>
     <View style={{flex:1, flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',backgroundColor:'white',borderRadius:10}}>
             <Pressable onPress={()=>ContextSwitch(0)}>
               <Animated.Text style={{fontSize:SizeAnimTaps , color: token === 0 ? colorArray[1] : colorArray[0] }}>{arraytext[0]}</Animated.Text>
             </Pressable>
             <Pressable onPress={()=>ContextSwitch(1)}>
               <Animated.Text style={{fontSize:SizeAnimtap , color: token === 1 ? colorArray[1] : colorArray[0] }}>{arraytext[1]}</Animated.Text>
             </Pressable>
          </View>
        </View>
      </View>
    );
  };



const SettingsViewTheme = (props) => {

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => { setIsEnabled(previousState => !previousState);
    SetCache(!isEnabled);
   Setting_Configration();

  }
useEffect(() => {

    const ret_data = SetCache(2);
    setIsEnabled (ret_data);

}, []);


    return (
      <View style={{flex:1, backgroundColor:'white', borderRadius:10, flexDirection:'row',overflow:'hidden',borderWidth:1 , borderColor:Colors.purpleAlpha}}>
    <View style={{flex:1}}>
        <View style={{flex:1, display:'flex',backgroundColor:'white',borderRightWidth:1, borderTopRightRadius:10,borderBottomRightRadius:10,borderColor:Colors.purpleAlpha}}>
           <Text  style={{fontSize:RFPercentage(2) , color:'grey', fontWeight:'bold'}} > {props.Label} </Text>
           <Text style={{fontSize:RFPercentage(2), color:'grey'}}> {props.Description} </Text>
           <Text style={{color:'grey'}}> default set to light , DarkMode still in development </Text>
        </View>
    </View>
        <View style={{flex:1,backgroundColor:'white',borderRadius:10,}}>
           <View style={{flex:1.5,backgroundColor:'white'}}>
           <Text  style={{fontSize:RFPercentage(2) , color:Colors.purpleAlpha , fontWeight:'bold'}} > Copy PDFs to Cache</Text>
           <Text  style={{fontSize:RFPercentage(2) , color:Colors.purpleAlpha }} > enable this to copy content pdf to app cache </Text>
           </View>
   <View style={{flex:1,backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
        <Switch
        trackColor={{true: '#ce07ff' , false: "grey"}}
        thumbColor={isEnabled ? '#ce07ff' : 'grey'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
        style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
      />
    </View>
        </View>
      </View>
    );
  };


export { SettingsViewTheme , SettingsViewMaxView , SettingsViewDocSave , SettingsViewDefault , SettingsViewToggle };
