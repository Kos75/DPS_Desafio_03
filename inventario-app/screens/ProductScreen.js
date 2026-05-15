import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.32:3000'; // Tu IP configurada

export default function ProductScreen({ route, navigation }) {
    const { productId } = route.params;
    const [producto, setProducto] = useState(null);
    const [cantidad, setCantidad] = useState('1');

    useEffect(() => { fetchProductDetails(); }, []);

    const fetchProductDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/productos/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducto(response.data);
        } catch (error) {
            Alert.alert('Error', 'Producto no encontrado en el inventario');
            navigation.goBack();
        }
    };

    // Nueva función que acepta 'sumar' o 'restar'
    const handleUpdateStock = async (accion) => {
        const numCantidad = parseInt(cantidad);
        
        if (isNaN(numCantidad) || numCantidad <= 0) {
            Alert.alert('Error', 'Por favor ingresa una cantidad válida mayor a 0');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.put(`${API_URL}/productos/${productId}`, 
                { 
                    cantidad: numCantidad,
                    accion: accion 
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            Alert.alert('Éxito', `Inventario actualizado correctamente (${accion})`);
            setProducto(response.data.producto);
            setCantidad('1'); // Reiniciar input
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Error al actualizar');
        }
    };

    if (!producto) return <View style={styles.container}><Text>Cargando...</Text></View>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{producto.nombre}</Text>
                <Text style={styles.idBadge}>ID: {producto.id}</Text>
            </View>

            <View style={styles.stockCard}>
                <Text style={styles.stockLabel}>Stock Actual</Text>
                <Text style={styles.stockValue}>{producto.stock}</Text>
            </View>

            <View style={styles.actionContainer}>
                <Text style={styles.label}>Cantidad a modificar:</Text>
                <TextInput 
                    style={styles.input} 
                    keyboardType="numeric" 
                    value={cantidad} 
                    onChangeText={setCantidad} 
                />
                
                <View style={styles.buttonRow}>
                    <View style={styles.buttonWrapper}>
                        <Button 
                            title="Entrada (+)" 
                            color="#28a745" 
                            onPress={() => handleUpdateStock('sumar')} 
                        />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Button 
                            title="Salida (-)" 
                            color="#dc3545" 
                            onPress={() => handleUpdateStock('restar')} 
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    header: { marginBottom: 20 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
    idBadge: { fontSize: 14, color: '#666', marginTop: 5 },
    stockCard: { 
        backgroundColor: '#fff', 
        padding: 20, 
        borderRadius: 15, 
        alignItems: 'center',
        elevation: 3, // Sombra en Android
        shadowColor: '#000', // Sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        marginBottom: 25
    },
    stockLabel: { fontSize: 16, color: '#888', textTransform: 'uppercase' },
    stockValue: { fontSize: 48, fontWeight: 'bold', color: '#007bff' },
    actionContainer: { 
        backgroundColor: '#fff', 
        padding: 20, 
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#eee'
    },
    label: { fontSize: 16, marginBottom: 10, fontWeight: '600' },
    input: { 
        height: 50, 
        borderColor: '#ddd', 
        borderWidth: 1, 
        marginBottom: 20, 
        paddingHorizontal: 15, 
        borderRadius: 10, 
        fontSize: 18,
        backgroundColor: '#fafafa' 
    },
    buttonRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    buttonWrapper: { 
        flex: 0.48 // Hace que los botones ocupen casi la mitad cada uno
    }
});