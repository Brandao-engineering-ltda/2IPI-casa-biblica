// Simple storage utility for demo purposes
// In production, this would be replaced with proper API calls and database

export interface UserData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  sexo: string;
  estadoCivil: string;
  escolaridade: string;
  profissao: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  denominacao: string;
  comoConheceu: string;
  observacoes: string;
}

export interface PurchasedCourse {
  courseId: string;
  purchaseDate: string;
  paymentMethod: "pix" | "cartao";
  amount: number;
  status: "paid";
}

const USER_DATA_KEY = "casa_biblica_user_data";
const PURCHASED_COURSES_KEY = "casa_biblica_purchased_courses";

export function saveUserData(userData: UserData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }
}

export function getUserData(): UserData | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

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

export function clearUserData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(PURCHASED_COURSES_KEY);
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
