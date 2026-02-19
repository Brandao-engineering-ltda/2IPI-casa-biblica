import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface UserData {
  fullName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  maritalStatus?: string;
  education?: string;
  occupation?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  denomination?: string;
  referralSource?: string;
  notes?: string;
  photoURL?: string;
  authProvider?: string;
}

export interface PurchasedCourse {
  courseId: string;
  purchaseDate: string;
  paymentMethod: "pix" | "cartao";
  amount: number;
  status: "paid";
}

// --- Firestore user profile functions ---

export async function saveUserProfile(uid: string, userData: UserData): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    ...userData,
    createdAt: serverTimestamp(),
  }, { merge: true });
}

export async function getUserProfile(uid: string): Promise<UserData | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (snap.exists()) {
    return snap.data() as UserData;
  }
  return null;
}

// --- localStorage keys (used as offline cache) ---
const PURCHASED_COURSES_KEY = "casa_biblica_purchased_courses";
const LESSON_PROGRESS_KEY = "casa_biblica_lesson_progress";

// --- Purchase functions (Firestore-backed with localStorage cache) ---

export async function savePurchasedCourse(uid: string, purchase: PurchasedCourse): Promise<void> {
  // Save to Firestore
  await addDoc(collection(db, "users", uid, "purchases"), {
    ...purchase,
    createdAt: serverTimestamp(),
  });

  // Also save to localStorage cache
  if (typeof window !== "undefined") {
    const cached = getLocalPurchases(uid);
    cached.push(purchase);
    localStorage.setItem(purchaseCacheKey(uid), JSON.stringify(cached));
  }
}

export async function getPurchasedCourses(uid: string): Promise<PurchasedCourse[]> {
  try {
    const snap = await getDocs(collection(db, "users", uid, "purchases"));
    const purchases = snap.docs.map((d) => d.data() as PurchasedCourse);
    // Update localStorage cache
    if (typeof window !== "undefined") {
      localStorage.setItem(purchaseCacheKey(uid), JSON.stringify(purchases));
    }
    return purchases;
  } catch {
    // Firestore unavailable — fall back to localStorage cache
    return getLocalPurchases(uid);
  }
}

export async function isPurchased(uid: string, courseId: string): Promise<boolean> {
  const purchases = await getPurchasedCourses(uid);
  return purchases.some((p) => p.courseId === courseId);
}

// --- Lesson progress functions (Firestore-backed with localStorage cache) ---

export async function getCompletedLessons(uid: string, courseId: string): Promise<Set<string>> {
  try {
    const snap = await getDoc(doc(db, "users", uid, "progress", courseId));
    if (snap.exists()) {
      const data = snap.data();
      const lessons: string[] = data.completedLessons || [];
      // Update localStorage cache
      if (typeof window !== "undefined") {
        const all = getLocalProgress();
        all[`${uid}:${courseId}`] = lessons;
        localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(all));
      }
      return new Set(lessons);
    }
    return new Set();
  } catch {
    // Firestore unavailable — fall back to localStorage cache
    return getLocalCompletedLessons(uid, courseId);
  }
}

export async function toggleLessonComplete(uid: string, courseId: string, lessonId: string): Promise<boolean> {
  const completed = await getCompletedLessons(uid, courseId);

  if (completed.has(lessonId)) {
    completed.delete(lessonId);
  } else {
    completed.add(lessonId);
  }

  const lessonsArray = Array.from(completed);

  // Save to Firestore
  await setDoc(doc(db, "users", uid, "progress", courseId), {
    completedLessons: lessonsArray,
    lastAccessed: serverTimestamp(),
  }, { merge: true });

  // Update localStorage cache
  if (typeof window !== "undefined") {
    const all = getLocalProgress();
    all[`${uid}:${courseId}`] = lessonsArray;
    localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(all));
  }

  return completed.has(lessonId);
}

// --- Clear local data ---

export function clearLocalData(): void {
  if (typeof window !== "undefined") {
    // Clear all purchase and progress caches
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith("casa_biblica_purchases_") || key === LESSON_PROGRESS_KEY) {
        localStorage.removeItem(key);
      }
    }
    // Also clear legacy key
    localStorage.removeItem(PURCHASED_COURSES_KEY);
  }
}

// --- Internal helpers for localStorage cache ---

function purchaseCacheKey(uid: string): string {
  return `casa_biblica_purchases_${uid}`;
}

function getLocalPurchases(uid: string): PurchasedCourse[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(purchaseCacheKey(uid));
    if (data) return JSON.parse(data);
    // Fall back to legacy key (pre-migration data without uid)
    const legacy = localStorage.getItem(PURCHASED_COURSES_KEY);
    if (legacy) return JSON.parse(legacy);
  }
  return [];
}

function getLocalProgress(): Record<string, string[]> {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(LESSON_PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  }
  return {};
}

function getLocalCompletedLessons(uid: string, courseId: string): Set<string> {
  const all = getLocalProgress();
  // Try uid-scoped key first
  const scoped = all[`${uid}:${courseId}`];
  if (scoped) return new Set(scoped);
  // Fall back to legacy key (pre-migration data without uid)
  const legacy = all[courseId];
  if (legacy) return new Set(legacy);
  return new Set();
}
