"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import type { Plan } from "@/types/firestore";

interface UseSubscriptionResult {
  plan: Plan;
  loading: boolean;
}

export function useSubscription(): UseSubscriptionResult {
  const { currentUser } = useAuth();
  const [plan, setPlan] = useState<Plan>("FREE");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setPlan("FREE");
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setPlan((data.plan as Plan) || "FREE");
      } else {
        setPlan("FREE");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  return { plan, loading };
}
