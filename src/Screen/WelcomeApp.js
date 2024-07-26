import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import LottieView from 'lottie-react-native'; // Thư viện Lottie dùng để hiển thị các hoạt hình.
import LinearGradient from 'react-native-linear-gradient'; // Thư viện cho hiệu ứng Gradient cho màu nền.
import { useNavigation } from '@react-navigation/native'; // Hook để sử dụng đối tượng navigation trong React Navigation.

const WelcomeApp = () => {
  const navigation = useNavigation(); // Hook để điều hướng giữa các màn hình.
  // useRef để tạo các tham chiếu không đổi giữa các lần render.
  const fadeAnimChao = useRef(new Animated.Value(0)).current; // Khởi tạo giá trị ban đầu cho animation là 0.
  const fadeAnimMung = useRef(new Animated.Value(0)).current; // Tương tự như trên.
  const fadeAnimBan = useRef(new Animated.Value(0)).current; // Tương tự như trên.
  const [randomQuote, setRandomQuote] = useState(''); // State lưu trữ câu trích dẫn ngẫu nhiên.

  const quotes = [ // Mảng các câu trích dẫn.
    "Quote 1",
    "Quote 2",
    "Quote 3",
  ];

  useEffect(() => {
    // Animation cho từng phần của lời chào.
    Animated.timing(
      fadeAnimChao,
      {
        toValue: 1, // Giá trị cuối của animation.
        duration: 1000, // Thời gian diễn ra animation.
        easing: Easing.ease, // Loại easing cho animation.
        useNativeDriver: true, // Sử dụng driver gốc để tối ưu hiệu suất.
      }
    ).start();

    // Các animation tương tự cho các phần khác của lời chào, với độ trễ khác nhau.
    Animated.timing(
      fadeAnimMung,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
        delay: 300, // Độ trễ 300ms.
      }
    ).start();

    Animated.timing(
      fadeAnimBan, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
      delay: 1000 // Độ trễ 1000ms.
    }
    ).start();

    // Chọn ngẫu nhiên một câu trích dẫn từ mảng quotes.
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);

    // Chuyển hướng sang màn hình đăng nhập sau 4 giây.
    const timeout = setTimeout(() => {
      navigation.navigate('Login');
    }, 4000);

    // Dọn dẹp khi component bị hủy.
    return () => clearTimeout(timeout);
  }, []);

  return (
    <LinearGradient colors={['#FFFFFF', '#90EE90']} style={styles.bg_view}>
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
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
          <Animated.Text style={[styles.text_welcome, { opacity: fadeAnimBan }]}>bạn</Animated.Text>
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
    height: '100%' // Thiết lập chiều cao tối đa cho màn hình.
  },
  gif_anim: {
    width: 350, // Chiều rộng của ảnh Lottie.
    height: 350, // Chiều cao của ảnh Lottie.
  },
  text_welcome: {
    fontSize: 30, // Cỡ chữ cho lời chào.
    color: 'black', // Màu chữ.
    fontWeight: 'bold', // Độ đậm của chữ.
    margin: 3 // Khoảng cách giữa các từ.
  },
  text_welcome_container: {
    flexDirection: "row" // Bố cục theo hàng ngang cho các lời chào.
  },
  quoteText: {
    fontSize: 20, // Cỡ chữ cho câu trích dẫn.
    fontWeight: "bold" // Độ đậm của chữ.
  },
  text_quote_container: {
    alignItems: 'center', // Căn giữa theo trục ngang.
    marginBottom: 50 // Khoảng cách lề dưới.
  }
});

// Logs chi tiết:
// Log này sẽ giúp bạn kiểm tra và phát hiện lỗi nếu có.

console.log("Animation 'Chào' đã bắt đầu chạy");
console.log("Animation 'Mừng' đã bắt đầu chạy với độ trễ 300ms");
console.log("Animation 'Bạn' đã bắt đầu chạy với độ trễ 1000ms");
// console.log("Câu trích dẫn ngẫu nhiên được chọn: ", randomQuote);
console.log("Chuyển hướng sang màn hình 'Login' sau 4 giây");
