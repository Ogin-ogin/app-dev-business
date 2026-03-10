import * as admin from 'firebase-admin';

const globalForAdmin = globalThis as unknown as {
    adminApp: admin.app.App | undefined;
    adminDb: admin.firestore.Firestore | undefined;
    adminAuth: admin.auth.Auth | undefined;
};

function getAdminApp(): admin.app.App {
    if (globalForAdmin.adminApp) {
        return globalForAdmin.adminApp;
    }

    let serviceAccount: admin.ServiceAccount;

    const sdkKey = process.env.FIREBASE_ADMIN_SDK_KEY;
    if (sdkKey) {
        const parsed = JSON.parse(sdkKey);
        // Normalize private key: convert literal escape sequences to actual characters
        if (parsed.private_key) {
            parsed.private_key = parsed.private_key
                .replace(/\\r\\n/g, '\n')
                .replace(/\\r/g, '')
                .replace(/\\n/g, '\n');
        }
        serviceAccount = parsed;
    } else {
        const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        if (!credPath) {
            throw new Error('FIREBASE_ADMIN_SDK_KEY or GOOGLE_APPLICATION_CREDENTIALS must be set');
        }
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { readFileSync } = require('fs');
        serviceAccount = JSON.parse(readFileSync(credPath, 'utf8'));
    }

    globalForAdmin.adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    return globalForAdmin.adminApp;
}

// Lazy proxies — Firebase Admin is only initialized on first actual use (not at import time)
export const adminDb: admin.firestore.Firestore = new Proxy({} as admin.firestore.Firestore, {
    get(_, prop: string | symbol) {
        if (!globalForAdmin.adminDb) {
            globalForAdmin.adminDb = admin.firestore(getAdminApp());
        }
        return (globalForAdmin.adminDb as unknown as Record<string | symbol, unknown>)[prop];
    },
});

export const adminAuth: admin.auth.Auth = new Proxy({} as admin.auth.Auth, {
    get(_, prop: string | symbol) {
        if (!globalForAdmin.adminAuth) {
            globalForAdmin.adminAuth = admin.auth(getAdminApp());
        }
        return (globalForAdmin.adminAuth as unknown as Record<string | symbol, unknown>)[prop];
    },
});
