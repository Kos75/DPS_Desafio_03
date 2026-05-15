import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'http://192.168.1.32:3000'; // CAMBIAR POR TU IP

export default function HomeScreen({ navigation }) {
    const [productos, setProductos] = useState([]);

    const fetchProductos = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/productos`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProductos(response.data);
        } catch (error) {
            Alert.alert('Error', 'Sesión expirada o token inválido');
            navigation.replace('Login');
        }
    };

    // Actualiza la lista cada vez que la pantalla vuelve a enfocarse
    useFocusEffect(
        useCallback(() => { fetchProductos(); }, [])
    );

    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Button title="Escanear Código QR" onPress={() => navigation.navigate('Scanner')} />
            <Text style={styles.subtitle}>Listado de Productos</Text>
            <FlatList
                data={productos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.bold}>{item.nombre} (ID: {item.id})</Text>
                        <Text>Stock Disponible: {item.stock}</Text>
                    </View>
                )}
            />
            <View style={styles.footer}>
                <Button title="Cerrar Sesión" color="red" onPress={logout} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    subtitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 15 },
    card: { padding: 15, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
    bold: { fontWeight: 'bold' },
    footer: { marginTop: 20 }
});