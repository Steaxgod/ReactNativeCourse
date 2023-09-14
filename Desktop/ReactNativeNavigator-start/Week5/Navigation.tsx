import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BarCodeScannerScreen } from "./BarCodeScannerScreen";
import ProductDetailScreen from "./ProductDetailScreen";
import {
  DrawerActions,
  NavigationContainer,
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import {
  StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";

import FavoritesScreen from "./FavoritesScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export function ProgNav() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: true, headerShadowVisible: false }}
    >
      <Stack.Screen
        name="BarCodeScannerScreen"
        component={BarCodeScannerScreen}
      />
      <Stack.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
      />
    </Stack.Navigator>
  );
}

export function TabNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === "Scanner") {
            iconName = focused ? "ios-barcode" : "ios-barcode-outline";
          } else if (route.name === "Favorites") {
            iconName = focused ? "ios-heart" : "ios-heart-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Scanner"
        component={ProgNav}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}
