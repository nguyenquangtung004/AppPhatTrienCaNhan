import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeApp from './src/comp/WelcomeApp';
import LoginApp from './src/comp/LoginApp';
import RegisterApp from './src/comp/RegisterApp';
import HomeApp from './src/comp/HomeApp';
import ProfileApp from './src/comp/ProfileApp';
import MentalManagement from './src/comp/MentalManagement';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeApp} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginApp} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterApp} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeApp} options={{ headerShown: false }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
