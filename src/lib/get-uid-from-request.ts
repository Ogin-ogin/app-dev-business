import { adminAuth } from './firebase-admin';

export async function getUidFromRequest(req: Request): Promise<string | null> {
    try {
        const cookieHeader = req.headers.get('cookie') || '';
        const sessionCookie = cookieHeader
            .split(';')
            .find(c => c.trim().startsWith('session='))
            ?.split('=')[1];
        if (!sessionCookie) return null;
        const decoded = await adminAuth.verifyIdToken(sessionCookie);
        return decoded.uid;
    } catch {
        return null;
    }
}
