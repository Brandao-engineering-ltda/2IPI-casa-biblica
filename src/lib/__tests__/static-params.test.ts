import { getCourseStaticParams } from "../static-params";

// Mock Firebase modules
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({ name: "mock-app" })),
  getApps: jest.fn(() => []),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

import { getApps } from "firebase/app";
import { getDocs } from "firebase/firestore";

const mockGetApps = getApps as jest.Mock;
const mockGetDocs = getDocs as jest.Mock;

describe("getCourseStaticParams", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetApps.mockReturnValue([]);
  });

  it("returns course IDs from Firestore when available", async () => {
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [
        { id: "course-a" },
        { id: "course-b" },
      ],
    });

    const result = await getCourseStaticParams();
    expect(result).toEqual([{ id: "course-a" }, { id: "course-b" }]);
  });

  it("returns fallback IDs when Firestore snapshot is empty", async () => {
    mockGetDocs.mockResolvedValue({ empty: true, docs: [] });

    const result = await getCourseStaticParams();
    expect(result.length).toBe(8);
    expect(result[0]).toEqual({ id: "panorama-biblico" });
  });

  it("returns fallback IDs when Firestore throws an error", async () => {
    mockGetDocs.mockRejectedValue(new Error("Network error"));

    const result = await getCourseStaticParams();
    expect(result.length).toBe(8);
    expect(result[0]).toEqual({ id: "panorama-biblico" });
  });

  it("reuses existing Firebase app when already initialized", async () => {
    const existingApp = { name: "existing" };
    mockGetApps.mockReturnValue([existingApp]);
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [{ id: "reused-app-course" }],
    });

    const result = await getCourseStaticParams();
    expect(result).toEqual([{ id: "reused-app-course" }]);
  });
});
