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
          onChangeText={onChangeText}
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
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  iconToggle: {
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  }
});

export default InputField;
