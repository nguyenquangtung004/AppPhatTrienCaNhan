import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const InitialModal = ({ isVisible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
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
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Tạo Hồ Sơ</Text>
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
});

export default InitialModal;
