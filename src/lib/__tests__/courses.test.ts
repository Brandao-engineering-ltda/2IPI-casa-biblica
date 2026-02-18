jest.mock('../firebase', () => ({ db: {} }));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
  deleteDoc: jest.fn(() => Promise.resolve()),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => 'mock-timestamp'),
}));

import {
  getAllCourses,
  getPublishedCourses,
  getCourse,
  saveCourse,
  deleteCourse,
  getCourseModules,
  getTotalLessonsFromModules,
  getAllLessonIdsFromModules,
  saveModule,
  deleteModule,
  saveLesson,
  deleteLesson,
  restoreCourseVersion,
  getCourseHistory,
  portugueseDateToISO,
  isoToPortugueseDate,
  type ModuleWithLessons,
} from '../courses';

const {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} = jest.requireMock('firebase/firestore') as {
  collection: jest.Mock;
  doc: jest.Mock;
  getDoc: jest.Mock;
  getDocs: jest.Mock;
  setDoc: jest.Mock;
  deleteDoc: jest.Mock;
  query: jest.Mock;
  where: jest.Mock;
  orderBy: jest.Mock;
};

// ---------------------------------------------------------------------------
// Helpers to build Firestore-like snapshot objects
// ---------------------------------------------------------------------------

function makeDocs(items: { id: string; data: Record<string, unknown> }[]) {
  return items.map((item) => ({
    id: item.id,
    data: () => item.data,
    ref: { id: item.id, path: `courses/${item.id}` },
  }));
}

function makeQuerySnapshot(items: { id: string; data: Record<string, unknown> }[]) {
  return { docs: makeDocs(items) };
}

function makeDocSnapshot(
  exists: boolean,
  id: string,
  data: Record<string, unknown> = {}
) {
  return {
    exists: () => exists,
    id,
    data: () => data,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();
});

// ---- getAllCourses ---------------------------------------------------------

describe('getAllCourses', () => {
  it('returns mapped course documents ordered by order', async () => {
    const courses = [
      { id: 'c1', data: { title: 'Course 1', order: 1, published: true } },
      { id: 'c2', data: { title: 'Course 2', order: 2, published: false } },
    ];

    getDocs.mockResolvedValueOnce(makeQuerySnapshot(courses));

    const result = await getAllCourses();

    expect(collection).toHaveBeenCalledWith({}, 'courses');
    expect(orderBy).toHaveBeenCalledWith('order', 'asc');
    expect(query).toHaveBeenCalled();
    expect(result).toEqual([
      { id: 'c1', title: 'Course 1', order: 1, published: true },
      { id: 'c2', title: 'Course 2', order: 2, published: false },
    ]);
  });

  it('returns an empty array when no courses exist', async () => {
    getDocs.mockResolvedValueOnce(makeQuerySnapshot([]));

    const result = await getAllCourses();

    expect(result).toEqual([]);
  });
});

// ---- getPublishedCourses --------------------------------------------------

describe('getPublishedCourses', () => {
  it('queries only published courses ordered by startDateISO', async () => {
    const courses = [
      { id: 'c1', data: { title: 'Published', order: 1, published: true } },
    ];

    getDocs.mockResolvedValueOnce(makeQuerySnapshot(courses));

    const result = await getPublishedCourses();

    expect(where).toHaveBeenCalledWith('published', '==', true);
    expect(orderBy).toHaveBeenCalledWith('startDateISO', 'asc');
    expect(query).toHaveBeenCalled();
    expect(result).toEqual([
      { id: 'c1', title: 'Published', order: 1, published: true },
    ]);
  });

  it('returns an empty array when no published courses exist', async () => {
    getDocs.mockResolvedValueOnce(makeQuerySnapshot([]));

    const result = await getPublishedCourses();

    expect(result).toEqual([]);
  });
});

// ---- getCourse ------------------------------------------------------------

