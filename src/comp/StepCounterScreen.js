import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import Header from '../comp/Header';

const StepScreen = ({ navigation }) => {
  const [steps, setSteps] = useState(250);
  const [speed, setSpeed] = useState(5.0);

  return (
    <LinearGradient colors={['#E0F7FA', '#E0F7FA']} style={styles.container}>
      <Header
        title="Quản lý vận động"
        navigation={navigation}
      />
      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.playButtonContainer}>
          <Icon name="play-circle" size={150} color="#4CAF50" />
        </TouchableOpacity>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Bước chân : {steps}</Text>
          <Text style={styles.statsText}>Khoảng cách di chuyển : {speed.toFixed(2)} km/h</Text>
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
