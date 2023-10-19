import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import React, { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { RunTimeLoad } from './RuntimeDataManager';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';

const Page = () => {


return(
<Redirect href={"/(tabs)/settings"} />
);


}

export default Page;



//return <Redirect href={"/(tabs)/home"} />
