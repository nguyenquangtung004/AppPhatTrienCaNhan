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
    flexDirection: 'row',
    height: 80,
    marginTop: 10
  },
  button: {
    backgroundColor: "#0DFF7D",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    margin: 20,
    height: 80,
    borderRadius: 10
  },
  text: {
    fontSize: 30,
    color: "black",
    fontWeight: 'bold'
  }
});

export default AuthButtons;
