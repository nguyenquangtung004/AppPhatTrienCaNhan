import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import firestore from '@react-native-firebase/firestore';
import CustomTextInput from '../comp/CustomTextInput';
import CustomButton from '../comp/CustomButton';
import CustomModal from '../comp/CustomModal';

const LoginApp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordSecure, setPasswordSecure] = useState(true);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isButtonHoveredRight, setIsButtonHoveredRight] = useState(false);
  const [isButtonHoveredLeft, setIsButtonHoveredLeft] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation();

  const handleRememberPassword = () => {
    setRememberPassword(!rememberPassword);
  };

  const handleLogin = () => {
    let hasError = false;

    if (!username) {
      setUsernameError('Vui lòng nhập tài khoản');
      hasError = true;
    } else {
      setUsernameError('');
    }

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) {
      return;
    }

    auth()
      .signInWithEmailAndPassword(username, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log("Đăng nhập thành công với UID:", user.uid);

        // Lấy dữ liệu người dùng từ Firestore
        try {
          const userDoc = await firestore()
            .collection('accounts')
            .doc(user.uid)
            .get();

          if (userDoc.exists) {
            console.log("Dữ liệu người dùng:", userDoc.data());
            navigation.navigate('Home');
          } else {
            console.log("Tài khoản không tồn tại trong Firestore");
            setModalVisible(true);
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu người dùng:", error.message);
          setModalVisible(true);
        }
      })
      .catch((error) => {
        console.error("Lỗi đăng nhập:", error.message);
        setModalVisible(true);
      });
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <LinearGradient colors={['#ffffff', '#90EE90']} style={{ height: "100%" }}>
      <View style={styles.view_1}>
        <Text style={styles.title}>Đăng Nhập</Text>
        <Text style={styles.subtitle}>Điều khoản và chính sách</Text>
      </View>

      <View style={styles.inputContainer}>
        <CustomTextInput
          iconName="user"
          placeholder="Nhập tài khoản"
          value={username}
          onChangeText={setUsername}
          style={styles.textInput}
        />
        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
        <CustomTextInput
          iconName="lock"
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={passwordSecure}
          onToggleSecureEntry={() => setPasswordSecure(!passwordSecure)}
          style={styles.textInput}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>

      <View style={styles.view_2}>
        <View style={styles.rememberContainer}>
          <TouchableOpacity
            style={[styles.checkbox, rememberPassword && styles.checkedCheckbox]}
            onPress={handleRememberPassword}
          >
            {rememberPassword && <View style={styles.checkMark} />}
          </TouchableOpacity>
          <Text style={styles.text_function}>Ghi nhớ mật khẩu</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.text_function}>Quên mật khẩu</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.view_button_container}>
        <CustomButton
          text="Đăng Kí"
          onPress={handleRegister}
          onHoverStart={() => setIsButtonHoveredLeft(true)}
          onHoverEnd={() => setIsButtonHoveredLeft(false)}
          style={[styles.button_register, isButtonHoveredLeft && styles.buttonHoverLeft]}
        />
        <CustomButton
          text="Đăng Nhập"
          onPress={handleLogin}
          onHoverStart={() => setIsButtonHoveredRight(true)}
          onHoverEnd={() => setIsButtonHoveredRight(false)}
          style={[styles.button_login, isButtonHoveredRight && styles.buttonHoverRight]}
        />
      </View>

      <View style={styles.view_social_container}>
        <Text style={styles.socialTitle}>Đăng nhập với</Text>
        <View style={styles.socialIconsContainer}>
          <TouchableOpacity onPress={() => { }}>
            <Image
              source={require('../material/image/soical/facebook.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }}>
            <Image
              source={require('../material/image/soical/google.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }}>
            <Image
              source={require('../material/image/soical/threads.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(!modalVisible)}
      />
    </LinearGradient>
  );
};

export default LoginApp;

const styles = StyleSheet.create({
  view_1: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: "black",
  },
  subtitle: {
    color: '#0DFF7D',
    fontSize: 18,
    marginTop: 5,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginHorizontal: 20,
    marginTop: 50,
  },
  textInput: {
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginLeft: 20,
    marginBottom: 10,
  },
  view_2: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: 'black',
  },
  checkMark: {
    width: 10,
    height: 10,
    backgroundColor: 'white',
  },
  text_function: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  view_button_container: {
    flexDirection: 'row',
    height: 80,
    marginTop: 30,
    justifyContent: 'center',
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
    margin: 10,
    height: 50,
    borderRadius: 10,
  },
  button_login: {
    backgroundColor: "#0DFF7D",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    margin: 10,
    height: 50,
    borderRadius: 10,
  },
  view_social_container: {
    alignItems: 'center',
    marginTop: 40,
  },
  socialTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: 'black',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  socialIcon: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
});
