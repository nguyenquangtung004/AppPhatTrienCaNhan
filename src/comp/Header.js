import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = ({ navigation, title, userImage }) => {
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      {userImage ? (
        <Image source={{ uri: userImage }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholderAvatar}>
          <Icon name="user" size={20} color="#fff" />
        </View>
      )}
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
    marginTop: 10,
    marginLeft: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  placeholderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;
