import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';

const StepCounterScreen = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [stepsCounted, setStepsCounted] = useState(0);
    const [distance, setDistance] = useState(0.0);

    const handleStartStop = () => {
        if (isRunning) {
            // Stop the running session
            setIsRunning(false);
            // Save to Firebase
            saveSessionData();
        } else {
            // Start the running session
            setIsRunning(true);
            startTimer();
            startStepCounting();
        }
    };

    const saveSessionData = async () => {
        await firestore().collection('step').add({
            time: timeElapsed,
            steps: stepsCounted,
            distance: distance
        });
        // Reset state
        setTimeElapsed(0);
        setStepsCounted(0);
        setDistance(0.0);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.playButton} onPress={handleStartStop}>
                <Icon name={isRunning ? 'stop' : 'play'} size={30} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.text}>Time: {timeElapsed}s</Text>
            <Text style={styles.text}>Steps: {stepsCounted}</Text>
            <Text style={styles.text}>Distance: {distance.toFixed(2)} km</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    playButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        margin: 10,
    }
});

export default StepCounterScreen;

function startTimer() {
    throw new Error('Function not implemented.');
}
function startStepCounting() {
    throw new Error('Function not implemented.');
}

