import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';

const App = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [buttonOptions, setButtonOptions] = useState([]);

    useEffect(() => {
        // Tự động gửi tin nhắn khi người dùng nhấn vào nút "Message"
        const welcomeMessage = 'Chào bạn! Tôi có thể giúp gì cho bạn trong việc phát triển bản thân?';
        setMessages([{ id: Date.now(), text: welcomeMessage, sender: 'ai' }]);
        setButtonOptions([
            'Kỹ năng mềm',
            'Lập kế hoạch',
            'Tư vấn tâm lý'
        ]);
    }, []);

    const sendMessage = (text, sender = 'user') => {
        if (text.trim() === '') return;

        const newMessage = { id: Date.now() + Math.random(), text, sender };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        if (sender === 'user') {
            setInputText('');
            setButtonOptions([]);
            botResponse(text);
        }
    };

    const botResponse = (userMessage) => {
        let botMessage = 'Xin lỗi, tôi không hiểu bạn đang nói gì.';
        const lastMessage = messages[messages.length - 1];

        if (userMessage === 'Kỹ năng mềm') {
            botMessage = 'Bạn muốn biết về kỹ năng mềm nào?';
        } else if (userMessage === 'Lập kế hoạch') {
            botMessage = 'Bạn muốn lập kế hoạch cho điều gì?';
        } else if (userMessage === 'Tư vấn tâm lý') {
            botMessage = 'Bạn muốn tư vấn tâm lý bằng cách nào?';
            setTimeout(() => {
                setButtonOptions([
                    'Nhắn tin cho chuyên gia',
                    'Sử dụng bot chat'
                ]);
            }, 1000);
        } else if (userMessage === 'Nhắn tin cho chuyên gia' && lastMessage && lastMessage.text.includes('Tư vấn tâm lý')) {
            botMessage = 'Mời bạn đặt câu hỏi để cho chuyên gia trả lời.';
        } else if (userMessage === 'Sử dụng bot chat' && lastMessage && lastMessage.text.includes('Tư vấn tâm lý')) {
            botMessage = 'Bạn đã chọn sử dụng bot chat. Vui lòng nhập câu hỏi của bạn.';
        }

        if (botMessage !== 'Xin lỗi, tôi không hiểu bạn đang nói gì.') {
            setTimeout(() => {
                sendMessage(botMessage, 'ai');
            }, 1000);
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

export default App;
