import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ScannerScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>Necesitamos tu permiso para usar la cámara</Text>
                <Button onPress={requestPermission} title="Otorgar Permiso" />
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        // data es el ID del producto escaneado (Ej: QR-001)
        navigation.navigate('Product', { productId: data });
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            {scanned && <Button title={'Toca para escanear de nuevo'} onPress={() => setScanned(false)} />}
        </View>
    );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center' } });