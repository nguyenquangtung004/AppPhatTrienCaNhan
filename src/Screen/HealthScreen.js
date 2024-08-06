import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const HealthScreen = () => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [bmiCategory, setBmiCategory] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        // Load weight, height, and BMI from AsyncStorage
        const loadStoredData = async () => {
            try {
                const storedWeight = await AsyncStorage.getItem('weight');
                const storedHeight = await AsyncStorage.getItem('height');
                const storedBmi = await AsyncStorage.getItem('bmi');
                if (storedWeight) setWeight(storedWeight);
                if (storedHeight) setHeight(storedHeight);
                if (storedBmi) setBmi(storedBmi);
            } catch (error) {
                console.error('Failed to load weight, height, and BMI from storage', error);
            }
        };
        loadStoredData();
    }, []);

    const validateInputs = () => {
        if (weight.trim() === '') {
            Alert.alert('Lỗi', 'Vui lòng nhập trọng lượng.');
            return false;
        }

        if (height.trim() === '') {
            Alert.alert('Lỗi', 'Vui lòng nhập chiều cao.');
            return false;
        }

        return true;
    };

    const calculateBMI = () => {
        if (validateInputs()) {
            const heightInMeters = parseFloat(height) / 100; // Chuyển đổi chiều cao từ cm sang mét
            const weightValue = parseFloat(weight); // Trọng lượng đã là kg
            const bmiValue = weightValue / (heightInMeters * heightInMeters);
            const bmiFixed = bmiValue.toFixed(1);
            setBmi(bmiFixed);

            storeData('bmi', bmiFixed); // Lưu chỉ số BMI vào AsyncStorage

            if (bmiValue < 18.5) {
                setBmiCategory('Thiếu cân');
            } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
                setBmiCategory('Cân đối');
            } else {
                setBmiCategory('Thừa cân');
            }
        }
    };

    const storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error(`Failed to save ${key} to storage`, error);
        }
    };

    const handleWeightChange = (text) => {
        setWeight(text);
        storeData('weight', text);
        calculateBMI();
    };

    const handleHeightChange = (text) => {
        setHeight(text);
        storeData('height', text);
        calculateBMI();
    };

    const openChat = () => {
        navigation.navigate('Chat', {
            weight: weight,
            height: height,
            bmi: bmi,
        });
    };

    return (
        <LinearGradient colors={['#f8fafb', '#f8fafb']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.heading}>Hiểu về BMI của bạn</Text>
                <Text style={styles.description}>
                    Chỉ số khối cơ thể (BMI) của bạn là một ước lượng về lượng mỡ cơ thể dựa trên trọng lượng và chiều cao của bạn. Nó có thể giúp bạn biết liệu bạn có thiếu cân, cân đối, thừa cân hay béo phì.
                </Text>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>BMI</Text>
                    <Text style={styles.bmiValue}>{bmi !== null ? bmi : '--'}</Text>
                    <View style={styles.bmiCategoryContainer}>
                        <Text style={styles.bmiCategoryLabel}>Thiếu cân</Text>
                        <View style={styles.bmiCategoryBar}>
                            <View style={[styles.bmiCategoryIndicator, { width: bmi < 18.5 ? '100%' : '0%' }]} />
                        </View>
                        <Text style={styles.bmiCategoryLabel}>Cân đối</Text>
                        <View style={styles.bmiCategoryBar}>
                            <View style={[styles.bmiCategoryIndicator, { width: bmi >= 18.5 && bmi < 24.9 ? '100%' : '0%' }]} />
                        </View>
                        <Text style={styles.bmiCategoryLabel}>Thừa cân</Text>
                        <View style={styles.bmiCategoryBar}>
                            <View style={[styles.bmiCategoryIndicator, { width: bmi >= 24.9 ? '100%' : '0%' }]} />
                        </View>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Trọng lượng (kg)"
                        style={styles.input}
                        keyboardType="numeric"
                        value={weight}
                        onChangeText={handleWeightChange}
                    />
                    <TextInput
                        placeholder="Chiều cao (cm)"
                        style={styles.input}
                        keyboardType="numeric"
                        value={height}
                        onChangeText={handleHeightChange}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={calculateBMI}>
                        <Text style={styles.buttonText}>Tính toán</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={openChat}>
                        <Text style={styles.buttonText}>Bạn cần hỗ trợ ?</Text>
                    </TouchableOpacity>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8fafb',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0e161b',
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0e161b',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    description: {
        fontSize: 16,
        color: '#0e161b',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        borderRadius: 10,
        borderColor: '#d1dee6',
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0e161b',
    },
    bmiValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0e161b',
    },
    bmiChange: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bmiNow: {
        fontSize: 16,
        color: '#507b95',
    },
    bmiChangePercentage: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#078838',
        marginLeft: 8,
    },
    bmiCategoryContainer: {
        marginTop: 16,
    },
    bmiCategoryLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#507b95',
    },
    bmiCategoryBar: {
        height: 10,
        backgroundColor: '#e8eef3',
        borderRadius: 5,
        marginVertical: 4,
    },
    bmiCategoryIndicator: {
        height: '100%',
        backgroundColor: '#507b95',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#e8eef3',
        borderRadius: 10,
        padding: 12,
        marginHorizontal: 8,
        color: '#0e161b',
        fontSize: 16,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    button: {
        backgroundColor: '#e8eef3',
        borderRadius: 24,
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0e161b',
    },
});

export default HealthScreen;
