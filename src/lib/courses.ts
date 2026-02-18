import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// --- Types ---

export interface CourseData {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  duration: string;
  level: string;
  startDate: string;
  endDate: string;
  status: "em-andamento" | "proximo" | "em-breve";
  image: string;
  instructor: string;
  totalHours: string;
  format: string;
  objectives: string[];
  syllabus: string[];
  requirements: string[];
  pricePix: number;
  priceCard: number;
  installments: number;
  order: number;
  published: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ModuleData {
  id: string;
  title: string;
  order: number;
}

export interface LessonData {
  id: string;
  title: string;
  duration: string;
  type: "video" | "pdf" | "text";
  url: string;
  description: string;
  order: number;
}

export interface ModuleWithLessons extends ModuleData {
  lessons: LessonData[];
}

export interface CourseHistory {
  id: string;
  snapshot: Partial<CourseData>;
  editedBy: string;
  editedByEmail: string;
  timestamp: Timestamp;
  changeDescription: string;
}

// --- Course CRUD ---

export async function getAllCourses(): Promise<CourseData[]> {
  const snap = await getDocs(
    query(collection(db, "courses"), orderBy("order", "asc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CourseData);
}

export async function getPublishedCourses(): Promise<CourseData[]> {
  const snap = await getDocs(
    query(
      collection(db, "courses"),
      where("published", "==", true),
      orderBy("order", "asc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CourseData);
}

export async function getCourse(courseId: string): Promise<CourseData | null> {
  const snap = await getDoc(doc(db, "courses", courseId));
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as CourseData;
  }
  return null;
}

export async function saveCourse(
  courseData: Partial<CourseData> & { id: string },
  editorUid: string,
  editorEmail: string,
  changeDescription: string
): Promise<void> {
  const courseRef = doc(db, "courses", courseData.id);

  // Save history snapshot before updating
  const existing = await getDoc(courseRef);
  if (existing.exists()) {
    await setDoc(doc(collection(db, "courses", courseData.id, "history")), {
      snapshot: existing.data(),
      editedBy: editorUid,
      editedByEmail: editorEmail,
      timestamp: serverTimestamp(),
      changeDescription,
    });
  }

  // Save/update the course
  await setDoc(
    courseRef,
    {
      ...courseData,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );
}

export async function deleteCourse(courseId: string): Promise<void> {
  // Soft delete: set published to false
  await setDoc(
    doc(db, "courses", courseId),
    { published: false, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

// --- Module CRUD ---

export async function getCourseModules(
  courseId: string
): Promise<ModuleWithLessons[]> {
  const modulesSnap = await getDocs(
    query(
      collection(db, "courses", courseId, "modules"),
      orderBy("order", "asc")
    )
  );

  const modules: ModuleWithLessons[] = [];
  for (const moduleDoc of modulesSnap.docs) {
    const moduleData = { id: moduleDoc.id, ...moduleDoc.data() } as ModuleData;
    const lessonsSnap = await getDocs(
      query(
        collection(
          db,
          "courses",
          courseId,
          "modules",
          moduleDoc.id,
          "lessons"
        ),
        orderBy("order", "asc")
      )
    );
    const lessons = lessonsSnap.docs.map(
      (l) => ({ id: l.id, ...l.data() }) as LessonData
    );
    modules.push({ ...moduleData, lessons });
  }

  return modules;
}

export async function saveModule(
  courseId: string,
  moduleData: ModuleData
): Promise<void> {
  await setDoc(doc(db, "courses", courseId, "modules", moduleData.id), {
    title: moduleData.title,
    order: moduleData.order,
  });
}

export async function deleteModule(
  courseId: string,
  moduleId: string
): Promise<void> {
  // Delete all lessons in the module first
  const lessonsSnap = await getDocs(
    collection(db, "courses", courseId, "modules", moduleId, "lessons")
  );
  for (const lessonDoc of lessonsSnap.docs) {
    await deleteDoc(lessonDoc.ref);
  }
  // Delete the module
  await deleteDoc(doc(db, "courses", courseId, "modules", moduleId));
}

export async function saveLesson(
  courseId: string,
  moduleId: string,
  lessonData: LessonData
): Promise<void> {
  await setDoc(
    doc(
      db,
      "courses",
      courseId,
      "modules",
      moduleId,
      "lessons",
      lessonData.id
    ),
    {
      title: lessonData.title,
      duration: lessonData.duration,
      type: lessonData.type,
      url: lessonData.url,
      description: lessonData.description,
      order: lessonData.order,
    }
  );
}

export async function deleteLesson(
  courseId: string,
  moduleId: string,
  lessonId: string
): Promise<void> {
  await deleteDoc(
    doc(db, "courses", courseId, "modules", moduleId, "lessons", lessonId)
  );
}

// --- History / Versioning ---

export async function getCourseHistory(
  courseId: string
): Promise<CourseHistory[]> {
  const snap = await getDocs(
    query(
      collection(db, "courses", courseId, "history"),
      orderBy("timestamp", "desc")
    )
  );
  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as CourseHistory
  );
}

export async function restoreCourseVersion(
  courseId: string,
  historyId: string,
  editorUid: string,
  editorEmail: string
): Promise<void> {
  const historySnap = await getDoc(
    doc(db, "courses", courseId, "history", historyId)
  );
  if (!historySnap.exists()) {
    throw new Error("History version not found");
  }

  const { snapshot } = historySnap.data() as CourseHistory;

  // Save current state as new history entry before restoring
  await saveCourse(
    { id: courseId, ...snapshot },
    editorUid,
    editorEmail,
    `Restored from version ${historyId}`
  );
}

// --- Utility ---

export function getTotalLessonsFromModules(
  modules: ModuleWithLessons[]
): number {
  return modules.reduce((total, m) => total + m.lessons.length, 0);
}

export function getAllLessonIdsFromModules(
  modules: ModuleWithLessons[]
): string[] {
  return modules.flatMap((m) => m.lessons.map((l) => l.id));
}
