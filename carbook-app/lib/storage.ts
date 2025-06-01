
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';


let storage: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
};

if (Platform.OS === 'web') {
    storage = {
        getItem: async (key) => localStorage.getItem(key),
        setItem: async (key, value) => localStorage.setItem(key, value),
        removeItem: async (key) => localStorage.removeItem(key),
    };
} else {
    storage = {
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
    };
}

export default storage;
