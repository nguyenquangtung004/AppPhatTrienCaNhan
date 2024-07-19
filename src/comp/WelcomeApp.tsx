import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const WelcomeApp = () => {
  const navigation = useNavigation();
  const fadeAnimChao = useRef(new Animated.Value(0)).current;
  const fadeAnimMung = useRef(new Animated.Value(0)).current;
  const fadeAnimBan = useRef(new Animated.Value(0)).current;
  const [randomQuote, setRandomQuote] = useState('');

  const quotes = [
    "Quote 1",
    "Quote 2",
    "Quote 3",
  ];

  useEffect(() => {
    Animated.timing(
      fadeAnimChao,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }
    ).start();

    Animated.timing(
      fadeAnimMung,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
        delay: 300,
      }
    ).start();

    Animated.timing(
      fadeAnimBan,{
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
        delay: 1000
      }
    ).start();

    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);

    const timeout = setTimeout(() => {
      navigation.navigate('Login');
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <LinearGradient colors={['#FFFFFF', '#90EE90']} style={styles.bg_view}>
      <View style={{justifyContent:'center', alignItems:'center',flex:1}}>
        <LottieView
          source={require('../material/animation/AnimWelcome.json')}
          autoPlay
          loop
          speed={0.5}
          style={styles.gif_anim}
        />    
         <View style={styles.text_welcome_container}>
        <Animated.Text style={[styles.text_welcome, { opacity: fadeAnimChao }]}>Chào</Animated.Text>
        <Animated.Text style={[styles.text_welcome, { opacity: fadeAnimMung }]}>mừng</Animated.Text>
        <Animated.Text style={[styles.text_welcome, { opacity: fadeAnimMung }]}>bạn</Animated.Text>
      </View>
      </View> 
     
      <View style={styles.text_quote_container}>
        <Text style={styles.quoteText}>{randomQuote}</Text>
      </View>
    </LinearGradient>
  )
}

export default WelcomeApp

const styles = StyleSheet.create({
  bg_view: {
    height: '100%'
  },
  gif_anim: {
    width: 350,
    height: 350,
  },
  text_welcome: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    margin: 3
  },
  text_welcome_container: {
    flexDirection: "row"
  },
  quoteText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  text_quote_container: {
    alignItems: 'center',
    marginBottom: 50
  }
});
