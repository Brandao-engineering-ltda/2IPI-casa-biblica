import CoursePageClient from "./CoursePageClient";

export function generateStaticParams() {
  return [
    { id: "fundamentos-da-fe" },
    { id: "hermeneutica" },
    { id: "antigo-testamento" },
    { id: "panorama-biblico" },
    { id: "novo-testamento" },
    { id: "lideranca-crista" },
  ];
}

export default function CoursePage() {
  return <CoursePageClient />;
}
