import React, { useRef, useEffect } from 'react';
import { RFPercentage } from "react-native-responsive-fontsize";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "../constants/colours"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';

export const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;

  // Define animated values for scaling
  const viewScale = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0)).current;


  const viewScaleInterpolation = viewScale.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const textScaleInterpolation = textScale.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
useEffect(() => {
    if (focused) {

      Animated.parallel([
        Animated.spring(viewScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.spring(textScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {

      Animated.parallel([
        Animated.spring(viewScale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.spring(textScale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [focused]);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { flex: focused ? 1 : 0.65 }]}>
      <View>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: item.color,
              borderRadius: 16,
              transform: [{ scale: viewScaleInterpolation }],
            },
          ]}
        />
        <View
          style={[
            styles.btn,
            { backgroundColor: focused ? null : item.alphaClr },
          ]}
        >
          <FontAwesome
              size={RFPercentage(2.5)}
              style={{ }}
              name={item.icon}
              color="white"
            />
          <Animated.View
            style={{
              transform: [{ scale: textScaleInterpolation }],
            }}
          >
            {focused && (
              <Text
                style={{
                  color: Colors.white,
                  paddingHorizontal: RFPercentage(1),
                }}
              >
                {item.label}
              </Text>
            )}
          </Animated.View>
        </View>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
   justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: RFPercentage(1),
    borderRadius: RFPercentage(1.9),
    borderColor: 'white',
    borderWidth:1,
  },
});


