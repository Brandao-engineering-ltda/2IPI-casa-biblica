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
