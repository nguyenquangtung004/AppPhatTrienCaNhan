import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity,Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';

// Component Leaderboard để hiển thị danh sách người dùng
const Leaderboard = () => {
  const [users, setUsers] = useState([]); // State để lưu trữ danh sách người dùng
  const [isFriendModalVisible, setFriendModalVisible] = useState(false); // State để kiểm soát modal hiển thị thông báo kết bạn thành công
  // useEffect để gọi hàm fetchUsers khi component được render
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await firestore().collection('user').get(); // Lấy dữ liệu từ collection 'user' trong Firestore
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Fetched users: ', usersList); // Log chi tiết danh sách người dùng
        setUsers(usersList); // Cập nhật state users với danh sách người dùng
      } catch (error) {
        console.error('Error fetching users: ', error); // In ra lỗi nếu có
      }
    };

    fetchUsers(); // Gọi hàm fetchUsers
  }, []);

   
  // Hàm xử lý khi nhấn nút thêm bạn
  const handleAddFriend = async (userId) => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
      console.error('User is not authenticated');
      return;
    }

    if (currentUser.uid === userId) {
      console.error('Cannot add yourself as a friend');
      return;
    }

    try {
      await firestore().collection('friends').add({
        userId1: currentUser.uid,
        userId2: userId,
      });
      console.log(`Friend added with userId: ${userId}`);
      setFriendModalVisible(true); // Hiển thị modal kết bạn thành công
      setTimeout(() => setFriendModalVisible(false), 3000); // Tự động đóng modal sau 3 giây
    } catch (error) {
      console.error('Error adding friend: ', error);
    }
  };

  // Hàm render từng item trong danh sách
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
    <View>
    <FlatList
      data={users} // Dữ liệu danh sách người dùng
      renderItem={renderItem} // Hàm render item
      keyExtractor={item => item.id} // Khóa duy nhất cho từng item
      horizontal={true} // Hiển thị danh sách theo chiều ngang
      style={styles.container} // Áp dụng kiểu dáng cho danh sách
    />
    <Modal
      visible={isFriendModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setFriendModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <LottieView
            source={require('../material/animation/succes.json')} // Đường dẫn tới file animation
            autoPlay
            loop={false}
            style={styles.lottieAnimation}
          />
          <Text style={styles.modalText}>Kết bạn thành công!</Text>
        </View>
      </View>
    </Modal>
  </View>
  );
};

export default Leaderboard;

// Định nghĩa các kiểu dáng cho component
const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center', // Căn giữa các phần tử theo chiều ngang
    justifyContent: 'center', // Căn giữa các phần tử theo chiều dọc
    marginHorizontal: 10, // Khoảng cách ngang giữa các item
  },
  imageContainer: {
    borderWidth: 5, // Độ dày của viền
    borderColor: '#90EE90', // Màu của viền
    padding: 5, // Khoảng cách bên trong của container
    borderRadius: 60, // Bo tròn các góc
    position: 'relative', // Định vị tương đối
  },
  userImage: {
    width: 90, // Chiều rộng của ảnh người dùng
    height: 90, // Chiều cao của ảnh người dùng
    borderRadius: 40, // Bo tròn các góc
  },
  addButton: {
    position: 'absolute', // Định vị tuyệt đối
    bottom: 5, // Cách đáy 5 đơn vị
    right: 5, // Cách phải 5 đơn vị
    backgroundColor: '#F8BD00', // Màu nền của nút
    borderRadius: 15, // Bo tròn các góc
    padding: 5, // Khoảng cách bên trong của nút
  },
  userName: {
    marginTop: 10, // Khoảng cách trên của tên người dùng
    textAlign: 'center', // Căn giữa văn bản
    fontWeight: 'bold', // Độ đậm của chữ
    fontSize: 18, // Kích thước chữ
    color: 'black', // Màu chữ
  },
});