describe('getCourse', () => {
  it('returns course data when the document exists', async () => {
    getDoc.mockResolvedValueOnce(
      makeDocSnapshot(true, 'c1', { title: 'Found', order: 1 })
    );

    const result = await getCourse('c1');

    expect(doc).toHaveBeenCalledWith({}, 'courses', 'c1');
    expect(result).toEqual({ id: 'c1', title: 'Found', order: 1 });
  });

  it('returns null when the document does not exist', async () => {
    getDoc.mockResolvedValueOnce(makeDocSnapshot(false, 'missing'));

    const result = await getCourse('missing');

    expect(result).toBeNull();
  });
});

// ---- saveCourse -----------------------------------------------------------

describe('saveCourse', () => {
  it('saves history snapshot then updates course when document already exists', async () => {
    const existingData = { title: 'Old Title', order: 1, published: true };

    // getDoc for existing course check
    getDoc.mockResolvedValueOnce(makeDocSnapshot(true, 'c1', existingData));

    const courseData = { id: 'c1', title: 'New Title', order: 1, published: true };

    await saveCourse(courseData, 'uid-123', 'editor@test.com', 'Updated title');

    // First setDoc call: history entry
    expect(setDoc).toHaveBeenCalledTimes(2);

    const historyCall = setDoc.mock.calls[0];
    expect(historyCall[1]).toEqual({
      snapshot: existingData,
      editedBy: 'uid-123',
      editedByEmail: 'editor@test.com',
      timestamp: 'mock-timestamp',
      changeDescription: 'Updated title',
    });

    // Second setDoc call: course update (merge)
    const courseCall = setDoc.mock.calls[1];
    expect(courseCall[1]).toEqual(
      expect.objectContaining({
        id: 'c1',
        title: 'New Title',
        updatedAt: 'mock-timestamp',
      })
    );
    // Existing doc should NOT have createdAt
    expect(courseCall[1].createdAt).toBeUndefined();
    expect(courseCall[2]).toEqual({ merge: true });
  });

  it('sets createdAt when creating a brand new course', async () => {
    // getDoc returns non-existing doc
    getDoc.mockResolvedValueOnce(makeDocSnapshot(false, 'new-course'));

    const courseData = { id: 'new-course', title: 'Brand New', order: 5 };

    await saveCourse(courseData, 'uid-456', 'creator@test.com', 'Initial creation');

    // Only the course setDoc call (no history since doc doesn't exist)
    expect(setDoc).toHaveBeenCalledTimes(1);

    const courseCall = setDoc.mock.calls[0];
    expect(courseCall[1]).toEqual(
      expect.objectContaining({
        id: 'new-course',
        title: 'Brand New',
        updatedAt: 'mock-timestamp',
        createdAt: 'mock-timestamp',
      })
    );
    expect(courseCall[2]).toEqual({ merge: true });
  });
});

// ---- deleteCourse ---------------------------------------------------------

describe('deleteCourse', () => {
  it('soft deletes by setting published to false', async () => {
    await deleteCourse('c1');

    expect(doc).toHaveBeenCalledWith({}, 'courses', 'c1');
    expect(setDoc).toHaveBeenCalledWith(
      undefined, // doc() returns undefined since it's mocked
      { published: false, updatedAt: 'mock-timestamp' },
      { merge: true }
    );
  });
});

// ---- getCourseModules -----------------------------------------------------

