import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function NotificationsScreen() {
    return (
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
            <View style={styles.container}>
                <Text style={styles.title}>Powiadomienia</Text>
                <Text>Tu możesz zarządzać swoimi powiadomieniami.</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
