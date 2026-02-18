import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Fetches the admin email whitelist from Firestore config/admin doc.
 * Falls back to NEXT_PUBLIC_ADMIN_EMAILS env var if Firestore doc doesn't exist.
 */
export async function getAdminEmails(): Promise<string[]> {
  try {
    const snap = await getDoc(doc(db, "config", "admin"));
    if (snap.exists()) {
      const data = snap.data();
      return (data.adminEmails as string[]) || [];
    }
  } catch {
    // Firestore unavailable, fall through to env fallback
  }

  // Fallback to env var (comma-separated emails)
  const envEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  if (envEmails) {
    return envEmails.split(",").map((e) => e.trim().toLowerCase());
  }

  return [];
}

/**
 * Checks if the given email is in the admin whitelist.
 */
export async function isAdminEmail(email: string): Promise<boolean> {
  const adminEmails = await getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}

/**
 * Checks if user's email is in admin whitelist and sets role on user doc.
 * Returns true if user is admin.
 */
export async function checkAndSetAdminRole(
  uid: string,
  email: string
): Promise<boolean> {
  const admin = await isAdminEmail(email);
  const role = admin ? "admin" : "user";

  await setDoc(
    doc(db, "users", uid),
    { role },
    { merge: true }
  );

  return admin;
}

/**
 * Updates the admin email whitelist in Firestore.
 */
export async function updateAdminEmails(emails: string[]): Promise<void> {
  await setDoc(doc(db, "config", "admin"), {
    adminEmails: emails.map((e) => e.trim().toLowerCase()),
  });
}
