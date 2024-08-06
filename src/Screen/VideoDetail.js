import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Video from 'react-native-video'; // Sử dụng thư viện react-native-video để phát video

const VideoDetail = ({ route }) => {
    const { video } = route.params;

    return (
        <View style={styles.container}>
            <Video
                source={{ uri: video.link_video }}
                style={styles.video}
                controls
            />
            <Text style={styles.title}>{video.tieu_de}</Text>
            <Text style={styles.author}>Tác giả: {video.tac_gia}</Text>
            <Text style={styles.description}>{video.mo_ta}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    video: {
        width: '100%',
        height: 200,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    description: {
        fontSize: 16,
        marginVertical: 8,
    },
    author: {
        fontSize: 14,
        marginVertical: 8,
        color: 'gray',
    },
});

export default VideoDetail;
