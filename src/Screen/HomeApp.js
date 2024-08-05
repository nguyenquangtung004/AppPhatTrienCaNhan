import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Alert, Dimensions, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import Header from '../comp/Header';
import InitialModal from '../comp/InitialModal';
import ProfileModal from '../comp/ProfileModal';
import Leaderboard from '../comp/Leaderboard';
import InputField from '../comp/InputField'; // Giả định rằng bạn đã tạo component InputField

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
  const [refreshing, setRefreshing] = useState(false); // Trạng thái làm mới

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
        console.log('Ảnh hồ sơ đã chọn: ', response.assets[0].uri);
      }
    });
  };

  // Hàm xác thực các đầu vào
  const validateInputs = () => {
    const errors = {};

    if (!fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên';
    } else if (fullName.trim().length < 3) {
      errors.fullName = 'Họ và tên phải có ít nhất 3 ký tự';
    }

    if (!age.trim()) {
      errors.age = 'Vui lòng nhập tuổi';
    } else if (isNaN(age) || age <= 0) {
      errors.age = 'Tuổi phải là một số dương';
    }

    if (!gender.trim()) {
      errors.gender = 'Vui lòng nhập giới tính';
    } else if (!['Nam', 'Nữ', 'Khác'].includes(gender)) {
      errors.gender = 'Giới tính không hợp lệ';
    }

    if (!address.trim()) {
      errors.address = 'Vui lòng nhập địa chỉ';
    } else if (address.trim().length < 5) {
      errors.address = 'Địa chỉ phải có ít nhất 5 ký tự';
    }

    if (phoneNumber.trim() && !/^\d{10}$/.test(phoneNumber)) {
      errors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    return errors;
  };

  // Hàm lưu hồ sơ người dùng
  const handleSaveProfile = () => {
    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
      Alert.alert('Lỗi', Object.values(errors).join('\n'));
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
        console.log('Hồ sơ người dùng đã được lưu: ', { fullName, age, gender, address, phoneNumber, profileImage });
      })
      .catch(error => {
        Alert.alert('Lỗi', 'Không thể lưu hồ sơ: ' + error.message);
        console.error('Lỗi khi lưu hồ sơ: ', error.message);
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
          console.log('Ảnh banner đã được tải: ', data.url_image);
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
    console.log("Điều hướng đến màn hình: ", screenName);
  };

  // Hàm làm mới dữ liệu
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchBannerImage(); // Tải lại ảnh banner
      // Bạn có thể thêm các hàm khác để tải lại dữ liệu nếu cần
    } catch (error) {
      console.error('Lỗi khi làm mới dữ liệu: ', error);
    }
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {isInitialModalVisible || isProfileModalVisible ? (
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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
      ) : (
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          {bannerImage && (
            <Image source={{ uri: bannerImage }} style={styles.bannerImage} />
          )}
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
                <TouchableOpacity style={[styles.button]} onPress={() => handlePress('Health')}>
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
      )}
    </View>
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
