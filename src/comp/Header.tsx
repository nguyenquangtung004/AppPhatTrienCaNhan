// Header.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = ({ userImage }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuIcon}>
        <Icon name="bars" size={30} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Trang Chủ</Text>
      <Image source={userImage} style={styles.avatar} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#D5F8D5',
    elevation: 2,
  },
  menuIcon: {
    padding: 10,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
});

export default Header;
