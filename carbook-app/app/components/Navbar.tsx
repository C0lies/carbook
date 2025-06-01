import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useAuth } from '../../lib/authContext';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [menuVisible, setMenuVisible] = useState(false);
    const slideAnim = useState(new Animated.Value(-Dimensions.get('window').width))[0];

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const toggleMenu = () => {
        if (menuVisible) {
            Animated.timing(slideAnim, {
                toValue: -Dimensions.get('window').width,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setMenuVisible(false));
        } else {
            setMenuVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const getInitials = (email: string) => {
        if (!email) return 'U';
        const parts = email.split('@')[0].split('.');
        return parts.map((part) => part[0].toUpperCase()).join('');
    };

    const getAvatarContent = () => {
        return <Text style={styles.avatarText}>{user?.email ? getInitials(user.email) : 'U'}</Text>;
    };

    const getAvatarContentLarge = () => {
        return <Text style={styles.avatarTextLarge}>{user?.email ? getInitials(user.email) : 'U'}</Text>;
    };

    return (
        <>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.navbar}
            >
                <View style={styles.userSection}>
                    <TouchableOpacity onPress={toggleMenu}>
                        <View style={styles.avatar}>
                            {getAvatarContent()}
                        </View>
                    </TouchableOpacity>
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

            {menuVisible && (
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={toggleMenu}
                >
                    <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
                        <View style={styles.menuHeader}>
                            <View style={styles.avatarLarge}>
                                {getAvatarContentLarge()}
                            </View>
                            <Text style={styles.userEmailLarge}>{user?.email}</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/_profile')} style={styles.menuItem}>
                            <Icon name="person" size={20} color="#333" style={styles.menuIcon} />
                            <Text style={styles.menuText}>Profil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/_vehicles')} style={styles.menuItem}>
                            <Icon name="directions-car" size={20} color="#333" style={styles.menuIcon} />
                            <Text style={styles.menuText}>Pojazdy</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            )}
            {menuVisible && (pathname === '/_profile' || pathname === '/_vehicles') && (
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="arrow-back" size={22} color="#111" />
                </TouchableOpacity>
            )}
        </>
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
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 22.5,
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
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9,
    },
    menuContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Dimensions.get('window').width * 0.8,
        height: '100%',
        backgroundColor: '#fff',
        zIndex: 10,
        paddingTop: 50,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        marginBottom: 20,
    },
    avatarLarge: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#667eea',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#764ba2',
    },
    avatarTextLarge: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    userEmailLarge: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    menuIcon: {
        marginRight: 15,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
    },
});