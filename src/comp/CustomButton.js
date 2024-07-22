import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const CustomButton = ({ text, onPress, onHoverStart, onHoverEnd, style }) => {
  return (
    <TouchableOpacity
      style={style}
      onPressIn={onHoverStart}
      onPressOut={onHoverEnd}
      onPress={onPress}
    >
      <Text style={styles.textButton}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textButton: {
    fontSize: 30,
    color: "black",
    fontWeight: 'bold',
  },
});

export default CustomButton;
