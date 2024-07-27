import React from 'react';
import { View, Text, Button } from 'react-native';

const ChangePasswordScreen = ({ navigation }) => {
    return (
        <View>
            <Text>Change Password Screen</Text>
            <Button title="Back to Home" onPress={() => navigation.goBack()} />
        </View>
    );
};

export default ChangePasswordScreen;
