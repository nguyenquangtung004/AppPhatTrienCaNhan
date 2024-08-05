import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Modal, StyleSheet, Alert } from 'react-native';

// Component ProfileModal để hiển thị modal tạo hồ sơ
const ProfileModal = ({
  isVisible, // Trạng thái hiển thị modal
  onClose, // Hàm để đóng modal
  fullName, // Giá trị của trường Họ và Tên
  setFullName, // Hàm để cập nhật giá trị của trường Họ và Tên
  age, // Giá trị của trường Tuổi
  setAge, // Hàm để cập nhật giá trị của trường Tuổi
  gender, // Giá trị của trường Giới Tính
  setGender, // Hàm để cập nhật giá trị của trường Giới Tính
  address, // Giá trị của trường Nơi ở hiện tại
  setAddress, // Hàm để cập nhật giá trị của trường Nơi ở hiện tại
  phoneNumber, // Giá trị của trường Số điện thoại
  setPhoneNumber, // Hàm để cập nhật giá trị của trường Số điện thoại
  profileImage, // URI của ảnh hồ sơ đã chọn
  handleSelectImage, // Hàm để chọn ảnh hồ sơ
  handleSaveProfile // Hàm để lưu hồ sơ
}) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!fullName) newErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!age || isNaN(age) || age <= 0) newErrors.age = 'Vui lòng nhập tuổi hợp lệ';
    if (!gender) newErrors.gender = 'Vui lòng nhập giới tính';
    if (!address) newErrors.address = 'Vui lòng nhập nơi ở hiện tại';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      handleSaveProfile();
    } else {
      Alert.alert('Lỗi', 'Vui lòng điền tất cả các trường hợp lệ');
    }
  };

  return (
    <Modal
      animationType="slide" // Kiểu animation khi mở modal
      transparent={true} // Modal trong suốt để nhìn thấy nền phía sau
      visible={isVisible} // Hiển thị modal nếu isVisible là true
      onRequestClose={onClose} // Hàm được gọi khi modal bị đóng
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
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
          <TextInput
            placeholder='Tuổi'
            value={age}
            onChangeText={setAge}
            keyboardType='numeric'
            style={styles.input}
          />
          {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
          <TextInput
            placeholder='Giới Tính'
            value={gender}
            onChangeText={setGender}
            style={styles.input}
          />
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          <TextInput
            placeholder='Nơi ở hiện tại'
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
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
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Xác Nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Định nghĩa các kiểu dáng cho component
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1, // Chiếm toàn bộ màn hình
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền với độ trong suốt
  },
  modalContent: {
    width: 300, // Chiều rộng của modal
    backgroundColor: 'white', // Màu nền của nội dung modal
    borderRadius: 10, // Bo tròn các góc
    alignItems: 'center', // Căn giữa theo chiều ngang
    padding: 20, // Khoảng cách bên trong
  },
  modalTitle: {
    fontSize: 20, // Kích thước chữ
    fontWeight: 'bold', // Độ đậm của chữ
    marginTop: 20, // Khoảng cách phía trên
  },
  input: {
    height: 40, // Chiều cao của ô nhập liệu
    borderColor: 'gray', // Màu viền của ô nhập liệu
    borderWidth: 1, // Độ dày của viền ô nhập liệu
    borderRadius: 5, // Bo tròn góc của ô nhập liệu
    marginBottom: 10, // Khoảng cách bên dưới ô nhập liệu
    paddingHorizontal: 10, // Khoảng cách bên trong ô nhập liệu
    width: '100%', // Chiếm toàn bộ chiều rộng của modal
  },
  selectImageButton: {
    backgroundColor: '#007bff', // Màu nền của nút chọn ảnh
    padding: 10, // Khoảng cách bên trong của nút chọn ảnh
    borderRadius: 5, // Bo tròn các góc của nút chọn ảnh
    marginVertical: 10, // Khoảng cách dọc của nút chọn ảnh
  },
  selectImageButtonText: {
    color: 'white', // Màu chữ của nút chọn ảnh
    fontSize: 16, // Kích thước chữ của nút chọn ảnh
  },
  selectedImage: {
    width: 100, // Chiều rộng của ảnh hồ sơ đã chọn
    height: 100, // Chiều cao của ảnh hồ sơ đã chọn
    borderRadius: 10, // Bo tròn góc của ảnh hồ sơ
    marginVertical: 10, // Khoảng cách dọc của ảnh hồ sơ
  },
  saveButton: {
    backgroundColor: '#28a745', // Màu nền của nút xác nhận
    padding: 10, // Khoảng cách bên trong của nút xác nhận
    borderRadius: 5, // Bo tròn các góc của nút xác nhận
    marginTop: 10, // Khoảng cách bên trên của nút xác nhận
  },
  saveButtonText: {
    color: 'white', // Màu chữ của nút xác nhận
    fontSize: 16, // Kích thước chữ của nút xác nhận
  },
  errorText: {
    color: 'red', // Màu chữ của thông báo lỗi
    fontSize: 14, // Kích thước chữ của thông báo lỗi
    marginBottom: 10, // Khoảng cách bên dưới thông báo lỗi
  },
});

export default ProfileModal;
