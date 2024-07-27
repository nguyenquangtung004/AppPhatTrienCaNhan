import React, {useEffect, useState} from 'react';
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
import Header from './src/comp/Header';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = ({setScreenTitle}) => (
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
    })}>
    <Tab.Screen
      name="Home"
      component={HomeApp}
      options={{
        headerShown: false,
      }}
      listeners={({navigation}) => ({
        tabPress: () => {
          setScreenTitle('Home');
        },
      })}
    />
    <Tab.Screen
      name="Make Friend"
      component={MakeFriendScreen}
      options={{
        headerShown: false,
      }}
      listeners={({navigation}) => ({
        tabPress: () => {
          setScreenTitle('Make Friend');
        },
      })}
    />
    <Tab.Screen
      name="Statistical"
      component={StatisticalScreen}
      options={{
        headerShown: false,
      }}
      listeners={({navigation}) => ({
        tabPress: () => {
          setScreenTitle('Statistical');
        },
      })}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileApp}
      options={{
        headerShown: false,
      }}
      listeners={({navigation}) => ({
        tabPress: () => {
          setScreenTitle('Profile');
        },
      })}
    />
  </Tab.Navigator>
);

const App = () => {
  const [userImage, setUserImage] = useState(null);
  const [screenTitle, setScreenTitle] = useState('Home');

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userRef = firestore().collection('user').doc(user.uid);
          const doc = await userRef.get();
          if (doc.exists) {
            setUserImage(doc.data().profileImage);
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching profile image: ', error);
      }
    };

    fetchUserImage();
  }, []);

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
            options={{
              header: ({navigation}) => (
                <Header
                  title={screenTitle}
                  navigation={navigation}
                  userImage={userImage}
                />
              ),
            }}>
            {props => (
              <TabNavigator {...props} setScreenTitle={setScreenTitle} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Profile"
            component={ProfileApp}
            options={{
              header: ({navigation}) => (
                <Header
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
                <Header
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
                <Header
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
                <Header
                  title="Thiền Và Yoga"
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
