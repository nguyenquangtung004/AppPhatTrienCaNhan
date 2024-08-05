import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Component MakeFriendScreen để hiển thị danh sách bạn bè
const MakeFriendScreen = () => {
  const [friends, setFriends] = useState([]); // State để lưu trữ danh sách bạn bè
  const [selectedFriend, setSelectedFriend] = useState(null); // State để lưu trữ bạn bè được chọn
  const [isMenuModalVisible, setMenuModalVisible] = useState(false); // State để kiểm soát hiển thị menu modal
  const [isProfileModalVisible, setProfileModalVisible] = useState(false); // State để kiểm soát hiển thị profile modal
  const [refreshing, setRefreshing] = useState(false); // State để kiểm soát trạng thái làm mới

  useEffect(() => {
    fetchFriends();
  }, []);

  // Hàm lấy danh sách bạn bè từ Firebase
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

  // Hàm xử lý khi nhấn nút ellipsis
  const handleEllipsisPress = (friend) => {
    setSelectedFriend(friend);
    setMenuModalVisible(true);
  };

  // Hàm xử lý khi chọn mục trong menu
  const handleMenuItemPress = (action) => {
    setMenuModalVisible(false);
    console.log(`${action} selected for ${selectedFriend.fullName}`);
    if (action === 'Thông tin cá nhân') {
      setProfileModalVisible(true);
    } else if (action === 'Hủy kết bạn') {
      handleUnfriend();
    } else {
      // Thực hiện các hành động tương ứng với từng mục trong menu
    }
  };

  // Hàm hủy kết bạn
  const handleUnfriend = async () => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const friendsSnapshot = await firestore()
          .collection('friends')
          .where('userId1', '==', currentUser.uid)
          .where('userId2', '==', selectedFriend.id)
          .get();

        friendsSnapshot.forEach(async doc => {
          await firestore().collection('friends').doc(doc.id).delete();
        });

        console.log(`Unfriended user with userId: ${selectedFriend.id}`);
        fetchFriends(); // Cập nhật lại danh sách bạn bè sau khi hủy kết bạn
      }
    } catch (error) {
      console.error('Error unfriending: ', error);
    }
  };

  // Hàm làm mới danh sách bạn bè
  const onRefresh = () => {
    setRefreshing(true);
    fetchFriends().then(() => setRefreshing(false));
  };

  // Hàm render từng item trong danh sách bạn bè
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.profileImage }} style={styles.userImage} />
      </View>
      <Text style={styles.userName}>{item.fullName}</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => handleEllipsisPress(item)}>
          <Icon name="ellipsis-v" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={friends} // Dữ liệu danh sách bạn bè
        renderItem={renderItem} // Hàm render item
        keyExtractor={item => item.id} // Khóa duy nhất cho từng item
        style={styles.list} // Áp dụng kiểu dáng cho danh sách
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Modal
        transparent={true}
        visible={isMenuModalVisible}
        onRequestClose={() => setMenuModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => handleMenuItemPress('Thông tin cá nhân')}>
                <Text style={styles.menuItem}>Thông tin cá nhân</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleMenuItemPress('Hủy kết bạn')}>
                <Text style={styles.menuItem}>Hủy kết bạn</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleMenuItemPress('Nhắn tin')}>
                <Text style={styles.menuItem}>Nhắn tin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        transparent={true}
        visible={isProfileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setProfileModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.profileModalContent}>
              {selectedFriend && (
                <>
                  <Image source={{ uri: selectedFriend.profileImage }} style={styles.profileImage} />
                  <Text style={styles.profileText}>Họ và Tên: {selectedFriend.fullName}</Text>
                  <Text style={styles.profileText}>Địa chỉ: {selectedFriend.address}</Text>
                  <Text style={styles.profileText}>Tuổi: {selectedFriend.age}</Text>
                  <Text style={styles.profileText}>Số điện thoại: {selectedFriend.phoneNumber}</Text>
                  <Text style={styles.profileText}>Giới tính: {selectedFriend.gender}</Text>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    flex: 1, // Chiếm toàn bộ không gian còn lại
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  menuItem: {
    fontSize: 18,
    padding: 10,
  },
  profileModalContent: {
    backgroundColor: '#cdc8ac',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight:"800",
    color:"black"
  },
});