describe('getCourseModules', () => {
  it('fetches modules with their nested lessons', async () => {
    // First getDocs call: modules
    const modulesDocs = [
      { id: 'm1', data: { title: 'Module 1', order: 1 } },
      { id: 'm2', data: { title: 'Module 2', order: 2 } },
    ];
    getDocs.mockResolvedValueOnce(makeQuerySnapshot(modulesDocs));

    // Second getDocs call: lessons for module m1
    const lessonsM1 = [
      {
        id: 'l1',
        data: {
          title: 'Lesson 1',
          duration: '30min',
          type: 'video',
          url: 'https://example.com/1',
          description: 'Desc 1',
          order: 1,
        },
      },
    ];
    getDocs.mockResolvedValueOnce(makeQuerySnapshot(lessonsM1));

    // Third getDocs call: lessons for module m2
    const lessonsM2 = [
      {
        id: 'l2',
        data: {
          title: 'Lesson 2',
          duration: '45min',
          type: 'pdf',
          url: 'https://example.com/2',
          description: 'Desc 2',
          order: 1,
        },
      },
      {
        id: 'l3',
        data: {
          title: 'Lesson 3',
          duration: '20min',
          type: 'text',
          url: 'https://example.com/3',
          description: 'Desc 3',
          order: 2,
        },
      },
    ];
    getDocs.mockResolvedValueOnce(makeQuerySnapshot(lessonsM2));

    const result = await getCourseModules('c1');

    // Should call getDocs 3 times total: 1 for modules + 2 for lessons
    expect(getDocs).toHaveBeenCalledTimes(3);

    expect(result).toHaveLength(2);

    // Module 1 with 1 lesson
    expect(result[0]).toEqual({
      id: 'm1',
      title: 'Module 1',
      order: 1,
      lessons: [
        {
          id: 'l1',
          title: 'Lesson 1',
          duration: '30min',
          type: 'video',
          url: 'https://example.com/1',
          description: 'Desc 1',
          order: 1,
        },
      ],
    });

    // Module 2 with 2 lessons
    expect(result[1]).toEqual({
      id: 'm2',
      title: 'Module 2',
      order: 2,
      lessons: [
        {
          id: 'l2',
          title: 'Lesson 2',
          duration: '45min',
          type: 'pdf',
          url: 'https://example.com/2',
          description: 'Desc 2',
          order: 1,
        },
        {
          id: 'l3',
          title: 'Lesson 3',
          duration: '20min',
          type: 'text',
          url: 'https://example.com/3',
          description: 'Desc 3',
          order: 2,
        },
      ],
    });
  });

  it('returns empty array when no modules exist', async () => {
    getDocs.mockResolvedValueOnce(makeQuerySnapshot([]));

    const result = await getCourseModules('c1');

    expect(result).toEqual([]);
    // Only one getDocs call for modules; no lesson queries
    expect(getDocs).toHaveBeenCalledTimes(1);
  });
});

// ---- getTotalLessonsFromModules -------------------------------------------

describe('getTotalLessonsFromModules', () => {
  it('returns total lesson count across all modules', () => {
    const modules: ModuleWithLessons[] = [
      {
        id: 'm1',
        title: 'Mod 1',
        order: 1,
        lessons: [
          { id: 'l1', title: 'L1', duration: '10m', type: 'video', url: '', description: '', order: 1 },
          { id: 'l2', title: 'L2', duration: '10m', type: 'video', url: '', description: '', order: 2 },
        ],
      },
      {
        id: 'm2',
        title: 'Mod 2',
        order: 2,
        lessons: [
          { id: 'l3', title: 'L3', duration: '10m', type: 'pdf', url: '', description: '', order: 1 },
        ],
      },
    ];

    expect(getTotalLessonsFromModules(modules)).toBe(3);
  });

  it('returns 0 when there are no modules', () => {
    expect(getTotalLessonsFromModules([])).toBe(0);
  });

  it('returns 0 when modules have no lessons', () => {
    const modules: ModuleWithLessons[] = [
      { id: 'm1', title: 'Mod 1', order: 1, lessons: [] },
      { id: 'm2', title: 'Mod 2', order: 2, lessons: [] },
    ];

    expect(getTotalLessonsFromModules(modules)).toBe(0);
  });
});

// ---- getAllLessonIdsFromModules --------------------------------------------

