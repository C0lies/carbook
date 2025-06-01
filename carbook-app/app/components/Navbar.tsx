import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../lib/authContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const getInitials = (email: string) => {
        return email.split('@')[0].substring(0, 2).toUpperCase();
    };

    return (
        <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.navbar}
        >
            <View style={styles.userSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.email ? getInitials(user.email) : 'U'}
                    </Text>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.welcomeText}>Witaj ponownie!</Text>
                    <Text style={styles.userEmail} numberOfLines={1}>
                        {user?.email}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutButton}
                activeOpacity={0.7}
            >
                <View style={styles.logoutIconContainer}>
                    <Icon name="power-settings-new" size={22} color="#fff" />
                </View>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingTop: 50, // Account for status bar
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    avatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userInfo: {
        flex: 1,
    },
    welcomeText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        fontWeight: '500',
    },
    userEmail: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 2,
    },
    logoutButton: {
        padding: 8,
    },
    logoutIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
});