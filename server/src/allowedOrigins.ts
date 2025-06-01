/* eslint-disable prettier/prettier */
const allowedOrigins = [
    'http://localhost:4000', // Web frontend (np. React dev server)
    'http://localhost:8081', // Expo web w przeglądarce
    'http://192.168.0.101:8081', // Expo web na lokalnym IP
    'http://192.168.0.101:19006', // Expo web preview
    'exp://192.168.0.101:19000', // Expo Go (native app)
];

export default allowedOrigins;
