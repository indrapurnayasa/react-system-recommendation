import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FirstScreen from './src/screens/FirstScreen';
import UsernamePasswordLoginScreen from './src/screens/UsernamePasswordLoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import InsightScreen from './src/screens/InsightScreen';
import MainScreen from './src/screens/MainScreen';
import GrowthScreen from './src/screens/GrowthScreen';
import WebView from 'react-native-webview';
import WebViewScreen from './src/screens/WebViewScreen';
import { AppRegistry, StatusBar } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar 
        barStyle="dark-content" // or "light-content" depending on your background
        translucent={true} // make the StatusBar transparent
        backgroundColor="transparent" // fully transparent background
      />
      <Stack.Navigator initialRouteName="First">
        <Stack.Screen
          name="First"
          component={FirstScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UsernamePasswordLogin"
          component={UsernamePasswordLoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Insight"
          component={InsightScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Growth"
          component={GrowthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="WebViewScreen" 
          component={WebViewScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent('main', () => App);

