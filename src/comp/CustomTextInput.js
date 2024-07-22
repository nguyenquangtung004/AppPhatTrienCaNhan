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
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    height: 80,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  toggleIcon: {
    marginLeft: 10,
  },
});

export default CustomTextInput;
