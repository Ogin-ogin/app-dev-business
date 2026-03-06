import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const adminKey = process.env.FIREBASE_ADMIN_SDK_KEY;
        if (!adminKey) {
            throw new Error('FIREBASE_ADMIN_SDK_KEY is not set in environment variables');
        }

        const serviceAccount = JSON.parse(adminKey);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            // projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // option
        });
        console.log('Firebase Admin initialized successfully.');
    } catch (error) {
        console.error('Firebase Admin initialization error', error);
    }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
