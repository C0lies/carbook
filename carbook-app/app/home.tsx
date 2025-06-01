import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuth } from '../lib/authContext';
import Navbar from './components/Navbar';
import { useRouter } from 'expo-router';
import * as api from '../lib/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

type Vehicle = {
    id: number;
    vin: string;
    brand?: string;
    model?: string;
    version?: string;
    engine?: string;
    first_registration?: string;
    custom_number: number;
};

export default function MainScreen() {
    const { user, loading } = useAuth();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loadingVehicles, setLoadingVehicles] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/');
        }
    }, [user, loading]);

    const fetchVehicles = async () => {
        setLoadingVehicles(true);
        try {
            const res = await api.fetchWithAuth('/vehicles');
            if (res.ok) {
                setVehicles(await res.json());
            } else {
                setVehicles([]);
            }
        } catch {
            setVehicles([]);
        } finally {
            setLoadingVehicles(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchVehicles();
        setRefreshing(false);
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

    const renderVehicleItem = ({ item, index }: { item: Vehicle; index: number }) => (
        <TouchableOpacity
            style={[styles.vehicleCard, { marginTop: index === 0 ? 0 : 16 }]}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={['#ffffff', '#f8f9ff']}
                style={styles.cardGradient}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.brandSection}>
                        <View style={styles.iconContainer}>
                            <Icon
                                name={getBrandIcon(item.brand)}
                                size={24}
                                color="#667eea"
                            />
                        </View>
                        <View style={styles.brandInfo}>
                            <Text style={styles.brandText}>
                                {item.brand || 'Nieznana marka'}
                            </Text>
                            <Text style={styles.modelText}>
                                {item.model} {item.version}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.customNumberBadge}>
                        <Text style={styles.customNumberText}>
                            #{item.custom_number}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsSection}>
                    <View style={styles.detailRow}>
                        <Icon name="fingerprint" size={16} color="#8892b0" />
                        <Text style={styles.detailLabel}>VIN:</Text>
                        <Text style={styles.detailValue}>{item.vin}</Text>
                    </View>

                    {item.engine && (
                        <View style={styles.detailRow}>
                            <Icon name="settings" size={16} color="#8892b0" />
                            <Text style={styles.detailLabel}>Silnik:</Text>
                            <Text style={styles.detailValue}>{item.engine}</Text>
                        </View>
                    )}

                    <View style={styles.detailRow}>
                        <Icon name="event" size={16} color="#8892b0" />
                        <Text style={styles.detailLabel}>Rejestracja:</Text>
                        <Text style={styles.detailValue}>
                            {item.first_registration
                                ? new Date(item.first_registration).toLocaleDateString('pl-PL')
                                : 'Brak danych'
                            }
                        </Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="more-horiz" size={20} color="#667eea" />
                        <Text style={styles.actionButtonText}>Szczegóły</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <Navbar />

            <LinearGradient
                colors={['#f8f9ff', '#ffffff']}
                style={styles.contentContainer}
            >
                <View style={styles.headerSection}>
                    <Text style={styles.headerTitle}>Twoje pojazdy</Text>
                    <Text style={styles.headerSubtitle}>
                        {vehicles.length} {vehicles.length === 1 ? 'pojazd' : 'pojazdów'}
                    </Text>
                </View>

                {loadingVehicles ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#667eea" />
                        <Text style={styles.loadingText}>Ładowanie pojazdów...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={vehicles}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderVehicleItem}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#667eea']}
                                tintColor="#667eea"
                            />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Icon name="directions-car" size={64} color="#cbd5e0" />
                                <Text style={styles.emptyTitle}>Brak pojazdów</Text>
                                <Text style={styles.emptySubtitle}>
                                    Dodaj swój pierwszy pojazd, aby rozpocząć
                                </Text>
                                <TouchableOpacity style={styles.addButton}>
                                    <Icon name="add" size={20} color="#fff" />
                                    <Text style={styles.addButtonText}>Dodaj pojazd</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                )}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9ff',
    },
    contentContainer: {
        flex: 1,
    },
    headerSection: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#718096',
        fontWeight: '500',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    vehicleCard: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardGradient: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 16,
    },
    brandSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#eef4ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    brandInfo: {
        flex: 1,
    },
    brandText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 2,
    },
    modelText: {
        fontSize: 14,
        color: '#718096',
        fontWeight: '500',
    },
    customNumberBadge: {
        backgroundColor: '#667eea',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    customNumberText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginHorizontal: 20,
    },
    detailsSection: {
        padding: 20,
        paddingTop: 16,
        paddingBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: '#4a5568',
        fontWeight: '500',
        marginLeft: 8,
        marginRight: 8,
        minWidth: 80,
    },
    detailValue: {
        fontSize: 14,
        color: '#2d3748',
        flex: 1,
        fontWeight: '400',
    },
    cardFooter: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#eef4ff',
        borderRadius: 8,
    },
    actionButtonText: {
        color: '#667eea',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#718096',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4a5568',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#667eea',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});