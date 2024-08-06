import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [buttonOptions, setButtonOptions] = useState([]);
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);

    useEffect(() => {
        const welcomeMessage = 'Chào bạn! Tôi có thể giúp gì cho bạn trong việc phát triển bản thân?';
        setMessages([{ id: Date.now(), text: welcomeMessage, sender: 'ai' }]);
        setButtonOptions([
            'Kỹ năng mềm',
            'Lập kế hoạch',
            'Tư vấn tâm lý và sức khoẻ'
        ]);

        const loadStoredData = async () => {
            try {
                const storedWeight = await AsyncStorage.getItem('weight');
                const storedHeight = await AsyncStorage.getItem('height');
                const storedBmi = await AsyncStorage.getItem('bmi');
                if (storedWeight) setWeight(storedWeight);
                if (storedHeight) setHeight(storedHeight);
                if (storedBmi) setBmi(parseFloat(storedBmi));
            } catch (error) {
                console.error('Failed to load data from storage', error);
            }
        };
        loadStoredData();
    }, []);

    const sendMessage = (text, sender = 'user') => {
        if (text.trim() === '') return;

        const newMessage = { id: Date.now() + Math.random(), text, sender };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        if (sender === 'user') {
            setInputText('');
            setButtonOptions([]);
            setTimeout(() => {
                botResponse(text);
            }, 500); // Added a slight delay for bot response
        }
    };

    const botResponse = (userMessage) => {
        let botMessage = 'Xin lỗi, tôi không hiểu bạn đang nói gì.';
        const lastMessage = messages[messages.length - 1];

        if (userMessage === 'Kỹ năng mềm') {
            botMessage = 'Bạn muốn biết về kỹ năng mềm nào?';
        } else if (userMessage === 'Lập kế hoạch') {
            botMessage = 'Bạn muốn lập kế hoạch cho điều gì?';
        } else if (userMessage === 'Tư vấn tâm lý và sức khoẻ') {
            botMessage = 'Bạn muốn tư vấn tâm lý bằng cách nào?';
            setTimeout(() => {
                setButtonOptions([
                    'Nhắn tin cho chuyên gia',
                    'Sử dụng bot chat'
                ]);
            }, 1000);
        } else if (userMessage === 'Nhắn tin cho chuyên gia' && lastMessage && lastMessage.text.includes('Bạn muốn tư vấn tâm lý bằng cách nào')) {
            botMessage = 'Mời bạn đặt câu hỏi để cho chuyên gia trả lời.';
        } else if (userMessage === 'Sử dụng bot chat' && lastMessage && lastMessage.text.includes('Bạn muốn tư vấn tâm lý bằng cách nào')) {
            botMessage = 'Bạn đã chọn sử dụng bot chat. Bạn muốn tư vấn về sức khỏe hay tâm lý?';
            setTimeout(() => {
                setButtonOptions([
                    'Tư vấn sức khoẻ',
                    'Tư vấn tâm lý'
                ]);
            }, 1000);
        } else if (userMessage === 'Tư vấn sức khoẻ' && lastMessage && lastMessage.text.includes('Bạn muốn tư vấn về sức khỏe hay tâm lý')) {
            if (bmi !== null) {
                const bmiCategoryMessage = getBMICategory(bmi);
                botMessage = `Chỉ số BMI của bạn là ${bmi.toFixed(1)}. ${bmiCategoryMessage}`;
            } else {
                botMessage = 'Chúng tôi không tìm thấy thông tin BMI của bạn. Vui lòng kiểm tra lại trong màn hình Health.';
            }
        }

        if (botMessage !== 'Xin lỗi, tôi không hiểu bạn đang nói gì.') {
            setTimeout(() => {
                sendMessage(botMessage, 'ai');
            }, 1000);
        }
    };

    const getBMICategory = (bmiValue) => {
        if (bmiValue < 18.5) {
            return 'Bạn thuộc nhóm Thiếu cân. Hãy bổ sung dinh dưỡng và ăn nhiều bữa phụ. \nBữa sáng: Oatmeal với các loại hạt và trái cây, \nBữa trưa: Sandwich gà nướng với salad quinoa, \nBữa tối: Spaghetti với sốt marinara và thịt viên';
        } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
            return 'Bạn thuộc nhóm Cân đối. Hãy duy trì chế độ ăn uống và lối sống lành mạnh. \nBữa sáng: Trứng chiên với rau củ, \nBữa trưa: Salad gà nướng, \nBữa tối: Cá nướng với rau củ';
        } else if (bmiValue >= 25 && bmiValue < 29.9) {
            return 'Bạn thuộc nhóm Thừa cân. Hãy cắt giảm calo, ăn nhiều rau xanh và tập thể dục thường xuyên. \nBữa sáng: Yogurt Hy Lạp với dâu tây, \nBữa trưa: Sandwich gà tây với bánh mì nguyên cám, \nBữa tối: Gà xào rau củ với gạo lứt';
        } else {
            return 'Bạn thuộc nhóm Béo phì. Hãy cắt giảm calo, ăn nhiều rau xanh và tập thể dục thường xuyên. \nBữa sáng: Omelet trứng trắng với rau củ, \nBữa trưa: Cá hồi nướng với rau củ hấp, \nBữa tối: Ức gà nướng với khoai lang';
        }
    };

    const renderItem = ({ item }) => {
        return (
            <View style={item.sender === 'user' ? styles.userMessage : styles.aiMessage}>
                <Text style={styles.messageText}>{item.text}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.messageList}
            />
            {buttonOptions.length > 0 && (
                <View style={styles.buttonContainer}>
                    {buttonOptions.map((option, index) => (
                        <TouchableOpacity key={index} style={styles.button} onPress={() => sendMessage(option)}>
                            <Text style={styles.buttonText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Nhập tin nhắn..."
                />
                <Button title="Gửi" onPress={() => sendMessage(inputText)} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    messageList: {
        paddingBottom: 60, // Adjust to keep the message list above the buttons
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        padding: 10,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#dcf8c6',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    aiMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#f1f0f0',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginVertical: 10,
        // Position buttons above the input
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 5,
        maxWidth: '48%', // Ensures the buttons wrap to the next line if they are too wide
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    messageText: {
        fontSize: 16,
    },
});

export default App
