import React from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

const StepScreen = () => {
    return (
        <LinearGradient colors={['#E0F7FA', '#E0F7FA']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <ImageBackground
                    source={{ uri: 'https://cdn.usegalileo.ai/sdxl10/81c15c56-096c-40a7-9252-4795aa80d55d.png' }}
                    style={styles.imageBackground}
                    imageStyle={styles.imageBackgroundImage}
                />
                <Text style={styles.heading}>Personal development &amp; growth</Text>
                <Text style={styles.description}>Meditation and yoga exercises to help you grow, learn and make the most of your life.</Text>

                <View style={styles.card}>
                    <ImageBackground
                        source={{ uri: 'https://cdn.usegalileo.ai/stability/a9c09a15-b322-4218-ac8a-c59648ad886f.png' }}
                        style={styles.cardImage}
                        imageStyle={styles.cardImageBackground}
                    />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>How to be a better listener</Text>
                        <Text style={styles.cardSubtitle}>EP102</Text>
                        <Text style={styles.cardSubtitle}>10min</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <ImageBackground
                        source={{ uri: 'https://cdn.usegalileo.ai/stability/bf3cf738-deaa-4105-bf74-f9646d2550c6.png' }}
                        style={styles.cardImage}
                        imageStyle={styles.cardImageBackground}
                    />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Yoga for beginners</Text>
                        <Text style={styles.cardSubtitle}>EP100</Text>
                        <Text style={styles.cardSubtitle}>20min</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <ImageBackground
                        source={{ uri: 'https://cdn.usegalileo.ai/stability/34e08f42-65a4-4689-81b8-e729c47b805e.png' }}
                        style={styles.cardImage}
                        imageStyle={styles.cardImageBackground}
                    />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>How to build self confidence</Text>
                        <Text style={styles.cardSubtitle}>EP103</Text>
                        <Text style={styles.cardSubtitle}>15min</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <ImageBackground
                        source={{ uri: 'https://cdn.usegalileo.ai/stability/e04535d7-6f7f-4f9e-b873-0de282b9a5f8.png' }}
                        style={styles.cardImage}
                        imageStyle={styles.cardImageBackground}
                    />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Improve your mental health</Text>
                        <Text style={styles.cardSubtitle}>EP104</Text>
                        <Text style={styles.cardSubtitle}>10min</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <ImageBackground
                        source={{ uri: 'https://cdn.usegalileo.ai/stability/809b1c2c-7f52-4d9b-8f61-4fd3547778a5.png' }}
                        style={styles.cardImage}
                        imageStyle={styles.cardImageBackground}
                    />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Learn to forgive</Text>
                        <Text style={styles.cardSubtitle}>EP105</Text>
                        <Text style={styles.cardSubtitle}>8min</Text>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 16,
    },
    imageBackground: {
        width: '100%',
        height: 218,
        justifyContent: 'flex-end',
    },
    imageBackgroundImage: {
        borderRadius: 10,
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
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 8,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 10,
    },
    cardImage: {
        width: 100,
        height: 70,
    },
    cardImageBackground: {
        borderRadius: 10,
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
});

export default StepScreen;
