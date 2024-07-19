import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { addThankYouNote, setThankYouNotes } from '../redux/reducers'; // Import actions

const MentalManagementScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [serialNumber, setSerialNumber] = useState(1);
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
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu ghi chú: ' + error.message);
    }
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteItem}>
      <Text>Số Thứ Tự: {item.serialNumber}</Text>
      <Text>Ngày: {item.date}</Text>
      <Text>Nội Dung: {item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
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
          <Text style={styles.modalTitle}>Thêm Thư Cảm Ơn</Text>
          <Text>Số Thứ Tự: {serialNumber}</Text>
          <Text>Ngày: {new Date().toLocaleDateString()}</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            maxLength={300}
            value={newNoteContent}
            onChangeText={setNewNoteContent}
          />
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
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
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
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
