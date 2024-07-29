import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, TextInput, Alert, Modal } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newProfileData, setNewProfileData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userRef = firestore().collection('user').doc(user.uid);
          const doc = await userRef.get();
          if (doc.exists) {
            setProfileData(doc.data());
          } else {
            console.log('Không tìm thấy tài liệu!');
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu hồ sơ: ', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleSelectImage = () => {
    Alert.alert(
      'Chọn Ảnh',
      'Chọn phương thức để cập nhật ảnh đại diện',
      [
        {
          text: 'Thư viện',
          onPress: () => launchImageLibrary({ mediaType: 'photo' }, handleImageResponse),
        },
        { text: 'Hủy', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleImageResponse = async (response) => {
    if (response.didCancel) {
      console.log('Người dùng hủy chọn ảnh');
    } else if (response.errorCode) {
      console.log('Lỗi chọn ảnh: ', response.errorMessage);
    } else {
      const uri = response.assets[0].uri;
      console.log('URI ảnh đã chọn: ', uri);
      const user = auth().currentUser;

      // Upload ảnh lên Firebase Storage
      const storageRef = storage().ref(`profile_images/${user.uid}`);
      const task = storageRef.putFile(uri);

      task.on('state_changed', (taskSnapshot) => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });

      task.then(async () => {
        const downloadURL = await storageRef.getDownloadURL();
        console.log('URL tải xuống: ', downloadURL);

        // Cập nhật URL ảnh trong Firestore
        await firestore().collection('user').doc(user.uid).update({ profileImage: downloadURL });
        setProfileData((prevState) => ({ ...prevState, profileImage: downloadURL }));
        Alert.alert('Thành công', 'Cập nhật ảnh đại diện thành công');
      }).catch((error) => {
        console.error('Lỗi khi tải lên ảnh: ', error);
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        await firestore().collection('user').doc(user.uid).update(newProfileData);
        setProfileData((prevState) => ({ ...prevState, ...newProfileData }));
        setIsEditing(false);
        setModalVisible(false);
        Alert.alert('Thành công', 'Cập nhật thông tin cá nhân thành công');
      }
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu hồ sơ: ', error);
    }
  };

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <ImageBackground
            source={{ uri: profileData.profileImage }}
            style={styles.profileImage}
            imageStyle={{ borderRadius: 100 }}
          >
            <TouchableOpacity style={styles.cameraIcon} onPress={handleSelectImage}>
              <Icon name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profileData.fullName}</Text>
          <Text style={styles.profileDetails}>{profileData.age}, {profileData.address}</Text>
          <Text style={styles.profileDetails}>{profileData.gender}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.editButtonText}>Sửa Thông Tin Cá Nhân</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Họ và Tên"
              value={newProfileData.fullName || profileData.fullName}
              onChangeText={(text) => setNewProfileData({ ...newProfileData, fullName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Tuổi"
              value={newProfileData.age || profileData.age}
              onChangeText={(text) => setNewProfileData({ ...newProfileData, age: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={newProfileData.address || profileData.address}
              onChangeText={(text) => setNewProfileData({ ...newProfileData, address: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Giới tính"
              value={newProfileData.gender || profileData.gender}
              onChangeText={(text) => setNewProfileData({ ...newProfileData, gender: text })}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Xác Nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.planSection}>
        {[
          {
            title: 'Làm sao để tự tin hơn trong 30 ngày',
            category: 'Sức khỏe tinh thần',
            imageUri: 'https://cdn.usegalileo.ai/sdxl10/3fe0cb6c-9177-4bba-b3f8-eb5b7a08b5da.png',
          },
          {
            title: '5 thói quen đã thay đổi cuộc đời tôi',
            category: 'Năng suất',
            imageUri: 'https://cdn.usegalileo.ai/sdxl10/568d812d-e7b9-4198-9df7-d4c7f82e03b8.png',
          },
          {
            title: 'Routine buổi sáng mạnh mẽ nhất để thành công',
            category: 'Năng suất',
            imageUri: 'https://cdn.usegalileo.ai/stability/3cafc8ab-ed42-488e-9d03-52b995772398.png',
          },
        ].map((plan, index) => (
          <View key={index} style={styles.planItem}>
            <View style={styles.planInfo}>
              <Text style={styles.planCategory}>Kế Hoạch Phát Triển</Text>
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={styles.planCategory}>{plan.category}</Text>
            </View>
            <ImageBackground
              source={{ uri: plan.imageUri }}
              style={styles.planImage}
              imageStyle={{ borderRadius: 10 }}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  profileSection: {
    alignItems: 'center',
    padding: 16,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 128,
    height: 128,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  cameraIcon: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    padding: 5,
    margin: 5,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111517',
  },
  profileDetails: {
    fontSize: 14,
    color: '#647987',
  },
  input: {
    width: '100%',
    maxWidth: 480,
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#f0f3f4',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingHorizontal: 16,
    marginTop: 16,
    width: '100%',
    maxWidth: 480,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111517',
  },
  saveButton: {
    backgroundColor: '#28a745',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingHorizontal: 16,
    marginTop: 16,
    flex: 1,
    maxWidth: 480,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingHorizontal: 16,
    marginTop: 16,
    flex: 1,
    maxWidth: 480,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  planSection: {
    padding: 16,
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planInfo: {
    flex: 2,
  },
  planCategory: {
    fontSize: 14,
    color: '#647987',
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111517',
  },
  planImage: {
    flex: 1,
    height: 80,
    marginLeft: 16,
  },
});

export default ProfileScreen;
