import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { addThankYouNote, setThankYouNotes } from '../redux/reducers';
import Header from '../comp/Header';

const MentalManagementScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [serialNumber, setSerialNumber] = useState(1);
  const [userImage, setUserImage] = useState(require('../material/image/avatar/user_icon.png'));
  const dispatch = useDispatch();
  const thankYouNotes = useSelector(state => state.thankYouNotes);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notesSnapshot = await firestore().collection('mental').get();
        const notesList = notesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        dispatch(setThankYouNotes(notesList));
        if (notesList.length > 0) {
          setSerialNumber(notesList.length + 1);
        }
      } catch (error) {
        console.error('Error fetching notes: ', error);
      }
    };

    fetchNotes();
  }, [dispatch]);

  const handleSaveNote = async () => {
    if (newNoteContent.trim() === '') {
      Alert.alert('Lỗi', 'Nội dung không thể để trống');
      return;
    }

    if (newNoteContent.length < 5) {
      Alert.alert('Lỗi', 'Nội dung phải có ít nhất 5 ký tự');
      return;
    }

    try {
      const today = new Date().toLocaleDateString();
      await firestore().collection('mental').add({
        serialNumber,
        date: today,
        content: newNoteContent
      });

      dispatch(addThankYouNote({
        serialNumber,
        date: today,
        content: newNoteContent
      }));

      setNewNoteContent('');
      setModalVisible(false);
      setSuccessModalVisible(true);

      setTimeout(() => {
        setSuccessModalVisible(false);
      }, 2000);

    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu ghi chú: ' + error.message);
    }
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteItem}>
      <View style={styles.noteHeader}>
        <Text style={[{ fontSize: 20, color: 'black' }, styles.serialNumberText]}>{item.serialNumber}</Text>
      </View>
      <View style={styles.noteContent}>
        <Text style={{ color: 'black', fontWeight: "bold", fontSize: 20 }}>Nội Dung: {item.content}</Text>
      </View>
      <Text style={[{ color: 'black', fontWeight: "bold", fontSize: 20, fontStyle: 'italic' }, styles.noteDate]}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header userImage={userImage} />
      <FlatList
        data={thankYouNotes}
        renderItem={renderNote}
        keyExtractor={item => item.id}
        style={styles.list}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Thêm</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.modalTitle}>Số Thứ Tự: {serialNumber}</Text>
              <Text style={styles.modalTitleCenter}>Thêm Lời Cảm Ơn</Text>
              <Text style={styles.modalTitle}>Ngày: {new Date().toLocaleDateString()}</Text>
            </View>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              maxLength={300}
              value={newNoteContent}
              onChangeText={setNewNoteContent}
              placeholder="Nhập nội dung..."
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveNote}
              >
                <Text style={styles.saveButtonText}>Gửi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isSuccessModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            <LottieView
              source={require('../material/animation/sendmessage.json')}
              autoPlay
              loop={false}
              style={styles.lottie}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MentalManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    margin: 10,
  },
  noteItem: {
    padding: 10,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    backgroundColor: '#99E77B',
    borderColor: '#ddd',
  },
  noteHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  serialNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noteContent: {
    padding: 10,
    position: 'relative',
  },
  noteDate: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 12,
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  modalContent: {
    width: '90%',
    borderRadius: 15,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  modalTitleCenter: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    color: 'black',
  },
  textInput: {
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  successModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModalContent: {
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 150,
    height: 150,
  },
});
