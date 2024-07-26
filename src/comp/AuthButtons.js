// AuthButtons.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const AuthButtons = ({ onRegister, onNavigateLogin }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onNavigateLogin}>
        <Text style={styles.text}>Trở Về</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onRegister}>
        <Text style={styles.text}>Đăng Kí</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Bố trí các nút theo hàng ngang
    height: 80, // Chiều cao của container
    marginTop: 10 // Khoảng cách phía trên
  },
  button: {
    backgroundColor: "#0DFF7D", // Màu nền của nút
    flex: 1, // Chiếm toàn bộ không gian có sẵn
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
    borderWidth: 2, // Độ dày của viền
    margin: 20, // Khoảng cách xung quanh nút
    height: 80, // Chiều cao của nút
    borderRadius: 10 // Bo tròn các góc của nút
  },
  text: {
    fontSize: 30, // Kích thước chữ
    color: "black", // Màu chữ
    fontWeight: 'bold' // Độ đậm của chữ
  }
});

export default AuthButtons;
