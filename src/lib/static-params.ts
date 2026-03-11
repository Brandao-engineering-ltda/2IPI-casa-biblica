import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const FALLBACK_IDS = [
  "panorama-biblico",
  "fundamentos-da-fe",
  "hermeneutica",
  "antigo-testamento",
  "novo-testamento",
  "lideranca-crista",
  "teologia-sistematica",
  "hermeneutica-biblica",
];

/**
 * Fetch course IDs from Firestore for generateStaticParams.
 *
 * Initialises Firebase independently of the client-side firebase.ts
 * so it works in the Node.js context where generateStaticParams runs.
 * Falls back to a hardcoded list if Firestore is unreachable.
 */
export async function getCourseStaticParams(): Promise<{ id: string }[]> {
  try {
    const app =
      getApps().length === 0
        ? initializeApp({
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          })
        : getApps()[0];
    const db = getFirestore(app);
    const snapshot = await getDocs(collection(db, "courses"));
    if (snapshot.empty) return FALLBACK_IDS.map((id) => ({ id }));
    return snapshot.docs.map((doc) => ({ id: doc.id }));
  } catch {
    return FALLBACK_IDS.map((id) => ({ id }));
  }
}
