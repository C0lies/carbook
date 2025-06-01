import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
    const router = useRouter();

    return (
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Icon name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Profil</Text>
                </View>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/account/notifications')}
                >
                    <Text style={styles.menuText}>Powiadomienia</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/account/app-settings')}
                >
                    <Text style={styles.menuText}>Ustawienia aplikacji</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/account/account-settings')}
                >
                    <Text style={styles.menuText}>Ustawienia konta</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1, padding: 20, paddingTop: 60 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        height: 40,
    },
    backButton: {
        padding: 10,
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
    },
    menuItem: {
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    menuText: { fontSize: 16, fontWeight: '500', color: '#2d3748' },
});