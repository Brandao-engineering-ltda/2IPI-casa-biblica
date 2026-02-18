import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  collectionGroup,
} from "firebase/firestore";
import { db } from "./firebase";
import { getAllCourses } from "./courses";

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

// --- Enrollment types and queries ---

export interface EnrolledUser {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  purchaseDate: string;
  paymentMethod: string;
  amount: number;
  status: string;
}

export interface CourseEnrollments {
  courseId: string;
  courseTitle: string;
  enrollments: EnrolledUser[];
}

/**
 * Fetches all enrollments grouped by course.
 * Uses collectionGroup query on "purchases" subcollection,
 * then fetches user profiles for each unique uid.
 */
export async function getEnrollmentsByCourse(): Promise<CourseEnrollments[]> {
  // Fetch all purchases across all users
  const purchasesSnap = await getDocs(collectionGroup(db, "purchases"));

  // Build a map of uid -> purchases, extracting uid from doc path
  const purchasesByUid = new Map<
    string,
    Array<{ courseId: string; purchaseDate: string; paymentMethod: string; amount: number; status: string }>
  >();

  for (const purchaseDoc of purchasesSnap.docs) {
    // Path: users/{uid}/purchases/{purchaseId}
    const pathSegments = purchaseDoc.ref.path.split("/");
    const uid = pathSegments[1];
    const data = purchaseDoc.data();

    if (!purchasesByUid.has(uid)) {
      purchasesByUid.set(uid, []);
    }
    purchasesByUid.get(uid)!.push({
      courseId: data.courseId || "",
      purchaseDate: data.purchaseDate || "",
      paymentMethod: data.paymentMethod || "",
      amount: data.amount || 0,
      status: data.status || "",
    });
  }

  // Fetch user profiles in parallel
  const uids = Array.from(purchasesByUid.keys());
  const profilePromises = uids.map(async (uid) => {
    const userSnap = await getDoc(doc(db, "users", uid));
    const data = userSnap.exists() ? userSnap.data() : {};
    return {
      uid,
      fullName: (data.fullName as string) || "",
      email: (data.email as string) || "",
      phone: (data.phone as string) || "",
    };
  });
  const profiles = await Promise.all(profilePromises);
  const profileMap = new Map(profiles.map((p) => [p.uid, p]));

  // Group by courseId
  const enrollmentMap = new Map<string, EnrolledUser[]>();
  for (const [uid, purchases] of purchasesByUid) {
    const profile = profileMap.get(uid)!;
    for (const purchase of purchases) {
      if (!enrollmentMap.has(purchase.courseId)) {
        enrollmentMap.set(purchase.courseId, []);
      }
      enrollmentMap.get(purchase.courseId)!.push({
        uid,
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        purchaseDate: purchase.purchaseDate,
        paymentMethod: purchase.paymentMethod,
        amount: purchase.amount,
        status: purchase.status,
      });
    }
  }

  // Merge with course titles
  const courses = await getAllCourses();
  const courseTitleMap = new Map(courses.map((c) => [c.id, c.title]));

  const result: CourseEnrollments[] = [];
  for (const [courseId, enrollments] of enrollmentMap) {
    result.push({
      courseId,
      courseTitle: courseTitleMap.get(courseId) || courseId,
      enrollments: enrollments.sort(
        (a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
      ),
    });
  }

  // Sort courses by title
  result.sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));

  return result;
}
