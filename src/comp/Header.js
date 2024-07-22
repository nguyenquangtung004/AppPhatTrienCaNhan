// Header.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = ({ userImage }) => {
  return (
    <View style={styles.header}>
      <View style={{flexDirection:'row'}}>
        <TouchableOpacity style={styles.menuIcon}>
          <Icon name="bars" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Trang Chủ</Text> 
      </View>
      
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
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop:10,
    marginLeft:15
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
});

export default Header;
