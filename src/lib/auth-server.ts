import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";

/**
 * Verify the Firebase session token from cookies (server-side only).
 * Returns the decoded token or null if invalid/missing.
 */
export async function verifySession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(session);
    return decoded;
  } catch {
    return null;
  }
}
