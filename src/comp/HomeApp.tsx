// HomeApp.js
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Alert, Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import Header from './Header';
import InitialModal from './InitialModal';
import ProfileModal from './ProfileModal';

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
      <Header userImage={userImage} />
      {bannerImage && (
        <Image source={{ uri: bannerImage }} style={styles.bannerImage} />
      )}
      <InitialModal isVisible={isInitialModalVisible} onClose={handleCreateProfile} />
      <ProfileModal
        isVisible={isProfileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        fullName={fullName}
        setFullName={setFullName}
        age={age}
        setAge={setAge}
        gender={gender}
        setGender={setGender}
        address={address}
        setAddress={setAddress}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        profileImage={profileImage}
        handleSelectImage={handleSelectImage}
        handleSaveProfile={handleSaveProfile}
      />
    </View>
  );
};

export default HomeApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  bannerImage: {
    width: Dimensions.get('window').width,
    height: 250,
  },
});
