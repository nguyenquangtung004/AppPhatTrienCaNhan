// src/Screen/LogoutScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const LogoutScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Logout Screen</Text>
            <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default LogoutScreen;
