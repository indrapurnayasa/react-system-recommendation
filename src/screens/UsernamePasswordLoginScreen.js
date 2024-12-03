import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function UsernamePasswordLoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const usernameAnimation = useRef(new Animated.Value(username ? 1 : 0)).current;
    const passwordAnimation = useRef(new Animated.Value(password ? 1 : 0)).current;

    const handleUsernameChange = (text) => {
        setUsername(text);
        Animated.timing(usernameAnimation, {
            toValue: text ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        Animated.timing(passwordAnimation, {
            toValue: text ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleLogin = () => {
        axios.post('http://10.63.110.70:5000/login', { username, password })
        .then((response) => {
            if (response.data.cif) {
            const cif = response.data.cif;
            console.log('Navigating to MainScreen with cif:', cif);
            // Navigate to the MainScreen and pass the cif as a parameter
            navigation.navigate('Main', { cif: cif });
            }
        })
        .catch((error) => {
            setError('Invalid username or password');
            console.error('Login error:', error);
        });
    };

    const labelStyle = (animation) => ({
        position: 'absolute',
        left: 10,
        top: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [20, -10], // Adjust these values as needed
        }),
        fontSize: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12], // Adjust these values as needed
        }),
        color: '#aaa',
    });

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.innerContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={24} color="#71dbd3" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Login</Text>
                </View>
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Animated.Text style={labelStyle(usernameAnimation)}>Username</Animated.Text>
                        <TextInput
                            style={[styles.input, { borderColor: username ? '#71dbd3' : '#ccc' }]}
                            placeholder="Username"
                            value={username}
                            onChangeText={handleUsernameChange}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor="#aaa"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Animated.Text style={labelStyle(passwordAnimation)}>Password</Animated.Text>
                        <TextInput
                            style={[styles.input, { borderColor: password ? '#71dbd3' : '#ccc' }]}
                            placeholder="Password"
                            value={password}
                            onChangeText={handlePasswordChange}
                            secureTextEntry={!showPassword}
                            placeholderTextColor="#aaa"
                        />
                        <TouchableOpacity
                            style={styles.togglePasswordButton}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#71dbd3" />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    innerContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    inputContainer: {
        marginBottom: 30,
        position: 'relative',
    },
    input: {
        height: 50,
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fff',
    },
    togglePasswordButton: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -12 }],
    },
    button: {
        backgroundColor: '#71dbd3',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        margin: 20,
    },
    buttonText: {
        color: '#0e0e0e',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
