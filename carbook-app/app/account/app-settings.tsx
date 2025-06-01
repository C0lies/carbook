import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AppSettingsScreen() {
    return (
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
            <View style={styles.container}>
                <Text style={styles.title}>Ustawienia aplikacji</Text>
                <Text>Tu możesz dostosować motyw, czcionkę i inne opcje dostępności.</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
