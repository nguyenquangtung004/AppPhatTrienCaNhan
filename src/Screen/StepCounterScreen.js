import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, FlatList, ImageBackground, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sound from 'react-native-sound';
import firestore from '@react-native-firebase/firestore';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { map, filter, debounceTime } from 'rxjs/operators';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../comp/Header'; // Thêm phần nhập khẩu cho Header

const STEP_LENGTH_KM = 0.000762; // Chiều dài trung bình của một bước chân
const CALORIES_PER_STEP = 0.04; // Calo tiêu thụ mỗi bước

const App = () => {
  const [steps, setSteps] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [musicList, setMusicList] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    requestActivityRecognitionPermission();
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      if (currentTrack) {
        currentTrack.release();
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

  useEffect(() => {
    const fetchMusic = async () => {
      const musicCollection = await firestore().collection('music').get();
      const musicData = musicCollection.docs.map(doc => doc.data());
      setMusicList(musicData);
    };

    fetchMusic();
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
    if (currentTrack) {
      currentTrack.stop(() => {
        setCurrentTrack(null);
        setIsPlaying(false);
      });
    }
  };

  const toggleCounting = () => {
    if (isRunning) {
      stopCounting();
    } else {
      startCounting();
    }
  };

  const togglePlayback = () => {
    if (currentTrack) {
      if (isPlaying) {
        console.log('Tạm dừng track hiện tại');
        currentTrack.pause();
        setIsPlaying(false);
      } else {
        console.log('Phát lại track hiện tại');
        currentTrack.play(() => {
          console.log('Hoàn thành phát track hiện tại');
          setIsPlaying(false);
          currentTrack.release();
        });
        setIsPlaying(true);
      }
    } else {
      playTrack(currentIndex);
    }
  };

  const playTrack = (index) => {
    if (currentTrack) {
      currentTrack.stop(() => {
        loadAndPlayTrack(index);
      });
    } else {
      loadAndPlayTrack(index);
    }
  };

  const loadAndPlayTrack = (index) => {
    const track = new Sound(musicList[index].song_link, null, (error) => {
      if (error) {
        console.log('Lỗi khi tải track:', error);
        return;
      }
      console.log('Track đã được tải thành công');
      setCurrentTrack(track);
      setCurrentIndex(index);
      track.play(() => {
        console.log('Hoàn thành phát track');
        setIsPlaying(false);
        track.release();
      });
      setIsPlaying(true);
    });
  };

  const handleNextTrack = () => {
    const nextIndex = (currentIndex + 1) % musicList.length;
    playTrack(nextIndex);
  };

  const handlePrevTrack = () => {
    const prevIndex = (currentIndex - 1 + musicList.length) % musicList.length;
    playTrack(prevIndex);
  };

  const handleFastForward = () => {
    if (currentTrack) {
      currentTrack.getCurrentTime((seconds) => {
        currentTrack.setCurrentTime(Math.min(seconds + 10, currentTrack.getDuration()));
      });
    }
  };

  const handleRewind = () => {
    if (currentTrack) {
      currentTrack.getCurrentTime((seconds) => {
        currentTrack.setCurrentTime(Math.max(seconds - 10, 0));
      });
    }
  };

  const distance = (steps * STEP_LENGTH_KM).toFixed(2);
  const calories = (steps * CALORIES_PER_STEP).toFixed(2);
  const hours = Math.floor(elapsedTime / 3600000);
  const minutes = Math.floor((elapsedTime % 3600000) / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => playTrack(index)}>
      <View style={styles.playlistItem}>
        <ImageBackground
          source={{ uri: item.picture }}
          style={styles.playlistImage}
        >
          {currentIndex === index && isPlaying && (
            <LinearGradient
              colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.5)']}
              style={styles.playingOverlay}
            />
          )}
        </ImageBackground>
        <View style={styles.playlistTextContainer}>
          <Text style={styles.playlistTitle}>{item.name_song}</Text>
          <Text style={styles.playlistSubtitle}>{item.singer_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>

      <View style={styles.metricContainer}>
        <View style={styles.metric}>
          <Image source={require('../material/image/item/steps.png')} style={styles.icon} />
          <View style={styles.metricInfo}>
            <Text style={styles.metricTitle}>Steps</Text>
            <Text style={styles.metricSubtitle}>{steps} / 10,000</Text>
          </View>
          <Text style={styles.metricValue}>{steps}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${(steps / 10000) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.metricContainer}>
        <View style={styles.metric}>
          <Image source={require('../material/image/item/qd.png')} style={styles.icon} />
          <View style={styles.metricInfo}>
            <Text style={styles.metricTitle}>Distance</Text>
            <Text style={styles.metricSubtitle}>{distance} / 5 km</Text>
          </View>
          <Text style={styles.metricValue}>{distance} km</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${(distance / 5) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.metricContainer}>
        <View style={styles.metric}>
          <Image source={require('../material/image/item/calo.png')} style={styles.icon} />
          <View style={styles.metricInfo}>
            <Text style={styles.metricTitle}>Calories</Text>
            <Text style={styles.metricSubtitle}>{calories} / 300 cal</Text>
          </View>
          <Text style={styles.metricValue}>{calories}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${(calories / 300) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.metricContainer}>
        <View style={styles.metric}>
          <Image source={require('../material/image/item/time.png')} style={styles.icon} />
          <View style={styles.metricInfo}>
            <Text style={styles.metricTitle}>Active Time</Text>
            <Text style={styles.metricSubtitle}>{`${hours}h ${minutes}m ${seconds}s`} / 60 min</Text>
          </View>
          <Text style={styles.metricValue}>{elapsedTime}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${(elapsedTime / 3600000) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetAll}>
          <Text style={styles.buttonText}>Reset All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton} onPress={toggleCounting}>
          <Text style={styles.buttonText}>{isRunning ? 'Dừng Lại' : 'Bắt Đầu'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={musicList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.playlistSection}
        initialNumToRender={2}
      />

      <View style={styles.controlButtonsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={handlePrevTrack}>
          <Icon name="backward" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleRewind}>
          <Icon name="fast-backward" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={togglePlayback}>
          <Icon name={isPlaying ? "pause" : "play"} size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleFastForward}>
          <Icon name="fast-forward" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleNextTrack}>
          <Icon name="forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  metricContainer: {
    marginBottom: 16,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: 24,
    height: 24,
  },
  metricInfo: {
    flex: 1,
    marginLeft: 16,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111418',
  },
  metricSubtitle: {
    fontSize: 14,
    color: '#637588',
  },
  metricValue: {
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
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#111418',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#f0f2f4',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    flex: 1,
    marginRight: 8,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111418',
  },
  musicContainer: {
    marginBottom: 16,
  },
  musicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  musicTitle: {
    fontSize: 16,
    color: '#111418',
  },
  playButton: {
    backgroundColor: '#f0f2f4',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  playButtonText: {
    fontSize: 14,
    color: '#111418',
  },
  nowPlaying: {
    backgroundColor: '#f0f2f4',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  nowPlayingImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  nowPlayingInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nowPlayingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111418',
  },
  nowPlayingSubtitle: {
    fontSize: 14,
    color: '#637588',
  },
  nowPlayingPlayButton: {
    backgroundColor: '#5ea5ed',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#111418',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#111418',
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
  playingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  controlButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  controlButton: {
    backgroundColor: '#5ea5ed',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