describe('getAllLessonIdsFromModules', () => {
  it('returns all lesson ids across all modules', () => {
    const modules: ModuleWithLessons[] = [
      {
        id: 'm1',
        title: 'Mod 1',
        order: 1,
        lessons: [
          { id: 'l1', title: 'L1', duration: '10m', type: 'video', url: '', description: '', order: 1 },
          { id: 'l2', title: 'L2', duration: '10m', type: 'video', url: '', description: '', order: 2 },
        ],
      },
      {
        id: 'm2',
        title: 'Mod 2',
        order: 2,
        lessons: [
          { id: 'l3', title: 'L3', duration: '10m', type: 'text', url: '', description: '', order: 1 },
        ],
      },
    ];

    expect(getAllLessonIdsFromModules(modules)).toEqual(['l1', 'l2', 'l3']);
  });

  it('returns an empty array when there are no modules', () => {
    expect(getAllLessonIdsFromModules([])).toEqual([]);
  });

  it('returns an empty array when modules have no lessons', () => {
    const modules: ModuleWithLessons[] = [
      { id: 'm1', title: 'Mod 1', order: 1, lessons: [] },
    ];

    expect(getAllLessonIdsFromModules(modules)).toEqual([]);
  });
});

// ---- saveModule -----------------------------------------------------------

describe('saveModule', () => {
  it('saves module data at the correct Firestore path', async () => {
    const moduleData = { id: 'mod1', title: 'Introduction', order: 1 };

    await saveModule('c1', moduleData);

    expect(doc).toHaveBeenCalledWith({}, 'courses', 'c1', 'modules', 'mod1');
    expect(setDoc).toHaveBeenCalledWith(undefined, {
      title: 'Introduction',
      order: 1,
    });
  });

  it('does not include the id field in the persisted document data', async () => {
    const moduleData = { id: 'mod2', title: 'Advanced Topics', order: 3 };

    await saveModule('c1', moduleData);

    const persistedData = setDoc.mock.calls[0][1];
    expect(persistedData).toEqual({ title: 'Advanced Topics', order: 3 });
    expect(persistedData.id).toBeUndefined();
  });
});

// ---- deleteModule ---------------------------------------------------------

