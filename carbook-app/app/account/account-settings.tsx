import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AccountSettingsScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = () => {
        if (password !== confirmPassword) {
            Alert.alert('Błąd', 'Hasła muszą być takie same');
            return;
        }
        Alert.alert('Sukces', 'Dane zostały zapisane');
    };

    return (
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
            <View style={styles.container}>
                <Text style={styles.title}>Ustawienia konta</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nowy email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nowe hasło"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Potwierdź hasło"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <Button title="Zapisz" onPress={handleSave} />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
});
