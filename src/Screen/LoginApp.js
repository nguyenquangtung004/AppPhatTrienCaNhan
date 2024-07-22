import { Alert, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
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
    <LinearGradient colors={['#FFFFFF', '#90EE90']} style={{ height: "100%" }}>
      <View style={styles.view_1}>
        <Text style={{ fontSize: 35, fontWeight: 'bold', color: "black", marginTop: 80 }}>Đăng Nhập</Text>
        <Text style={{ color: '#0DFF7D', fontSize: 30, marginTop: 5, fontWeight: 'bold' }}>Điều khoản và chính sách</Text>
      </View>

      <View style={{ marginLeft: 20, marginRight: 20, marginTop: 80 }}>
        <CustomTextInput
          iconName="user"
          placeholder="Nhập tài khoản"
          value={username}
          onChangeText={setUsername}
          style={{ marginBottom: 30 }} // Thêm khoảng cách giữa tài khoản và mật khẩu
        />
        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
        <CustomTextInput
          iconName="lock"
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={passwordSecure}
          onToggleSecureEntry={() => setPasswordSecure(!passwordSecure)}
          style={{ marginBottom: 5 }} // Thêm khoảng cách giữa tài khoản và mật khẩu
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>

      <View style={styles.view_2}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={[styles.checkbox, rememberPassword && styles.checkedCheckbox]}
            onPress={handleRememberPassword}
          >
            {rememberPassword && <View style={styles.checkMark} />}
          </TouchableOpacity>
          <Text style={styles.text_function}>Ghi nhớ mật khẩu</Text>
        </View>
        <View>
          <Text style={styles.text_function}>Quên mật khẩu</Text>
        </View>
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
        <Text style={{ fontSize: 30, fontWeight: "bold", color: 'black' }}>Đăng nhập với</Text>
        <View style={{ flexDirection: 'row', marginTop: 30 }}>
          <TouchableOpacity onPress={() => {}}>
            <Image
              source={require('../material/image/soical/facebook.png')}
              style={{ width: 70, height: 70, marginRight: 20 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Image
              source={require('../material/image/soical/google.png')}
              style={{ width: 70, height: 70, marginRight: 20 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Image
              source={require('../material/image/soical/threads.png')}
              style={{ width: 70, height: 70 }}
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
    justifyContent: "center"
  },
  view_2: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20
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
    fontSize: 25,
    color: "black",
    fontWeight: "bold",
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
  view_social_container: {
    alignItems: 'center',
    marginTop: 40
  },
  errorText: {
    color: 'red',
    marginLeft: 20,
    marginBottom: 10,
  },
});
