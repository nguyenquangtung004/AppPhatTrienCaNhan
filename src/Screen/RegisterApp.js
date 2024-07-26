import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import InputField from '../comp/InputField';
import AuthButtons from '../comp/AuthButtons';
import SuccessModal from '../comp/SuccessModal';
import { auth } from '../firebaseConfig';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const RegisterApp = () => {
  const navigation = useNavigation(); // Hook để điều hướng giữa các màn hình.
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(true);

  // Hàm kiểm tra đầu vào
  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!username) {
      setUsernameError('Vui lòng nhập tài khoản');
      return false;
    }
    if (username.length < 3) {
      setUsernameError('Tài khoản phải có ít nhất 3 ký tự');
      return false;
    }

    if (!email) {
      setEmailError('Vui lòng nhập email');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Email không hợp lệ');
      return false;
    }

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      return false;
    }
    if (!passwordRegex.test(password)) {
      setPasswordError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
      return false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Vui lòng nhập lại mật khẩu');
      return false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu không khớp');
      return false;
    }

    return true;
  };

  // Hàm xử lý đăng ký
  const handleRegister = () => {
    clearErrors();
    if (validateInputs()) {
      auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          firestore().collection('accounts').doc(user.uid).set({
            username, email, password, account_id: user.uid
          }).then(() => {
            setShowSuccessModal(true);
            setTimeout(() => {
              setShowSuccessModal(false);
              navigation.navigate('Login');
            }, 3000);
          }).catch(error => {
            Alert.alert('Lỗi', 'Không thể lưu thông tin vào Firestore: ' + error.message);
          });
        }).catch(error => {
          Alert.alert('Lỗi đăng ký', error.message);
        });
    }
  };

  // Hàm xóa các lỗi hiện tại
  const clearErrors = () => {
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
  };

  // Hàm thay đổi trạng thái hiển thị mật khẩu
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  // Hàm thay đổi trạng thái hiển thị mật khẩu xác nhận
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#90EE90']} style={styles.container}>
      <View style={styles.view_container}>
        <View style={styles.view_title}>
          <Text style={styles.title}>Đăng Kí</Text>
        </View>
        <InputField
          iconName="user"
          placeholder="Tài khoản"
          value={username}
          onChangeText={setUsername}
          secureTextEntry={false}
          error={usernameError}
        />
        <InputField
          iconName="envelope"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          secureTextEntry={false}
          error={emailError}
        />
        <InputField
          iconName="lock"
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={passwordVisibility}
          onTogglePasswordVisibility={togglePasswordVisibility}
          error={passwordError}
        />
        <InputField
          iconName="lock"
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={confirmPasswordVisibility}
          onTogglePasswordVisibility={toggleConfirmPasswordVisibility}
          error={confirmPasswordError}
        />

        <AuthButtons onRegister={handleRegister} onNavigateLogin={() => navigation.navigate('Login')} />

        <SuccessModal visible={showSuccessModal} onDismiss={() => setShowSuccessModal(false)} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view_container: {
    margin: 20
  },
  view_title: {
    alignItems: 'center',
    margin: 30
  },
  title: {
    color: "black",
    fontSize: 30,
    fontWeight: 'bold'
  }
});

export default RegisterApp;

// Logs chi tiết:
// Log này sẽ giúp bạn kiểm tra và phát hiện lỗi nếu có.

console.log("Bắt đầu quá trình đăng ký người dùng.");
// console.log("Tên tài khoản: ", username);
// console.log("Email: ", email);
// console.log("Mật khẩu: ", password);
// console.log("Xác nhận mật khẩu: ", confirmPassword);
// console.log("Modal thành công hiển thị: ", showSuccessModal);
