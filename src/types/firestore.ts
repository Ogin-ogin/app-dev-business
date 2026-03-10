// Use a generic FirestoreTimestamp type compatible with both firebase-admin and firebase client SDK
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FirestoreTimestamp = { seconds: number; nanoseconds: number; toDate: () => Date } | any;

export type Plan = 'FREE' | 'STANDARD' | 'PRO';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  plan: Plan;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export interface Subscription {
  stripeCustomerId: string;
  stripePriceId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodEnd: FirestoreTimestamp;
  plan: Plan;
}

export interface Order {
  uid: string;
  productId: string;
  productName: string;
  amount: number;
  mode: 'payment' | 'subscription';
  status: 'pending' | 'completed' | 'failed';
  stripeSessionId: string;
  createdAt: FirestoreTimestamp;
}

export interface SnsPost {
  uid: string;
  topic: string;
  tone: string;
  generatedPosts: string[];
  editedPosts?: string[];
  isFavorite: boolean;
  isTemplate: boolean;
  templateName?: string;
  createdAt: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

export type FumanCategory = 'economy' | 'politics' | 'healthcare' | 'education' | 'work' | 'housing' | 'transport' | 'food' | 'service' | 'tech' | 'other';

export interface FumanPost {
  id?: string;
  uid: string;
  text: string;
  textHash: string;
  category: FumanCategory;
  sentiment: number; // -1.0 to 1.0
  keywords: string[];
  embedding: string; // base64 Float32Array
  aiEmpathy: string;
  empathyCount: number;
  source: 'user' | 'seed' | 'import' | 'voice';
  createdAt: FirestoreTimestamp;
}

export interface FumanEmpathy {
  postId: string;
  uid: string;
  createdAt: FirestoreTimestamp;
}

export interface FumanUmapCache {
  id: string;
  coordinates: string; // JSON string: [{id, x, y, category, sentiment}]
  count: number;
  computedAt: FirestoreTimestamp;
}

export interface FumanTrend {
  id: string; // date key '2026-03-10'
  categoryCounts: Record<string, number>;
  sentimentAvg: Record<string, number>;
  topKeywords: { word: string; count: number }[];
  totalPosts: number;
  computedAt: FirestoreTimestamp;
}
