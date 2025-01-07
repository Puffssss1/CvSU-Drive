// firebaseAdmin.ts
import admin from 'firebase-admin';

// Ensure Firebase is only initialized once
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Ensure proper formatting of private key
        }),
        storageBucket: "cvsu-drive-b47b7.appspot.com", // Specify your storage bucket name
    });
}

const db = admin.firestore();
const storage = admin.storage(); 
export { db, storage };
