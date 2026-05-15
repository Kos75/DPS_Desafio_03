import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.32:3000'; // CAMBIAR POR TU IP

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('123');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            await AsyncStorage.setItem('userToken', response.data.token);
            navigation.replace('Home');
        } catch (error) {
            Alert.alert('Error', 'Credenciales incorrectas o error de red');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sistema de Inventario</Text>
            <TextInput 
                style={styles.input} placeholder="Usuario" 
                value={username} onChangeText={setUsername} autoCapitalize="none" 
            />
            <TextInput 
                style={styles.input} placeholder="Contraseña" 
                value={password} onChangeText={setPassword} secureTextEntry 
            />
            <Button title="Iniciar Sesión" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 5 }
});