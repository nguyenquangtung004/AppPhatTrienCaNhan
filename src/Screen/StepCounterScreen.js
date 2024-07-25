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
  const [steps, setSteps] = useState(0); // Biến trạng thái để lưu số bước chân
  const [subscription, setSubscription] = useState(null); // Biến trạng thái để lưu thông tin đăng ký của cảm biến gia tốc

  useEffect(() => {
    requestActivityRecognitionPermission(); // Yêu cầu quyền nhận dạng hoạt động khi component được render
    return () => {
      if (subscription) {
        subscription.unsubscribe(); // Hủy đăng ký khi component bị unmount
      }
    };
  }, []);

  const requestActivityRecognitionPermission = async () => {
    try {
      let result;
      if (Platform.OS === 'android') {
        result = await request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION); // Yêu cầu quyền nhận dạng hoạt động trên Android
      } else if (Platform.OS === 'ios') {
        result = await request(PERMISSIONS.IOS.MOTION); // Yêu cầu quyền nhận dạng hoạt động trên iOS
      }

      if (result === RESULTS.GRANTED) {
        console.log('Đã cấp quyền nhận dạng hoạt động'); // In ra console nếu quyền đã được cấp
      } else {
        console.log('Không cấp quyền nhận dạng hoạt động'); // In ra console nếu quyền không được cấp
      }
    } catch (err) {
      console.warn(err); // Cảnh báo nếu có lỗi xảy ra
    }
  };

  const startCounting = () => {
    if (Accelerometer) {
      const subscription = new Accelerometer({
        updateInterval: 400, // Đặt khoảng thời gian cập nhật là 400ms
      })
        .pipe(
          map(({ x, y, z }) => Math.sqrt(x * x + y * y + z * z)), // Tính toán gia tốc tổng hợp
          filter(speed => speed > 1.2) // Lọc những chuyển động có gia tốc lớn hơn 1.2
        )
        .subscribe(() => {
          setSteps(prevSteps => prevSteps + 1); // Tăng số bước chân mỗi khi điều kiện lọc được thỏa mãn
        });

      setSubscription(subscription); // Lưu thông tin đăng ký vào biến trạng thái
    } else {
      console.warn('Accelerometer is not available'); // Cảnh báo nếu cảm biến gia tốc không có sẵn
    }
  };

  const stopCounting = () => {
    if (subscription) {
      subscription.unsubscribe(); // Hủy đăng ký cảm biến gia tốc
      setSubscription(null); // Đặt lại biến trạng thái về null
    }
  };

  const toggleCounting = () => {
    if (subscription) {
      stopCounting(); // Dừng đếm bước chân nếu đang đếm
    } else {
      startCounting(); // Bắt đầu đếm bước chân nếu chưa đếm
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
