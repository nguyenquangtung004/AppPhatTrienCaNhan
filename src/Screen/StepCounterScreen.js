import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Image, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { map, filter, debounceTime } from 'rxjs/operators';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const STEP_LENGTH_KM = 0.000762; // Chiều dài trung bình của một bước chân
const CALORIES_PER_STEP = 0.04; // Calo tiêu thụ mỗi bước

const StepScreen = ({ navigation }) => {
  const [steps, setSteps] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    requestActivityRecognitionPermission();
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else if (!isRunning && startTime !== null) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

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
    setUpdateIntervalForType(SensorTypes.accelerometer, 400); // Thiết lập tần suất cập nhật cho accelerometer

    const subscription = accelerometer
      .pipe(
        map(({ x, y, z }) => Math.sqrt(x * x + y * y + z * z)), // Tính tốc độ
        filter(speed => speed > 1.5), // Lọc ra các chuyển động đủ mạnh (ngưỡng có thể điều chỉnh)
        debounceTime(400) // Loại bỏ các tín hiệu rung nhanh
      )
      .subscribe(speed => {
        if (speed > 1.5) { // Kiểm tra xem có phải là chuyển động thực sự không
          setSteps(prevSteps => prevSteps + 1);
        }
      });

    setSubscription(subscription);
    setIsRunning(true);
    setStartTime(Date.now());
  };

  const stopCounting = () => {
    if (subscription) {
      subscription.unsubscribe();
      setSubscription(null);
    }
    setIsRunning(false);
  };

  const resetAll = () => {
    stopCounting();
    setSteps(0);
    setElapsedTime(0);
    setStartTime(null);
  };

  const toggleCounting = () => {
    if (isRunning) {
      stopCounting();
    } else {
      startCounting();
    }
  };

  const distance = (steps * STEP_LENGTH_KM).toFixed(2);
  const calories = (steps * CALORIES_PER_STEP).toFixed(2);
  const hours = Math.floor(elapsedTime / 3600000);
  const minutes = Math.floor((elapsedTime % 3600000) / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);

  return (
    <View style={styles.container}>
      <ScrollView>


        <View style={styles.metricSection}>
          <Text style={styles.metricTitle}>Bước chân</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${(steps / 5000) * 100}%` }]} />
          </View>
          <Text style={styles.metricSubtitle}>{steps} / 5,000</Text>
        </View>

        <View style={styles.metricSection}>
          <Text style={styles.metricTitle}>Số km đã đi</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${(distance / 5) * 100}%` }]} />
          </View>
          <Text style={styles.metricSubtitle}>{distance} / 5 km</Text>
        </View>

        <View style={styles.metricSection}>
          <Text style={styles.metricTitle}>Số calo giảm</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${(calories / 300) * 100}%` }]} />
          </View>
          <Text style={styles.metricSubtitle}>{calories} / 300 cal</Text>
        </View>

        <View style={styles.metricSection}>
          <Text style={styles.metricTitle}>Thời gian vận động</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${(distance / 5) * 100}%` }]} />
          </View>
          <Text style={styles.metricSubtitle}>{`${hours}h ${minutes}m ${seconds}s`} / 60 min</Text>
        </View>

        <View style={styles.resetButtonContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={resetAll}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.playlistSection}>
          <View style={styles.playlistItem}>
            <ImageBackground
              source={{ uri: 'https://cdn.usegalileo.ai/sdxl10/4fe69cc9-83ae-4dba-af7c-e68719190061.png' }}
              style={styles.playlistImage}
            />
            <View style={styles.playlistTextContainer}>
              <Text style={styles.playlistTitle}>Hãy Trao Cho Anh</Text>
              <Text style={styles.playlistSubtitle}>Sơn Tùng MTP</Text>
            </View>
            <TouchableOpacity style={styles.playButton} onPress={toggleCounting}>
              <Icon name={isRunning ? "pause-circle" : "play-circle"} size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '50%' }]} />
              <View style={styles.progressThumb} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>1:17</Text>
              <Text style={styles.progressLabel}>2:23</Text>
            </View>
          </View>
        </View>




      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    color: '#111418',
  },
  metricSection: {
    padding: 16,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111418',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#dce0e5',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#111418',
  },
  metricSubtitle: {
    fontSize: 14,
    color: '#637588',
  },
  resetButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resetButton: {
    backgroundColor: '#f0f2f4',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111418',
  },
  playlistSection: {
    padding: 16,
    backgroundColor: '#f0f2f4',
    borderRadius: 10,
    marginHorizontal: 16,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  playlistImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  playlistTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111418',
  },
  playlistSubtitle: {
    fontSize: 14,
    color: '#637588',
  },
  playButton: {
    backgroundColor: '#5ea5ed',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    paddingTop: 8,
  },
  progressTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 4,
    backgroundColor: '#111418',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#111418',
  },
  progressThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#111418',
    position: 'absolute',
    top: -4,
    left: '50%',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#637588',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f2f4',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 12,
    color: '#111418',
    marginTop: 4,
  },
  inactiveIcon: {
    tintColor: '#637588',
  },
  inactiveText: {
    color: '#637588',
  },
  footerSpacer: {
    height: 20,
    backgroundColor: '#ffffff',
  },
});

export default StepScreen;
