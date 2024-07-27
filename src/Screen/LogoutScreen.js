import React from 'react';
import { View, Text, Button } from 'react-native';

const LogoutScreen = ({ navigation }) => {
    const handleLogout = () => {
        // Implement your logout logic here
        navigation.navigate('Welcome');
    };

    return (
        <View>
            <Text>Logout Screen</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};

export default LogoutScreen;
