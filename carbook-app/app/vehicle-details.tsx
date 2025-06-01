import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as api from '../lib/api';

type VehicleDetails = {
    id: number;
    vin: string;
    brand?: string;
    model?: string;
    version?: string;
    engine?: string;
    first_registration?: string;
    custom_number: number;
    // Dodatkowe pola które mogą być dostępne w szczegółach
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
    last_inspection?: string;
    insurance_expiry?: string;
    technical_review_expiry?: string;
    notes?: string;
};

export default function VehicleDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVehicleDetails();
    }, []);

    const loadVehicleDetails = async () => {
        try {
            const vehicleId = params.vehicleId as string;

            // Jeśli mamy dane z poprzedniego ekranu, użyj ich jako fallback
            if (params.vehicleData) {
                const vehicleData = JSON.parse(params.vehicleData as string);
                setVehicle(vehicleData);
            }

            // Pobierz pełne szczegóły z API
            if (vehicleId) {
                const res = await api.fetchWithAuth(`/vehicles/${vehicleId}`);
                if (res.ok) {
                    const detailedVehicle = await res.json();
                    setVehicle(detailedVehicle);
                }
            }
        } catch (error) {
            console.error('Error loading vehicle details:', error);
            Alert.alert('Błąd', 'Nie udało się załadować szczegółów pojazdu');
        } finally {
            setLoading(false);
        }
    };

    const handleEditVehicle = () => {
        if (!vehicle) return;

        router.push({
            pathname: '/vehicle-edit',
            params: {
                vehicleId: vehicle.id.toString(),
                vehicleData: JSON.stringify(vehicle)
            }
        });
    };

    const handleDeleteVehicle = () => {
        if (!vehicle) return;

        Alert.alert(
            'Usuń pojazd',
            'Czy na pewno chcesz usunąć ten pojazd? Ta akcja jest nieodwracalna.',
            [
                { text: 'Anuluj', style: 'cancel' },
                {
                    text: 'Usuń',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const res = await api.fetchWithAuth(`/vehicles/${vehicle.id}`, {
                                method: 'DELETE'
                            });
                            if (res.ok) {
                                Alert.alert('Sukces', 'Pojazd został usunięty', [
                                    { text: 'OK', onPress: () => router.back() }
                                ]);
                            } else {
                                Alert.alert('Błąd', 'Nie udało się usunąć pojazdu');
                            }
                        } catch (error) {
                            Alert.alert('Błąd', 'Wystąpił błąd podczas usuwania pojazdu');
                        }
                    }
                }
            ]
        );
    };

    const getBrandIcon = (brand?: string) => {
        switch (brand?.toLowerCase()) {
            case 'bmw':
                return 'directions-car';
            case 'mercedes':
            case 'mercedes-benz':
                return 'directions-car';
            case 'audi':
                return 'directions-car';
            case 'volkswagen':
                return 'directions-car';
            default:
                return 'directions-car';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Brak danych';
        return new Date(dateString).toLocaleDateString('pl-PL');
    };

    const DetailRow = ({ icon, label, value }: { icon: string; label: string; value?: string | number }) => {
        if (!value) return null;

        return (
            <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                    <Icon name={icon} size={20} color="#667eea" />
                </View>
                <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>{label}</Text>
                    <Text style={styles.detailValue}>{value}</Text>
                </View>
            </View>
        );
    };

    const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Ładowanie szczegółów...</Text>
            </View>
        );
    }

    if (!vehicle) {
        return (
            <View style={styles.errorContainer}>
                <Icon name="error-outline" size={64} color="#e53e3e" />
                <Text style={styles.errorTitle}>Błąd</Text>
                <Text style={styles.errorText}>Nie udało się załadować szczegółów pojazdu</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Powrót</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>
                            {vehicle.brand} {vehicle.model}
                        </Text>
                        <Text style={styles.headerSubtitle}>#{vehicle.custom_number}</Text>
                    </View>
                    <View style={styles.headerIcon}>
                        <Icon name={getBrandIcon(vehicle.brand)} size={32} color="#fff" />
                    </View>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Podstawowe informacje */}
                <DetailSection title="Podstawowe informacje">
                    <DetailRow icon="fingerprint" label="VIN" value={vehicle.vin} />
                    <DetailRow icon="confirmation-number" label="Numer rejestracyjny" value={vehicle.license_plate} />
                    <DetailRow icon="palette" label="Kolor" value={vehicle.color} />
                    <DetailRow icon="event" label="Pierwsza rejestracja" value={formatDate(vehicle.first_registration)} />
                </DetailSection>

                {/* Dane techniczne */}
                <DetailSection title="Dane techniczne">
                    <DetailRow icon="settings" label="Silnik" value={vehicle.engine} />
                    <DetailRow icon="local-gas-station" label="Rodzaj paliwa" value={vehicle.fuel_type} />
                    <DetailRow icon="speed" label="Moc" value={vehicle.power} />
                    <DetailRow icon="tune" label="Pojemność" value={vehicle.displacement} />
                    <DetailRow icon="directions-car" label="Typ nadwozia" value={vehicle.body_type} />
                    <DetailRow icon="swap-horiz" label="Skrzynia biegów" value={vehicle.transmission} />
                    <DetailRow icon="compare-arrows" label="Napęd" value={vehicle.drive_type} />
                </DetailSection>

                {/* Szczegóły pojazdu */}
                <DetailSection title="Szczegóły pojazdu">
                    <DetailRow icon="sensor-door" label="Liczba drzwi" value={vehicle.doors} />
                    <DetailRow icon="event-seat" label="Liczba miejsc" value={vehicle.seats} />
                    <DetailRow icon="straighten" label="Przebieg" value={vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : undefined} />
                </DetailSection>

                {/* Dokumenty i przeglądy */}
                <DetailSection title="Dokumenty i przeglądy">
                    <DetailRow icon="fact-check" label="Ostatni przegląd" value={formatDate(vehicle.last_inspection)} />
                    <DetailRow icon="verified-user" label="Przegląd techniczny do" value={formatDate(vehicle.technical_review_expiry)} />
                    <DetailRow icon="security" label="Ubezpieczenie do" value={formatDate(vehicle.insurance_expiry)} />
                </DetailSection>

                {/* Notatki */}
                {vehicle.notes && (
                    <DetailSection title="Notatki">
                        <View style={styles.notesContainer}>
                            <Text style={styles.notesText}>{vehicle.notes}</Text>
                        </View>
                    </DetailSection>
                )}

                {/* Akcje */}
                <View style={styles.actionsSection}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleEditVehicle}>
                        <Icon name="edit" size={20} color="#667eea" />
                        <Text style={styles.actionButtonText}>Edytuj pojazd</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.dangerButton]}
                        onPress={handleDeleteVehicle}
                    >
                        <Icon name="delete" size={20} color="#e53e3e" />
                        <Text style={[styles.actionButtonText, styles.dangerButtonText]}>Usuń pojazd</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
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
    headerIcon: {
        width: 40,
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 16,
    },
    sectionContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    detailIcon: {
        width: 40,
        alignItems: 'center',
    },
    detailContent: {
        flex: 1,
        marginLeft: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        color: '#1e293b',
        fontWeight: '500',
    },
    notesContainer: {
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#667eea',
    },
    notesText: {
        fontSize: 14,
        color: '#4a5568',
        lineHeight: 20,
    },
    actionsSection: {
        marginTop: 8,
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#667eea',
        marginLeft: 8,
    },
    dangerButton: {
        borderWidth: 1,
        borderColor: '#fed7d7',
        backgroundColor: '#fef5f5',
    },
    dangerButtonText: {
        color: '#e53e3e',
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
        height: 20,
    },
});