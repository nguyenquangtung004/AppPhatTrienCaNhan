// ProfileModal.js
import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Modal, StyleSheet, Alert } from 'react-native';

const ProfileModal = ({
  isVisible,
  onClose,
  fullName,
  setFullName,
  age,
  setAge,
  gender,
  setGender,
  address,
  setAddress,
  phoneNumber,
  setPhoneNumber,
  profileImage,
  handleSelectImage,
  handleSaveProfile
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
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
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Xác Nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default ProfileModal;
