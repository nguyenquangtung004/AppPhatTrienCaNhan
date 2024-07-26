import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LottieView from 'lottie-react-native';

const CustomModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide" // Kiểu animation khi modal xuất hiện
      transparent={true} // Nền của modal sẽ trong suốt
      visible={visible} // Điều kiện để hiển thị modal
      onRequestClose={onClose} // Hàm được gọi khi yêu cầu đóng modal
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <LottieView
            source={require('../material/animation/not_found.json')} // Đường dẫn tới file animation
            autoPlay // Tự động chạy animation
            loop // Lặp lại animation
            style={styles.modalAnimation}
          />
          <Text style={styles.modalText}>Tài khoản không tồn tại</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

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
  modalAnimation: {
    width: 150, // Chiều rộng của animation
    height: 150, // Chiều cao của animation
  },
  modalText: {
    fontSize: 20, // Kích thước chữ
    fontWeight: 'bold', // Độ đậm của chữ
    marginTop: 20, // Khoảng cách trên
    textAlign: 'center', // Căn giữa văn bản
  },
  closeButton: {
    marginTop: 20, // Khoảng cách trên
    backgroundColor: '#0DFF7D', // Màu nền của nút đóng
    padding: 10, // Khoảng cách bên trong
    borderRadius: 5, // Bo tròn các góc
  },
  closeButtonText: {
    fontSize: 18, // Kích thước chữ
    fontWeight: 'bold', // Độ đậm của chữ
    color: 'white', // Màu chữ
  },
});

export default CustomModal;