describe('deleteModule', () => {
  it('deletes all lessons then deletes the module document', async () => {
    const lessonDocs = [
      { id: 'l1', data: { title: 'L1' }, ref: { id: 'l1', path: 'courses/c1/modules/m1/lessons/l1' } },
      { id: 'l2', data: { title: 'L2' }, ref: { id: 'l2', path: 'courses/c1/modules/m1/lessons/l2' } },
    ];
    getDocs.mockResolvedValueOnce({
      docs: lessonDocs.map((d) => ({
        id: d.id,
        data: () => d.data,
        ref: d.ref,
      })),
    });

    await deleteModule('c1', 'm1');

    // Should fetch lessons subcollection
    expect(collection).toHaveBeenCalledWith({}, 'courses', 'c1', 'modules', 'm1', 'lessons');

    // Should delete each lesson via its ref
    expect(deleteDoc).toHaveBeenCalledTimes(3); // 2 lessons + 1 module
    expect(deleteDoc).toHaveBeenNthCalledWith(1, lessonDocs[0].ref);
    expect(deleteDoc).toHaveBeenNthCalledWith(2, lessonDocs[1].ref);

    // Should delete the module document itself
    expect(doc).toHaveBeenCalledWith({}, 'courses', 'c1', 'modules', 'm1');
    expect(deleteDoc).toHaveBeenNthCalledWith(3, undefined); // doc() returns undefined in mock
  });

  it('deletes only the module document when there are no lessons', async () => {
    getDocs.mockResolvedValueOnce({ docs: [] });

    await deleteModule('c1', 'm1');

    // Only one deleteDoc call for the module itself
    expect(deleteDoc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith({}, 'courses', 'c1', 'modules', 'm1');
  });
});

// ---- saveLesson -----------------------------------------------------------

describe('saveLesson', () => {
  it('saves lesson data at the correct nested Firestore path', async () => {
    const lessonData = {
      id: 'les1',
      title: 'What is the Bible?',
      duration: '45min',
      type: 'video' as const,
      url: 'https://example.com/video1',
      description: 'An introductory lesson',
      order: 1,
    };

    await saveLesson('c1', 'm1', lessonData);

    expect(doc).toHaveBeenCalledWith(
      {},
      'courses',
      'c1',
      'modules',
      'm1',
      'lessons',
      'les1'
    );
    expect(setDoc).toHaveBeenCalledWith(undefined, {
      title: 'What is the Bible?',
      duration: '45min',
      type: 'video',
      url: 'https://example.com/video1',
      description: 'An introductory lesson',
      order: 1,
    });
  });

  it('does not include the id field in the persisted document data', async () => {
    const lessonData = {
      id: 'les2',
      title: 'Lesson Two',
      duration: '30min',
      type: 'pdf' as const,
      url: 'https://example.com/pdf2',
      description: 'Second lesson',
      order: 2,
    };

    await saveLesson('c1', 'm1', lessonData);

    const persistedData = setDoc.mock.calls[0][1];
    expect(persistedData.id).toBeUndefined();
  });
});

// ---- deleteLesson ---------------------------------------------------------

describe('deleteLesson', () => {
  it('deletes the lesson document at the correct nested path', async () => {
    await deleteLesson('c1', 'm1', 'l1');

    expect(doc).toHaveBeenCalledWith(
      {},
      'courses',
      'c1',
      'modules',
      'm1',
      'lessons',
      'l1'
    );
    expect(deleteDoc).toHaveBeenCalledTimes(1);
    expect(deleteDoc).toHaveBeenCalledWith(undefined); // doc() returns undefined in mock
  });
});

// ---- restoreCourseVersion -------------------------------------------------

describe('restoreCourseVersion', () => {
  it('restores a course from a history snapshot via saveCourse', async () => {
    const historySnapshot = {
      title: 'Old Title',
      description: 'Old Desc',
      order: 1,
      published: true,
    };

    // First getDoc: history document lookup
    getDoc.mockResolvedValueOnce(
      makeDocSnapshot(true, 'hist1', {
        snapshot: historySnapshot,
        editedBy: 'prev-uid',
        editedByEmail: 'prev@test.com',
        timestamp: 'some-timestamp',
        changeDescription: 'Previous edit',
      })
    );

    // Second getDoc: inside saveCourse checking if course already exists
    getDoc.mockResolvedValueOnce(
      makeDocSnapshot(true, 'c1', { title: 'Current Title', order: 1 })
    );

    await restoreCourseVersion('c1', 'hist1', 'uid-restore', 'restore@test.com');

    // Should look up the history document
    expect(doc).toHaveBeenCalledWith({}, 'courses', 'c1', 'history', 'hist1');

    // saveCourse is called internally which triggers setDoc calls:
    // 1st setDoc: history entry (saving current state before restore)
    // 2nd setDoc: the actual course update with restored data
    expect(setDoc).toHaveBeenCalledTimes(2);

    // The course update should contain the restored snapshot data
    const courseUpdateCall = setDoc.mock.calls[1];
    expect(courseUpdateCall[1]).toEqual(
      expect.objectContaining({
        id: 'c1',
        title: 'Old Title',
        description: 'Old Desc',
        order: 1,
        published: true,
        updatedAt: 'mock-timestamp',
      })
    );

    // The history entry should reference the restoration
    const historyCall = setDoc.mock.calls[0];
    expect(historyCall[1]).toEqual(
      expect.objectContaining({
        editedBy: 'uid-restore',
        editedByEmail: 'restore@test.com',
        changeDescription: 'Restored from version hist1',
      })
    );
  });

  it('throws an error when the history version does not exist', async () => {
    getDoc.mockResolvedValueOnce(makeDocSnapshot(false, 'nonexistent'));

    await expect(
      restoreCourseVersion('c1', 'nonexistent', 'uid-1', 'user@test.com')
    ).rejects.toThrow('History version not found');

    // Should not attempt to save anything
    expect(setDoc).not.toHaveBeenCalled();
  });
});

// ---- getCourseHistory -----------------------------------------------------

describe('getCourseHistory', () => {
  it('returns history entries ordered by timestamp descending', async () => {
    const historyItems = [
      {
        id: 'h2',
        data: {
          snapshot: { title: 'Version 2' },
          editedBy: 'uid-2',
          editedByEmail: 'editor2@test.com',
          timestamp: 'ts-2',
          changeDescription: 'Second edit',
        },
      },
      {
        id: 'h1',
        data: {
          snapshot: { title: 'Version 1' },
          editedBy: 'uid-1',
          editedByEmail: 'editor1@test.com',
          timestamp: 'ts-1',
          changeDescription: 'First edit',
        },
      },
    ];

    getDocs.mockResolvedValueOnce(makeQuerySnapshot(historyItems));

    const result = await getCourseHistory('c1');

    expect(collection).toHaveBeenCalledWith({}, 'courses', 'c1', 'history');
    expect(orderBy).toHaveBeenCalledWith('timestamp', 'desc');
    expect(query).toHaveBeenCalled();

    expect(result).toEqual([
      {
        id: 'h2',
        snapshot: { title: 'Version 2' },
        editedBy: 'uid-2',
        editedByEmail: 'editor2@test.com',
        timestamp: 'ts-2',
        changeDescription: 'Second edit',
      },
      {
        id: 'h1',
        snapshot: { title: 'Version 1' },
        editedBy: 'uid-1',
        editedByEmail: 'editor1@test.com',
        timestamp: 'ts-1',
        changeDescription: 'First edit',
      },
    ]);
  });

  it('returns an empty array when there is no history', async () => {
    getDocs.mockResolvedValueOnce(makeQuerySnapshot([]));

    const result = await getCourseHistory('c1');

    expect(result).toEqual([]);
  });
});

// ---- portugueseDateToISO --------------------------------------------------

describe('portugueseDateToISO', () => {
  it('converts a standard Portuguese date to ISO format', () => {
    expect(portugueseDateToISO('10 Fev 2026')).toBe('2026-02-10');
  });

  it('pads single-digit days', () => {
    expect(portugueseDateToISO('4 Mai 2026')).toBe('2026-05-04');
  });

  it('handles all Portuguese month abbreviations', () => {
    expect(portugueseDateToISO('1 Jan 2026')).toBe('2026-01-01');
    expect(portugueseDateToISO('15 Mar 2026')).toBe('2026-03-15');
    expect(portugueseDateToISO('20 Abr 2026')).toBe('2026-04-20');
    expect(portugueseDateToISO('7 Jun 2026')).toBe('2026-06-07');
    expect(portugueseDateToISO('13 Jul 2026')).toBe('2026-07-13');
    expect(portugueseDateToISO('30 Ago 2026')).toBe('2026-08-30');
    expect(portugueseDateToISO('21 Set 2026')).toBe('2026-09-21');
    expect(portugueseDateToISO('10 Out 2026')).toBe('2026-10-10');
    expect(portugueseDateToISO('5 Nov 2026')).toBe('2026-11-05');
    expect(portugueseDateToISO('25 Dez 2026')).toBe('2026-12-25');
  });

  it('returns empty string for invalid format', () => {
    expect(portugueseDateToISO('')).toBe('');
    expect(portugueseDateToISO('invalid')).toBe('');
    expect(portugueseDateToISO('10-02-2026')).toBe('');
  });

  it('returns empty string for unknown month abbreviation', () => {
    expect(portugueseDateToISO('10 Xyz 2026')).toBe('');
  });
});

// ---- isoToPortugueseDate --------------------------------------------------

describe('isoToPortugueseDate', () => {
  it('converts an ISO date to Portuguese format', () => {
    expect(isoToPortugueseDate('2026-02-10')).toBe('10 Fev 2026');
  });

  it('strips leading zeros from the day', () => {
    expect(isoToPortugueseDate('2026-05-04')).toBe('4 Mai 2026');
  });

  it('handles all months', () => {
    expect(isoToPortugueseDate('2026-01-01')).toBe('1 Jan 2026');
    expect(isoToPortugueseDate('2026-03-15')).toBe('15 Mar 2026');
    expect(isoToPortugueseDate('2026-07-13')).toBe('13 Jul 2026');
    expect(isoToPortugueseDate('2026-12-25')).toBe('25 Dez 2026');
  });

  it('returns empty string for empty input', () => {
    expect(isoToPortugueseDate('')).toBe('');
  });
});
