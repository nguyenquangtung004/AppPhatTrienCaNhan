import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomTextInput = ({ iconName, placeholder, value, onChangeText, secureTextEntry, onToggleSecureEntry, style }) => {
  return (
    <View style={[styles.inputContainer, style]}>
      <Icon name={iconName} size={40} color="black" style={styles.inputIcon} />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={styles.textInput}
      />
      {onToggleSecureEntry && (
        <Icon
          name={secureTextEntry ? 'eye-slash' : 'eye'}
          size={40}
          color="black"
          onPress={onToggleSecureEntry}
          style={styles.toggleIcon}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row', // Bố trí các phần tử theo hàng ngang
    alignItems: 'center', // Căn giữa các phần tử theo chiều dọc
    borderBottomWidth: 1, // Độ dày của đường viền dưới
    backgroundColor: 'white', // Màu nền của container
    height: 80, // Chiều cao của container
    borderRadius: 10, // Bo tròn các góc
    paddingHorizontal: 10, // Khoảng cách ngang bên trong
  },
  inputIcon: {
    marginRight: 10, // Khoảng cách bên phải của icon
  },
  textInput: {
    flex: 1, // Chiếm toàn bộ không gian còn lại
    fontSize: 16, // Kích thước chữ của text input
  },
  toggleIcon: {
    marginLeft: 10, // Khoảng cách bên trái của icon toggle
  },
});

export default CustomTextInput;
