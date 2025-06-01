import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function VehiclesScreen() {
    return (
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
            <View style={styles.container}>
                <Text style={styles.title}>Pojazdy</Text>
                <Text style={styles.text}>Lista pojazdów będzie tutaj.</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    text: { fontSize: 16, color: '#fff' },
});
