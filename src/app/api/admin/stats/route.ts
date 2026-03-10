import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Total users
        const usersSnap = await adminDb.collection('users').count().get();
        const totalUsers = usersSnap.data().count;

        // All orders
        const ordersSnap = await adminDb.collection('orders').get();
        const allOrders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Array<{
            id: string;
            createdAt?: { toDate?: () => Date } | string;
            amount?: number;
        }>;

        // This month's orders
        const thisMonthOrders = allOrders.filter(order => {
            const createdAt = order.createdAt;
            if (!createdAt) return false;
            const date = typeof createdAt === 'string'
                ? new Date(createdAt)
                : createdAt.toDate?.() ?? new Date(0);
            return date >= startOfMonth;
        });

        const monthlyOrderCount = thisMonthOrders.length;
        const monthlyRevenue = thisMonthOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

        // Total feedbacks
        const feedbacksSnap = await adminDb.collection('feedbacks').count().get();
        const totalFeedbacks = feedbacksSnap.data().count;

        return NextResponse.json({
            totalUsers,
            monthlyOrderCount,
            monthlyRevenue,
            totalFeedbacks,
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
