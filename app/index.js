import { View, Text } from 'react-native';
import { router , Stack} from 'expo-router';
import React, { useCallback,useState, useEffect } from 'react';
import { load_system_book , load_Settings } from "./(tabs)/DataAccess";
import { RFPercentage } from "react-native-responsive-fontsize";
import * as SplashScreen from 'expo-splash-screen';
import FontAwesome from "@expo/vector-icons/FontAwesome";

SplashScreen.preventAutoHideAsync();

const Page = () => {

const [Error, setError] = useState(false);


useEffect(() => {
    async function prepare() {
      try {
        await load_system_book();
        await load_Settings();
        await SplashScreen.hideAsync();
        router.replace("/(tabs)/home");
      } catch (e) {
         setError(true);
      } finally {
         setError(true);
      }
    }
prepare();
  }, []);

const onLayoutRootView = useCallback(async () => {
    if (Error) {
      await SplashScreen.hideAsync();
    }
  }, [Error]);

  if (!Error) {
    return null;
  }

return(

<View onLayout={onLayoutRootView} style={{flex:1 , backgroundColor:'white',alignItems:'center', justifyContent:'center'}}>
  <Stack.Screen options={{ headerShown: false, }}/>

            <FontAwesome
              size={RFPercentage(20)}
              style={{ }}
              name="gears"
              color="black"
            />
    <Text style={{fontSize:RFPercentage(2)}}> Error Loading .... </Text>

</View>

);


}

export default Page;



//return <Redirect href={"/(tabs)/home"} />
