import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as api from '../lib/api';

type VehicleFormData = {
    brand: string;
    model: string;
    version: string;
    engine: string;
    first_registration: string;
    license_plate: string;
    fuel_type: string;
    power: string;
    displacement: string;
    body_type: string;
    color: string;
    doors: string;
    seats: string;
    transmission: string;
    drive_type: string;
    mileage: string;
    notes: string;
};

type VehicleDetails = {
    id: number;
    vin: string;
    brand?: string;
    model?: string;
    version?: string;
    engine?: string;
    first_registration?: string;
    custom_number: number;
    license_plate?: string;
    fuel_type?: string;
    power?: string;
    displacement?: string;
    body_type?: string;
    color?: string;
    doors?: number;
    seats?: number;
    transmission?: string;
    drive_type?: string;
    mileage?: number;
    notes?: string;
};

export default function VehicleEditScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
    const [formData, setFormData] = useState<VehicleFormData>({
        brand: '',
        model: '',
        version: '',
        engine: '',
        first_registration: '',
        license_plate: '',
        fuel_type: '',
        power: '',
        displacement: '',
        body_type: '',
        color: '',
        doors: '',
        seats: '',
        transmission: '',
        drive_type: '',
        mileage: '',
        notes: '',
    });

    useEffect(() => {
        loadVehicleData();
    }, []);

    const loadVehicleData = async () => {
        setLoading(true);
        try {
            const vehicleId = params.vehicleId as string;
            let vehicleData: VehicleDetails | null = null;

            // Pobierz dane z parametrów jeśli dostępne
            if (params.vehicleData) {
                vehicleData = JSON.parse(params.vehicleData as string);
            }

            // Pobierz najnowsze dane z API
            if (vehicleId) {
                const res = await api.fetchWithAuth(`/vehicles/${vehicleId}`);
                if (res.ok) {
                    vehicleData = await res.json();
                }
            }

            if (vehicleData) {
                setVehicle(vehicleData);
                // Wypełnij formularz danymi pojazdu
                setFormData({
                    brand: vehicleData.brand || '',
                    model: vehicleData.model || '',
                    version: vehicleData.version || '',
                    engine: vehicleData.engine || '',
                    first_registration: vehicleData.first_registration ?
                        vehicleData.first_registration.split('T')[0] : '',
                    license_plate: vehicleData.license_plate || '',
                    fuel_type: vehicleData.fuel_type || '',
                    power: vehicleData.power || '',
                    displacement: vehicleData.displacement || '',
                    body_type: vehicleData.body_type || '',
                    color: vehicleData.color || '',
                    doors: vehicleData.doors?.toString() || '',
                    seats: vehicleData.seats?.toString() || '',
                    transmission: vehicleData.transmission || '',
                    drive_type: vehicleData.drive_type || '',
                    mileage: vehicleData.mileage?.toString() || '',
                    notes: vehicleData.notes || '',
                });
            }
        } catch (error) {
            console.error('Error loading vehicle data:', error);
            Alert.alert('Błąd', 'Nie udało się załadować danych pojazdu');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof VehicleFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (!vehicle) return;

        // Walidacja podstawowych pól
        if (!formData.brand.trim() || !formData.model.trim()) {
            Alert.alert('Błąd', 'Marka i model pojazdu są wymagane');
            return;
        }

        setSaving(true);
        try {
            // Przygotuj dane do wysłania
            const updateData = {
                brand: formData.brand.trim(),
                model: formData.model.trim(),
                version: formData.version.trim(),
                engine: formData.engine.trim(),
                first_registration: formData.first_registration || null,
                license_plate: formData.license_plate.trim(),
                fuel_type: formData.fuel_type.trim(),
                power: formData.power.trim(),
                displacement: formData.displacement.trim(),
                body_type: formData.body_type.trim(),
                color: formData.color.trim(),
                doors: formData.doors ? parseInt(formData.doors) : null,
                seats: formData.seats ? parseInt(formData.seats) : null,
                transmission: formData.transmission.trim(),
                drive_type: formData.drive_type.trim(),
                mileage: formData.mileage ? parseInt(formData.mileage) : null,
                notes: formData.notes.trim(),
            };

            const res = await api.fetchWithAuth(`/vehicles/${vehicle.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (res.ok) {
                Alert.alert('Sukces', 'Pojazd został zaktualizowany', [
                    {
                        text: 'OK',
                        onPress: () => {
                            router.back();
                        }
                    }
                ]);
            } else {
                const errorData = await res.json();
                Alert.alert('Błąd', errorData.message || 'Nie udało się zaktualizować pojazdu');
            }
        } catch (error) {
            console.error('Error updating vehicle:', error);
            Alert.alert('Błąd', 'Wystąpił błąd podczas aktualizacji pojazdu');
        } finally {
            setSaving(false);
        }
    };

    const InputField = ({
        label,
        value,
        onChangeText,
        placeholder,
        keyboardType = 'default',
        multiline = false,
        icon
    }: {
        label: string;
        value: string;
        onChangeText: (text: string) => void;
        placeholder?: string;
        keyboardType?: 'default' | 'numeric' | 'email-address';
        multiline?: boolean;
        icon?: string;
    }) => (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={styles.inputContainer}>
                {icon && (
                    <Icon name={icon} size={20} color="#667eea" style={styles.inputIcon} />
                )}
                <TextInput
                    style={[
                        styles.textInput,
                        multiline && styles.textInputMultiline,
                        icon && styles.textInputWithIcon
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#a0aec0"
                    keyboardType={keyboardType}
                    multiline={multiline}
                    numberOfLines={multiline ? 4 : 1}
                />
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Ładowanie danych...</Text>
            </View>
        );
    }

    if (!vehicle) {
        return (
            <View style={styles.errorContainer}>
                <Icon name="error-outline" size={64} color="#e53e3e" />
                <Text style={styles.errorTitle}>Błąd</Text>
                <Text style={styles.errorText}>Nie udało się załadować danych pojazdu</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Powrót</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header */}
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>Edytuj pojazd</Text>
                        <Text style={styles.headerSubtitle}>#{vehicle.custom_number}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Icon name="check" size={24} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Podstawowe informacje */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Podstawowe informacje</Text>

                    <InputField
                        label="Marka *"
                        value={formData.brand}
                        onChangeText={(text) => handleInputChange('brand', text)}
                        placeholder="np. BMW"
                        icon="directions-car"
                    />

                    <InputField
                        label="Model *"
                        value={formData.model}
                        onChangeText={(text) => handleInputChange('model', text)}
                        placeholder="np. 320d"
                        icon="directions-car"
                    />

                    <InputField
                        label="Wersja"
                        value={formData.version}
                        onChangeText={(text) => handleInputChange('version', text)}
                        placeholder="np. M Sport"
                        icon="star"
                    />

                    <InputField
                        label="Numer rejestracyjny"
                        value={formData.license_plate}
                        onChangeText={(text) => handleInputChange('license_plate', text)}
                        placeholder="np. KR 12345"
                        icon="confirmation-number"
                    />

                    <InputField
                        label="Kolor"
                        value={formData.color}
                        onChangeText={(text) => handleInputChange('color', text)}
                        placeholder="np. Czarny"
                        icon="palette"
                    />

                    <InputField
                        label="Data pierwszej rejestracji"
                        value={formData.first_registration}
                        onChangeText={(text) => handleInputChange('first_registration', text)}
                        placeholder="YYYY-MM-DD"
                        icon="event"
                    />
                </View>

                {/* Dane techniczne */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dane techniczne</Text>

                    <InputField
                        label="Silnik"
                        value={formData.engine}
                        onChangeText={(text) => handleInputChange('engine', text)}
                        placeholder="np. 2.0 TDI"
                        icon="settings"
                    />

                    <InputField
                        label="Rodzaj paliwa"
                        value={formData.fuel_type}
                        onChangeText={(text) => handleInputChange('fuel_type', text)}
                        placeholder="np. Diesel"
                        icon="local-gas-station"
                    />

                    <InputField
                        label="Moc"
                        value={formData.power}
                        onChangeText={(text) => handleInputChange('power', text)}
                        placeholder="np. 190 KM"
                        icon="speed"
                    />

                    <InputField
                        label="Pojemność"
                        value={formData.displacement}
                        onChangeText={(text) => handleInputChange('displacement', text)}
                        placeholder="np. 1995 cm³"
                        icon="tune"
                    />

                    <InputField
                        label="Typ nadwozia"
                        value={formData.body_type}
                        onChangeText={(text) => handleInputChange('body_type', text)}
                        placeholder="np. Sedan"
                        icon="directions-car"
                    />

                    <InputField
                        label="Skrzynia biegów"
                        value={formData.transmission}
                        onChangeText={(text) => handleInputChange('transmission', text)}
                        placeholder="np. Automatyczna"
                        icon="swap-horiz"
                    />

                    <InputField
                        label="Napęd"
                        value={formData.drive_type}
                        onChangeText={(text) => handleInputChange('drive_type', text)}
                        placeholder="np. RWD"
                        icon="compare-arrows"
                    />
                </View>

                {/* Szczegóły pojazdu */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Szczegóły pojazdu</Text>

                    <InputField
                        label="Liczba drzwi"
                        value={formData.doors}
                        onChangeText={(text) => handleInputChange('doors', text)}
                        placeholder="np. 4"
                        keyboardType="numeric"
                        icon="sensor-door"
                    />

                    <InputField
                        label="Liczba miejsc"
                        value={formData.seats}
                        onChangeText={(text) => handleInputChange('seats', text)}
                        placeholder="np. 5"
                        keyboardType="numeric"
                        icon="event-seat"
                    />

                    <InputField
                        label="Przebieg (km)"
                        value={formData.mileage}
                        onChangeText={(text) => handleInputChange('mileage', text)}
                        placeholder="np. 45000"
                        keyboardType="numeric"
                        icon="straighten"
                    />
                </View>

                {/* Notatki */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notatki</Text>

                    <InputField
                        label="Dodatkowe informacje"
                        value={formData.notes}
                        onChangeText={(text) => handleInputChange('notes', text)}
                        placeholder="Wprowadź dodatkowe informacje o pojeździe..."
                        multiline={true}
                        icon="note"
                    />
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9ff',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
    },
    saveBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveBtnDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4a5568',
        marginBottom: 8,
    },
    inputContainer: {
        position: 'relative',
    },
    textInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#2d3748',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    textInputWithIcon: {
        paddingLeft: 48,
    },
    textInputMultiline: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    inputIcon: {
        position: 'absolute',
        left: 16,
        top: 12,
        zIndex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9ff',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#718096',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9ff',
        paddingHorizontal: 40,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#e53e3e',
        marginTop: 16,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    backButton: {
        backgroundColor: '#667eea',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 25,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    bottomSpacing: {
        height: 30,
    },
});