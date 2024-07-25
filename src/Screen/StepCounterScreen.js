import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import Header from '../comp/Header';
import { Accelerometer } from 'react-native-sensors';
import { map, filter } from 'rxjs/operators';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const StepScreen = ({ navigation }) => {
  const [steps, setSteps] = useState(0);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    requestActivityRecognitionPermission();
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const requestActivityRecognitionPermission = async () => {
    try {
      let result;
      if (Platform.OS === 'android') {
        result = await request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);
      } else if (Platform.OS === 'ios') {
        result = await request(PERMISSIONS.IOS.MOTION);
      }

      if (result === RESULTS.GRANTED) {
        console.log('Đã cấp quyền nhận dạng hoạt động');
      } else {
        console.log('Không cấp quyền nhận dạng hoạt động');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const startCounting = () => {
    const subscription = new Accelerometer({
      updateInterval: 400,
    })
      .pipe(
        map(({ x, y, z }) => Math.sqrt(x * x + y * y + z * z)),
        filter(speed => speed > 1.2)
      )
      .subscribe(() => {
        setSteps(prevSteps => prevSteps + 1);
      });

    setSubscription(subscription);
  };

  const stopCounting = () => {
    if (subscription) {
      subscription.unsubscribe();
      setSubscription(null);
    }
  };

  const toggleCounting = () => {
    if (subscription) {
      stopCounting();
    } else {
      startCounting();
    }
  };

  return (
    <LinearGradient colors={['#E0F7FA', '#E0F7FA']} style={styles.container}>
      <Header title="Quản lý vận động" navigation={navigation} />
      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.playButtonContainer} onPress={toggleCounting}>
          <Icon name={subscription ? "pause-circle" : "play-circle"} size={150} color="#4CAF50" />
        </TouchableOpacity>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Bước chân : {steps}</Text>
        </View>
        <LottieView
          source={require('../material/animation/dinosaur.json')}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonContainer: {
    marginBottom: 50,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  statsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  lottieAnimation: {
    width: 150,
    height: 150,
  },
});

export default StepScreen;
