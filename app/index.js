import { View, Text } from 'react-native';
import { router , Stack} from 'expo-router';
import React, { useCallback,useState, useEffect } from 'react';
import { load_system_book , load_Settings } from "./constants/DataAccess";
import { RFPercentage } from "react-native-responsive-fontsize";
import * as SplashScreen from 'expo-splash-screen';
import {Image} from 'expo-image';
import FontAwesome from "@expo/vector-icons/FontAwesome";

SplashScreen.preventAutoHideAsync();

const Page = () => {
const blurhash =  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
const [Error, setError] = useState(false);


useEffect(() => {
    async function prepare() {
      try {
        await load_system_book();
        await load_Settings();
        await SplashScreen.hideAsync();
        router.replace("/(tabs)/home");
      } catch (error) {
         setError(true);
      } finally {
         setError(false);
      }
    }
prepare();
  }, []);

return(
<View style={{flex:1}}>
 <Stack.Screen options={{ headerShown: false, }}/>
{Error === false ? (
<>
<Image
        style={{flex:1 , width:'100%' }}
        source=" "
        placeholder={blurhash}
        contentFit="cover"
        transition={10}
      />
<View style={{position:'absolute',alignItems:'center',height:'100%',width:'100%',backgroundColor:'transparent',justifyContent:'center'}}>
<FontAwesome
              size={RFPercentage(25)}
              style={{  }}
              name="gears"
              color="white"
/>
    <Text style={{fontSize:RFPercentage(3),color:'white'}}> Loading PDFier .... </Text>
</View>
</>
) : null}

{Error === true ? (<View style={{flex:1 , backgroundColor:'white',alignItems:'center', justifyContent:'center'}}>

            <FontAwesome
              size={RFPercentage(20)}
              style={{ }}
              name="gears"
              color="black"
            />
    <Text style={{fontSize:RFPercentage(2)}}> Error Loading .... </Text>

</View> ) : null}
</View>

);


}

export default Page;



