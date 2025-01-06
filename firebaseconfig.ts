import { initializeApp } from 'firebase/app';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB4YWk-RjFaitdU10BSQw304L09ibshf94",
    authDomain: "cvsu-drive-b47b7.firebaseapp.com",
    projectId: "cvsu-drive-b47b7",
    storageBucket: "cvsu-drive-b47b7.firebasestorage.app",
    messagingSenderId: "1074064685269",
    appId: "1:1074064685269:web:eefd8a951d054031990a5c",
    measurementId: "G-KGYKZB6WYT"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Correctly initialize storage
export const storage: FirebaseStorage = getStorage(app);
