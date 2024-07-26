import React from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import store from './src/redux/store';
import WelcomeApp from './src/Screen/WelcomeApp';
import LoginApp from './src/Screen/LoginApp';
import RegisterApp from './src/Screen/RegisterApp';
import HomeApp from './src/Screen/HomeApp';
import ProfileApp from './src/Screen/ProfileApp';
import MentalManagementScreen from './src/Screen/MentalManagement';
import StepCounterScreen from './src/Screen/StepCounterScreen';
import VideoScreen from './src/Screen/VideoScreen';
import StatisticalScreen from './src/Screen/StatisticalScreen';
import MakeFriendScreen from './src/Screen/MakeFriendScreen';
import CustomHeader from './src/comp/Header';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({color, size}) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Make Friend') {
          iconName = 'users';
        } else if (route.name === 'Statistical') {
          iconName = 'bar-chart';
        } else if (route.name === 'Profile') {
          iconName = 'user';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
      headerShown: false, // Ẩn header của Tab.Navigator
    })}>
    <Tab.Screen name="Home" component={HomeApp} />
    <Tab.Screen name="Make Friend" component={MakeFriendScreen} />
    <Tab.Screen name="Statistical" component={StatisticalScreen} />
    <Tab.Screen name="Profile" component={ProfileApp} />
  </Tab.Navigator>
);

const App = () => {
  const userImage = require('./src/material/image/avatar/user_icon.png'); // Đường dẫn tới ảnh avatar mặc định

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
            component={TabNavigator}
            options={{
              header: ({navigation}) => (
                <CustomHeader
                  title="Home"
                  navigation={navigation}
                  userImage={userImage}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileApp}
            options={{
              header: ({navigation}) => (
                <CustomHeader
                  title="Profile"
                  navigation={navigation}
                  userImage={userImage}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Mental"
            component={MentalManagementScreen}
            options={{
              header: ({navigation}) => (
                <CustomHeader
                  title="Mental Management"
                  navigation={navigation}
                  userImage={userImage}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Steps"
            component={StepCounterScreen}
            options={{
              header: ({navigation}) => (
                <CustomHeader
                  title="Step Counter"
                  navigation={navigation}
                  userImage={userImage}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Music"
            component={VideoScreen}
            options={{
              header: ({navigation}) => (
                <CustomHeader
                  title="Music"
                  navigation={navigation}
                  userImage={userImage}
                />
              ),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
