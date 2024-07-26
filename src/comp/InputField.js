import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Component InputField để tạo ô nhập liệu
const InputField = ({
  iconName, // Tên của icon hiển thị bên trái ô nhập liệu
  placeholder, // Nội dung gợi ý cho ô nhập liệu
  value, // Giá trị hiện tại của ô nhập liệu
  onChangeText, // Hàm để thay đổi giá trị của ô nhập liệu
  secureTextEntry, // Trạng thái ẩn/hiện nội dung nhập vào
  onTogglePasswordVisibility, // Hàm để thay đổi trạng thái ẩn/hiện mật khẩu
  error // Thông báo lỗi
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{placeholder}:</Text>
      <View style={styles.inputContainer}>
        <Icon name={iconName} size={30} color="black" style={styles.inputIcon} />
        <TextInput
          secureTextEntry={secureTextEntry}
          placeholder={`Nhập ${placeholder.toLowerCase()}`}
          style={styles.textInput}
          value={value}
          onChangeText={(text) => {
            console.log(`${placeholder} changed:`, text);
            onChangeText(text);
          }}
        />
        {onTogglePasswordVisibility && (
          <TouchableOpacity onPress={onTogglePasswordVisibility} style={styles.iconToggle}>
            <Icon name={secureTextEntry ? 'eye-slash' : 'eye'} size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

// Định nghĩa các kiểu dáng cho component
const styles = StyleSheet.create({
  container: {
    marginBottom: 15, // Khoảng cách dưới của container
  },
  label: {
    fontSize: 16, // Kích thước chữ của label
    color: 'black', // Màu chữ của label
    marginBottom: 5, // Khoảng cách dưới của label
  },
  inputContainer: {
    flexDirection: 'row', // Bố trí các phần tử theo hàng ngang
    alignItems: 'center', // Căn giữa các phần tử theo chiều dọc
    backgroundColor: 'white', // Màu nền của container
    borderBottomWidth: 1, // Độ dày của đường viền dưới
    borderColor: '#ccc', // Màu của đường viền dưới
    paddingVertical: 10, // Khoảng cách dọc bên trong
    paddingHorizontal: 15, // Khoảng cách ngang bên trong
    borderRadius: 5, // Bo tròn các góc
  },
  inputIcon: {
    marginRight: 10, // Khoảng cách bên phải của icon
  },
  textInput: {
    flex: 1, // Chiếm toàn bộ không gian còn lại
    fontSize: 16, // Kích thước chữ của text input
  },
  iconToggle: {
    padding: 10, // Khoảng cách bên trong của icon toggle
  },
  errorText: {
    color: 'red', // Màu chữ của thông báo lỗi
    fontSize: 14, // Kích thước chữ của thông báo lỗi
    marginTop: 5, // Khoảng cách trên của thông báo lỗi
  }
});

export default InputField;
