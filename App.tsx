import React from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import store from './src/redux/store';
import WelcomeApp from './src/Screen/WelcomeApp';
import LoginApp from './src/Screen/LoginApp';
import RegisterApp from './src/Screen/RegisterApp';
import HomeApp from './src/Screen/HomeApp';
import ProfileApp from './src/Screen/ProfileApp';
import MentalManagementScreen from './src/Screen/MentalManagement'; // Import new screen component
import StepCounterScreen from './src/Screen/StepCounterScreen';
import VideoScreen from './src/Screen/VideoScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={WelcomeApp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginApp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegisterApp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={HomeApp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileApp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Mental"
            component={MentalManagementScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Steps"
            component={StepCounterScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Music"
            component={VideoScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
