import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Component MakeFriendScreen để hiển thị danh sách bạn bè
const MakeFriendScreen = () => {
  const [friends, setFriends] = useState([]); // State để lưu trữ danh sách bạn bè

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const friendsSnapshot = await firestore()
            .collection('friends')
            .where('userId1', '==', currentUser.uid)
            .get();

          const friendIds = friendsSnapshot.docs.map(doc => doc.data().userId2);

          const userPromises = friendIds.map(async (userId) => {
            const userDoc = await firestore().collection('user').doc(userId).get();
            return { id: userDoc.id, ...userDoc.data() };
          });

          const friendsList = await Promise.all(userPromises);
          console.log('Fetched friends: ', friendsList); // Log chi tiết danh sách bạn bè
          setFriends(friendsList); // Cập nhật state friends với danh sách bạn bè
        }
      } catch (error) {
        console.error('Error fetching friends: ', error); // In ra lỗi nếu có
      }
    };

    fetchFriends(); // Gọi hàm fetchFriends
  }, []);

  // Hàm render từng item trong danh sách bạn bè
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.profileImage }} style={styles.userImage} />
      </View>
      <Text style={styles.userName}>{item.fullName}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={friends} // Dữ liệu danh sách bạn bè
        renderItem={renderItem} // Hàm render item
        keyExtractor={item => item.id} // Khóa duy nhất cho từng item
        style={styles.list} // Áp dụng kiểu dáng cho danh sách
      />
    </View>
  );
};

export default MakeFriendScreen;

// Định nghĩa các kiểu dáng cho component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  list: {
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    marginRight: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
