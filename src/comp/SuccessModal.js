import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

// Component SuccessModal để hiển thị thông báo thành công với animation
const SuccessModal = ({ visible, onDismiss }) => {
  return (
    <Modal
      visible={visible} // Hiển thị modal nếu visible là true
      transparent={true} // Modal sẽ trong suốt để nhìn thấy nền phía sau
      animationType="slide" // Animation khi mở modal
      onRequestClose={onDismiss} // Hàm được gọi khi modal bị đóng
    >
      <View style={styles.centeredView}>
        <LottieView
          source={require('../material/animation/succes.json')} // Đảm bảo đường dẫn đúng tới file animation
          autoPlay // Tự động phát animation
          loop={false} // Không lặp lại animation
          style={styles.lottieAnimation}
        />
      </View>
    </Modal>
  );
};

// Định nghĩa các kiểu dáng cho component
const styles = StyleSheet.create({
  centeredView: {
    flex: 1, // Chiếm toàn bộ chiều cao của màn hình
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền đen trong suốt
  },
  lottieAnimation: {
    width: 300, // Chiều rộng của animation
    height: 300, // Chiều cao của animation
  }
});

export default SuccessModal;
