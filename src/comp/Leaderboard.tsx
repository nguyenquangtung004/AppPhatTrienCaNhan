import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await firestore().collection('user').get();
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddFriend = (userId) => {
    console.log(`Add friend with userId: ${userId}`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.profileImage }} style={styles.userImage} />
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddFriend(item.id)}>
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.userName}>{item.fullName}</Text>
    </View>
  );

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      horizontal={true}
      style={styles.container}
    />
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    justifyContent:'center',
    marginHorizontal: 10,
  },
  imageContainer: {
    borderWidth: 5,
    borderColor: '#90EE90',
    padding: 5,
    borderRadius: 60,
    position: 'relative',
  },
  userImage: {
    width: 90,
    height: 90,
    borderRadius: 40,
  },
  addButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#F8BD00',
    borderRadius: 15,
    padding: 5,
  },
  userName: {
    marginTop: 10,
    textAlign: 'center',
    fontWeight:"bold",
    fontSize:18,
    color:'black'
  },
});
