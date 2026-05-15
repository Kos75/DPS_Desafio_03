import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import ProductScreen from './screens/ProductScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inventario' }} />
        <Stack.Screen name="Scanner" component={ScannerScreen} options={{ title: 'Escanear QR' }} />
        <Stack.Screen name="Product" component={ProductScreen} options={{ title: 'Detalle de Producto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}