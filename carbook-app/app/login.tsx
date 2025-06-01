import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, TextInput as RNTextInput } from 'react-native';
import { TextInput, Button, ActivityIndicator, Text, useTheme, Provider as PaperProvider, Card, IconButton, MD3LightTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../lib/authContext';
import { useRouter } from 'expo-router';

const blueTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#1976D2',
        primaryContainer: '#E3F2FD',
        secondary: '#2196F3',
        secondaryContainer: '#BBDEFB',
        tertiary: '#03A9F4',
        surface: '#FFFFFF',
        surfaceVariant: '#F5F5F5',
        background: '#FAFAFA',
        onPrimary: '#FFFFFF',
        onPrimaryContainer: '#0D47A1',
        onSecondary: '#FFFFFF',
        onSurface: '#212121',
        onSurfaceVariant: '#616161',
        outline: '#9E9E9E',
    },
};

export default function LoginScreen() {
    const { login, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const theme = blueTheme;

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola');
            return;
        }

        setSubmitting(true);
        try {
            await login(email, password);
            router.push('/home');
        } catch (err: any) {
            Alert.alert('Błąd logowania', err.message || 'Login failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PaperProvider theme={blueTheme}>
            <LinearGradient
                colors={['#1976D2', '#42A5F5']}
                style={styles.gradient}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.logoContainer}>
                            <View style={[styles.logoCircle, { backgroundColor: theme.colors.surface }]}>
                                <Text style={[styles.logoText, { color: theme.colors.primary }]}>L</Text>
                            </View>
                        </View>

                        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={8}>
                            <Card.Content style={styles.cardContent}>
                                <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
                                    Witaj ponownie!
                                </Text>
                                <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                                    Zaloguj się do swojego konta
                                </Text>

                                <View style={styles.inputContainer}>
                                    <View style={styles.customInputContainer}>
                                        <Text style={[styles.inputLabel, { color: theme.colors.primary }]}>Adres email</Text>
                                        <RNTextInput
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            placeholder="Wprowadź swój email"
                                            placeholderTextColor={theme.colors.onSurfaceVariant}
                                            style={[styles.customInput, {
                                                color: '#1976D2',
                                                borderColor: theme.colors.outline,
                                                backgroundColor: theme.colors.surface
                                            }]}
                                        />
                                    </View>

                                    <View style={styles.customInputContainer}>
                                        <Text style={[styles.inputLabel, { color: theme.colors.primary }]}>Hasło</Text>
                                        <RNTextInput
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={!showPassword}
                                            autoComplete="password"
                                            placeholder="Wprowadź swoje hasło"
                                            placeholderTextColor={theme.colors.onSurfaceVariant}
                                            style={[styles.customInput, {
                                                color: '#1976D2',
                                                borderColor: theme.colors.outline,
                                                backgroundColor: theme.colors.surface
                                            }]}
                                        />
                                        <Button
                                            mode="text"
                                            onPress={() => setShowPassword(!showPassword)}
                                            style={styles.showPasswordButton}
                                            compact
                                        >
                                            {showPassword ? "Ukryj" : "Pokaż"}
                                        </Button>
                                    </View>
                                </View>

                                <Button
                                    mode="contained"
                                    onPress={handleLogin}
                                    loading={submitting || loading}
                                    disabled={submitting || loading || !email.trim() || !password.trim()}
                                    style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
                                    contentStyle={styles.buttonContent}
                                    labelStyle={styles.buttonLabel}
                                >
                                    {submitting || loading ? 'Logowanie...' : 'Zaloguj się'}
                                </Button>

                                {(submitting || loading) && (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="small" color={theme.colors.primary} />
                                        <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
                                            Trwa logowanie...
                                        </Text>
                                    </View>
                                )}
                            </Card.Content>
                        </Card>

                        <View style={styles.footer}>
                            <Button
                                mode="text"
                                textColor={theme.colors.surface}
                                onPress={() => Alert.alert('Info', 'Funkcja w przygotowaniu')}
                            >
                                Zapomniałeś hasła?
                            </Button>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        minHeight: '100%',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    logoText: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    card: {
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 12,
    },
    cardContent: {
        padding: 32,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 32,
        opacity: 0.7,
    },
    inputContainer: {
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    customInputContainer: {
        marginBottom: 16,
        position: 'relative',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        marginLeft: 4,
    },
    customInput: {
        height: 48,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: '500',
    },
    showPasswordButton: {
        position: 'absolute',
        right: 4,
        top: 32,
        minWidth: 60,
        height: 32,
    },
    loginButton: {
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 14,
    },
    footer: {
        alignItems: 'center',
        marginTop: 24,
    },
});