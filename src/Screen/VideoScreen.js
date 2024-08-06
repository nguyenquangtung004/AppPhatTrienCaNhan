import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const VideoScreen = () => {
    const [videos, setVideos] = useState([]); // State để lưu trữ danh sách video
    const navigation = useNavigation();

    useEffect(() => {
        // Hàm lấy dữ liệu từ Firestore
        const fetchVideos = async () => {
            try {
                const videosSnapshot = await firestore().collection('videos').get(); // Lấy dữ liệu từ collection 'videos'
                const videosList = videosSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log('Fetched videos: ', videosList); // Log chi tiết danh sách video
                setVideos(videosList); // Cập nhật state videos với danh sách video
            } catch (error) {
                console.error('Error fetching videos: ', error); // In ra lỗi nếu có
            }
        };

        fetchVideos(); // Gọi hàm fetchVideos
    }, []);

    // Hàm render từng item trong danh sách video
    const renderVideo = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('VideoDetail', { video: item })}>
            <View style={styles.card} key={item.id}>
                <Image
                    source={{ uri: item.anh}}
                    style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>Bài:{item.tieu_de}</Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.shareButton}>
                        <Icon name="share-alt" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderHeader = () => (
        <View>
            <Image
                source={{ uri: 'https://cdn.usegalileo.ai/sdxl10/81c15c56-096c-40a7-9252-4795aa80d55d.png' }}
                style={styles.imageBackground}
            />
            <Text style={styles.heading}>Phát triển cá nhân &amp; Tăng trưởng</Text>
            <Text style={styles.description}>Các bài tập thiền và yoga giúp bạn phát triển, học hỏi và tận dụng tối đa cuộc sống của mình.</Text>
        </View>
    );

    return (
        <LinearGradient colors={['#E0F7FA', '#E0F7FA']} style={styles.container}>
            <FlatList
                data={videos} // Dữ liệu danh sách video
                renderItem={renderVideo} // Hàm render item
                keyExtractor={item => item.id} // Khóa duy nhất cho từng item
                ListHeaderComponent={renderHeader} // Component header của FlatList
                style={styles.list} // Áp dụng kiểu dáng cho danh sách
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        paddingBottom: 16,
    },
    imageBackground: {
        width: '100%',
        height: 218,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111618',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    description: {
        fontSize: 16,
        color: '#111618',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    list: {
        paddingHorizontal: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 8,
        marginBottom: 8,
        borderRadius: 10,
    },
    cardImage: {
        width: 150,
        height: 100,
        borderRadius: 10,
        backgroundColor: 'gray'
    },
    cardContent: {
        flex: 1,
        paddingLeft: 8,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111618',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#617c89',
    },
    cardAuthor: {
        fontSize: 12,
        color: '#617c89',
    },
    shareButton: {
        marginLeft: 'auto',
        padding: 10,
    },
});

export default VideoScreen;
