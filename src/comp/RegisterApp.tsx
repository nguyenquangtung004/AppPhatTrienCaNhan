import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from '../firebaseConfig'; // Import cấu hình Firebase
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const RegisterApp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSecure, setPasswordSecure] = useState(true);
  const [isButtonHoveredRight, setIsButtonHoveredRight] = useState(false);
  const [isButtonHoveredLeft, setIsButtonHoveredLeft] = useState(false);
  const navigation = useNavigation();

  // Hàm kiểm tra các trường nhập liệu
  const validateInputs = () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ tất cả các trường');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mật khẩu không khớp', 'Vui lòng kiểm tra lại mật khẩu');
      return false;
    }
    return true;
  };

  // Hàm xử lý đăng ký
  const handleRegister = () => {
    if (!validateInputs()) {
      return;
    }

    console.log("Bắt đầu quá trình đăng ký");

    // Tạo người dùng với email và mật khẩu
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Tạo tài khoản thành công:", user.uid);

        // Lưu dữ liệu vào Firestore
        firestore()
          .collection('accounts') // Sử dụng tên collection mới
          .doc(user.uid)
          .set({
            password:password,
            username: username,
            email: email,
            account_id: user.uid // Thay đổi thành account_id
          })
          .then(() => {
            console.log("Đã lưu dữ liệu vào Firestore cho người dùng:", user.uid);
            Alert.alert('Đăng ký thành công', 'Tài khoản đã được tạo');
            navigation.navigate('Login');
          })
          .catch((error) => {
            console.error("Lỗi khi lưu dữ liệu vào Firestore:", error.message);
            Alert.alert('Lỗi', 'Không thể lưu thông tin vào Firestore: ' + error.message);
          });
      })
      .catch((error) => {
        console.error("Lỗi khi tạo tài khoản:", error.message);
        Alert.alert('Lỗi đăng ký', error.message);
      });
  };

  // Hàm trở về màn hình đăng nhập
  const handleLogin = () => {
    navigation.navigate('Login'); // Điều chỉnh để điều hướng đến màn hình đăng nhập nếu cần
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#90EE90']} style={styles.container}>
      <View style={styles.view_1}>
        <Text style={styles.text_header}>Đăng Kí</Text>
      </View>

      <View style={{ marginLeft: 20, marginRight: 20, marginTop: 80 }}>
        <View>
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>Tài Khoản :</Text>
          <View style={styles.inputContainer}>
            <Icon name="user" size={40} color="black" style={styles.inputIcon} />
            <TextInput
              placeholder='Nhập tài khoản'
              style={styles.text_input}
              value={username}
              onChangeText={setUsername}
            />
          </View>
        </View>
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>Email :</Text>
          <View style={styles.inputContainer}>
            <Icon name="envelope" size={40} color="black" style={styles.inputIcon} />
            <TextInput
              placeholder='Nhập email'
              style={styles.text_input}
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>Mật Khẩu :</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={40} color="black" style={styles.inputIcon} />
            <TextInput
              secureTextEntry={passwordSecure}
              placeholder='Nhập mật khẩu'
              style={styles.text_input}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordSecure(!passwordSecure)} style={{ position: 'absolute', right: 10 }}>
              <Icon name={passwordSecure ? 'eye-slash' : 'eye'} size={40} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>Mật Khẩu Nhập Lại :</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={40} color="black" style={styles.inputIcon} />
            <TextInput
              secureTextEntry={passwordSecure}
              placeholder='Nhập mật khẩu lại'
              style={styles.text_input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setPasswordSecure(!passwordSecure)} style={{ position: 'absolute', right: 10 }}>
              <Icon name={passwordSecure ? 'eye-slash' : 'eye'} size={40} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.view_button_container}>
        <TouchableOpacity
          style={[styles.button_register, isButtonHoveredLeft && styles.buttonHoverLeft]}
          onPressIn={() => setIsButtonHoveredLeft(true)}
          onPressOut={() => setIsButtonHoveredLeft(false)}
          onPress={handleLogin}
        >
          <Text style={styles.text_button}>Trở Về</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button_login, isButtonHoveredRight && styles.buttonHoverRight]}
          onPressIn={() => setIsButtonHoveredRight(true)}
          onPressOut={() => setIsButtonHoveredRight(false)}
          onPress={handleRegister}
        >
          <Text style={styles.text_button}>Đăng Kí</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

export default RegisterApp;

const styles = StyleSheet.create({
  container: {
    height: "100%"
  },
  view_1: {
    alignItems: "center",
    justifyContent: "center"
  },
  text_header: {
    fontSize: 35,
    fontWeight: 'bold',
    color: "black",
    marginTop: 80
  },
  text_input: {
    borderBottomWidth: 1,
    backgroundColor: 'white',
    height: 80,
    fontSize: 20,
    borderRadius: 10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    backgroundColor: 'white',
    height: 80,
    fontSize: 20,
    borderRadius: 10
  },
  inputIcon: {
    marginRight: 10,
    marginLeft: 10
  },
  view_button_container: {
    flexDirection: 'row',
    height: 80,
    marginTop: 10
  },
  buttonHoverLeft: {
    backgroundColor: '#DE6B00',
  },
  buttonHoverRight: {
    backgroundColor: '#DE6B00',
  },
  button_register: {
    backgroundColor: "#0DFF7D",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    margin: 20,
    height: 80,
    borderRadius: 10
  },
  button_login: {
    backgroundColor: "#0DFF7D",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    margin: 20,
    height: 80,
    borderRadius: 10
  },
  text_button: {
    fontSize: 30,
    color: "black",
    fontWeight: 'bold'
  },
});
