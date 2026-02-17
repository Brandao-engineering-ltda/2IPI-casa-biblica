import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface UserData {
  nomeCompleto: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
  sexo?: string;
  estadoCivil?: string;
  escolaridade?: string;
  profissao?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  denominacao?: string;
  comoConheceu?: string;
  observacoes?: string;
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

// --- localStorage functions (courses & lessons) ---

const PURCHASED_COURSES_KEY = "casa_biblica_purchased_courses";

export function savePurchasedCourse(purchase: PurchasedCourse): void {
  if (typeof window !== "undefined") {
    const existing = getPurchasedCourses();
    const updated = [...existing, purchase];
    localStorage.setItem(PURCHASED_COURSES_KEY, JSON.stringify(updated));
  }
}

export function getPurchasedCourses(): PurchasedCourse[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(PURCHASED_COURSES_KEY);
    return data ? JSON.parse(data) : [];
  }
  return [];
}

export function isPurchased(courseId: string): boolean {
  const purchases = getPurchasedCourses();
  return purchases.some((p) => p.courseId === courseId);
}

export function clearLocalData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PURCHASED_COURSES_KEY);
    localStorage.removeItem(LESSON_PROGRESS_KEY);
  }
}

// Lesson progress tracking
const LESSON_PROGRESS_KEY = "casa_biblica_lesson_progress";

export function getCompletedLessons(courseId: string): Set<string> {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(LESSON_PROGRESS_KEY);
    const all: Record<string, string[]> = data ? JSON.parse(data) : {};
    return new Set(all[courseId] || []);
  }
  return new Set();
}

export function toggleLessonComplete(courseId: string, lessonId: string): boolean {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(LESSON_PROGRESS_KEY);
    const all: Record<string, string[]> = data ? JSON.parse(data) : {};
    const lessons = new Set(all[courseId] || []);

    if (lessons.has(lessonId)) {
      lessons.delete(lessonId);
    } else {
      lessons.add(lessonId);
    }

    all[courseId] = Array.from(lessons);
    localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(all));
    return lessons.has(lessonId);
  }
  return false;
}
