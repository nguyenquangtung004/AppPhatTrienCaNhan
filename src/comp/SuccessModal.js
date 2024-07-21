import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const SuccessModal = ({ visible, onDismiss }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View style={styles.centeredView}>    
          <LottieView
            source={require('../material/animation/succes.json')} // Ensure correct filename
            autoPlay
            loop={false}
            style={styles.lottieAnimation}
          />
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  lottieAnimation: {
    width: 300,  // Adjusted to fit within the padding
    height: 300  // Adjusted to fit within the padding
  }
});

export default SuccessModal;
