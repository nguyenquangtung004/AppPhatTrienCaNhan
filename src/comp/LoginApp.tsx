import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig'; // Cấu hình Firebase
import firestore from '@react-native-firebase/firestore';

const LoginApp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordSecure, setPasswordSecure] = useState(true);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isButtonHoveredRight, setIsButtonHoveredRight] = useState(false);
  const [isButtonHoveredLeft, setIsButtonHoveredLeft] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleRememberPassword = () => {
    setRememberPassword(!rememberPassword);
  };

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tài khoản và mật khẩu');
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
            .collection('accounts') // Sử dụng tên collection là 'accounts'
            .doc(user.uid)
            .get();
  
          if (userDoc.exists) {
            console.log("Dữ liệu người dùng:", userDoc.data());
            navigation.navigate('Home');
          } else {
            console.log("Tài khoản không tồn tại trong Firestore");
            Alert.alert('Lỗi', 'Tài khoản không tồn tại trong Firestore');
            setModalVisible(true); // Hiển thị modal nếu tài khoản không tồn tại
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu người dùng:", error.message);
          Alert.alert('Lỗi', 'Không thể lấy dữ liệu người dùng: ' + error.message);
          setModalVisible(true); // Hiển thị modal nếu có lỗi
        }
      })
      .catch((error) => {
        console.error("Lỗi đăng nhập:", error.message);
        Alert.alert('Lỗi', 'Thông tin đăng nhập không hợp lệ hoặc đã hết hạn.');
        setModalVisible(true); // Hiển thị modal nếu lỗi đăng nhập
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
        <TouchableOpacity
          style={[styles.button_register, isButtonHoveredLeft && styles.buttonHoverLeft]}
          onPressIn={() => setIsButtonHoveredLeft(true)}
          onPressOut={() => setIsButtonHoveredLeft(false)}
          onPress={handleRegister} 
        >
          <Text style={styles.text_button}>Đăng Kí</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button_login, isButtonHoveredRight && styles.buttonHoverRight]}
          onPressIn={() => setIsButtonHoveredRight(true)}
          onPressOut={() => setIsButtonHoveredRight(false)}
          onPress={handleLogin} 
        >
          <Text style={styles.text_button}>Đăng Nhập</Text>
        </TouchableOpacity>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LottieView
              source={require('../material/animation/not_found.json')}
              autoPlay
              loop
              style={styles.modalAnimation}
            />
            <Text style={styles.modalText}>Tài khoản không tồn tại</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

export default LoginApp;



const styles = StyleSheet.create({
  view_1: {
    alignItems: "center",
    justifyContent: "center"
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
  text_button: {
    fontSize: 30,
    color: "black",
    fontWeight: 'bold'
  },
  view_social_container: {
    alignItems: 'center',
    marginTop: 40
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
  },
  modalAnimation: {
    width: 150,
    height: 150,
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#0DFF7D',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  }
});
