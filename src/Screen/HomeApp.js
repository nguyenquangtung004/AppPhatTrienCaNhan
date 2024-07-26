import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Alert, Dimensions, Text, TouchableOpacity, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import Header from '../comp/Header';
import InitialModal from '../comp/InitialModal';
import ProfileModal from '../comp/ProfileModal';
import Leaderboard from '../comp/Leaderboard';

// Component HomeApp để hiển thị trang chủ của ứng dụng
const HomeApp = ({ navigation }) => {
  const [userImage, setUserImage] = useState(require('../material/image/avatar/user_icon.png')); // Ảnh đại diện người dùng
  const [isInitialModalVisible, setInitialModalVisible] = useState(false); // Trạng thái hiển thị modal ban đầu
  const [isProfileModalVisible, setProfileModalVisible] = useState(false); // Trạng thái hiển thị modal hồ sơ
  const [fullName, setFullName] = useState(''); // Họ và tên người dùng
  const [age, setAge] = useState(''); // Tuổi người dùng
  const [gender, setGender] = useState(''); // Giới tính người dùng
  const [address, setAddress] = useState(''); // Địa chỉ người dùng
  const [phoneNumber, setPhoneNumber] = useState(''); // Số điện thoại người dùng
  const [profileImage, setProfileImage] = useState(null); // Ảnh hồ sơ người dùng
  const [bannerImage, setBannerImage] = useState(null); // Ảnh banner

  // useEffect để kiểm tra hồ sơ người dùng và tải ảnh banner khi component được render
  useEffect(() => {
    const checkUserProfile = async () => {
      const user = auth().currentUser;
      if (user) {
        const userRef = firestore().collection('user').doc(user.uid);
        const doc = await userRef.get();
        if (doc.exists) {
          const profileImageUri = doc.data().profileImage;
          setUserImage(profileImageUri ? { uri: profileImageUri } : require('../material/image/avatar/user_icon.png'));
        } else {
          setInitialModalVisible(true);
        }
      }
    };
    fetchBannerImage();
    checkUserProfile();
  }, []);

  // Hàm mở modal tạo hồ sơ khi modal ban đầu bị đóng
  const handleCreateProfile = () => {
    setInitialModalVisible(false);
    setProfileModalVisible(true);
  };

  // Hàm chọn ảnh từ thư viện ảnh
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

  // Hàm lưu hồ sơ người dùng
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

  // Hàm tải ảnh banner từ Firestore
  const fetchBannerImage = async () => {
    try {
      const bannerRef = firestore().collection('banners').doc('5aUsWibhmSEKChT7180o'); // Sử dụng bannerId của bạn
      const doc = await bannerRef.get();
      if (doc.exists) {
        const data = doc.data();
        if (data && data.url_image) {
          setBannerImage(data.url_image);
        } else {
          console.error('Không tìm thấy trường url_image trong tài liệu');
        }
      } else {
        console.error('Tài liệu không tồn tại');
      }
    } catch (error) {
      console.error('Lỗi khi tải ảnh banner: ', error);
    }
  };

  // Hàm xử lý khi nhấn nút chuyển màn hình
  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <ScrollView style={styles.container}>

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
      <View>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black', marginLeft: 10, marginTop: 10, marginBottom: 10 }}>Bảng Xếp Hạng</Text>
        <View style={{ width: "100%", height: 200, backgroundColor: '#D5F8D5', justifyContent: 'center' }}>
          <Leaderboard />
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black', marginLeft: 10, marginTop: 10, marginBottom: 10 }}>Hoạt Động</Text>
      </View>
      <View style={styles.container_item}>
        <View>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={[styles.button]} onPress={() => handlePress('Music')}>
              <Image source={require('../material/image/item/ty.png')} />
            </TouchableOpacity>
            <Text style={{ fontWeight: 'bold', color: 'black' }}>Thiền Và YoGa</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={[styles.button]} onPress={() => handlePress('Mental')}>
              <Image source={require('../material/image/item/sk.png')} />
            </TouchableOpacity>
            <Text style={{ fontWeight: 'bold', color: 'black' }}>Tinh Thần</Text>
          </View >
        </View>
        <View>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={[styles.button]} onPress={() => handlePress('Screen1')}>
              <Image source={require('../material/image/item/qltt.png')} />
            </TouchableOpacity>
            <Text style={{ fontWeight: 'bold', color: 'black' }}>Sức khỏe</Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={[styles.button]} onPress={() => handlePress('Steps')}>
              <Image source={require('../material/image/item/db.png')} />
            </TouchableOpacity>
            <Text style={{ fontWeight: 'bold', color: 'black' }}>Vận Động</Text>
          </View >
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeApp;

// Định nghĩa các kiểu dáng cho component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  bannerImage: {
    width: Dimensions.get('window').width,
    height: 250,
  },
  container_item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    width: 160,
    height: 160,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#90EE90',
    borderRadius: 10
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 10,
  },
});

// Logs chi tiết:
// Log này sẽ giúp bạn kiểm tra và phát hiện lỗi nếu có.

console.log("Trang chủ HomeApp đã được render.");
// console.log("Hồ sơ người dùng hiện tại: ", { fullName, age, gender, address, phoneNumber, profileImage });
// console.log("Ảnh banner: ", bannerImage);
// console.log("Modal khởi tạo hồ sơ hiển thị: ", isInitialModalVisible);
// console.log("Modal hồ sơ hiển thị: ", isProfileModalVisible);
