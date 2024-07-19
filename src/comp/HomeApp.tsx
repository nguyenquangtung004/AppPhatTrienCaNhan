import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput, Alert, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const HomeApp = () => {
  const [userImage, setUserImage] = useState(require('../material/image/avatar/user_icon.png'));
  const [isInitialModalVisible, setInitialModalVisible] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  useEffect(() => {
    const checkUserProfile = async () => {
      const user = auth().currentUser;
      if (user) {
        const userRef = firestore().collection('user').doc(user.uid);
        const doc = await userRef.get();
        if (doc.exists) {
          setUserImage({ uri: doc.data().profileImage } || require('../material/image/avatar/user_icon.png'));
        } else {
          setInitialModalVisible(true);
        }
      }
    };
    fetchBannerImage();
    checkUserProfile();
  }, []);

  const handleCreateProfile = () => {
    setInitialModalVisible(false);
    setProfileModalVisible(true);
  };

  const handleSelectImage = () => {
    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('Người dùng hủy chọn ảnh');
      } else if (response.errorCode) {
        console.log('Lỗi chọn ảnh: ', response.errorMessage);
      } else {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const handleSaveProfile = () => {
    if (!fullName || !age || !gender || !address) {
      Alert.alert('Lỗi', 'Vui lòng điền tất cả các trường');
      return;
    }

    const user = auth().currentUser;
    const userRef = firestore().collection('user').doc(user.uid);

    userRef.set({
      fullName,
      age,
      gender,
      address,
      phoneNumber,
      profileImage,
    })
    .then(() => {
      Alert.alert('Thông báo', 'Hồ sơ đã được tạo thành công');
      setProfileModalVisible(false);
      setUserImage(profileImage ? { uri: profileImage } : require('../material/image/avatar/user_icon.png'));
    })
    .catch(error => {
      Alert.alert('Lỗi', 'Không thể lưu hồ sơ: ' + error.message);
    });
  };

  const fetchBannerImage = async () => {
    try {
      const bannerRef = firestore().collection('banners').doc('5aUsWibhmSEKChT7180o'); // Sử dụng bannerId của bạn
      const doc = await bannerRef.get();
      if (doc.exists) {
        const data = doc.data();
        if (data && data.url_image) {
          setBannerImage(data.url_image);
        } else {
          console.error('No url_image field found in the document');
        }
      } else {
        console.error('Document does not exist');
      }
    } catch (error) {
      console.error('Error fetching banner image: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon}>
          <Icon name="bars" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Trang Chủ</Text>
        <Image source={userImage} style={styles.avatar} />
      </View>
      {bannerImage && (
        <Image source={{ uri: bannerImage }} style={styles.bannerImage} />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isInitialModalVisible}
        onRequestClose={() => setInitialModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LottieView
              source={require('../material/animation/happy.json')}
              autoPlay
              loop
              style={styles.modalAnimation}
            />
            <Text style={styles.modalText}>Bạn là người dùng mới</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCreateProfile}
            >
              <Text style={styles.closeButtonText}>Tạo Hồ Sơ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isProfileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tạo Hồ Sơ</Text>
            <TextInput
              placeholder='Họ và Tên'
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
            />
            <TextInput
              placeholder='Tuổi'
              value={age}
              onChangeText={setAge}
              keyboardType='numeric'
              style={styles.input}
            />
            <TextInput
              placeholder='Giới Tính'
              value={gender}
              onChangeText={setGender}
              style={styles.input}
            />
            <TextInput
              placeholder='Nơi ở hiện tại'
              value={address}
              onChangeText={setAddress}
              style={styles.input}
            />
            <TextInput
              placeholder='Số điện thoại (tuỳ chọn)'
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType='numeric'
              style={styles.input}
            />
            <TouchableOpacity onPress={handleSelectImage} style={styles.selectImageButton}>
              <Text style={styles.selectImageButtonText}>Chọn Ảnh</Text>
            </TouchableOpacity>
            {profileImage && (
              <Image source={{ uri: profileImage }} style={styles.selectedImage} />
            )}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Xác Nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#D5F8D5',
    elevation: 2,
  },
  menuIcon: {
    padding: 10,
  },
  bannerImage: {
    width: Dimensions.get('window').width,
    height: 250,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
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
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  selectImageButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  selectImageButtonText: {
    color: 'white',
    fontSize: 16,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
