import CoursePageClient from "./CoursePageClient";

export function generateStaticParams() {
  return [
    { id: "fundamentos-da-fe" },
    { id: "hermeneutica" },
    { id: "hermeneutica-biblica" },
    { id: "antigo-testamento" },
    { id: "panorama-biblico" },
    { id: "novo-testamento" },
    { id: "lideranca-crista" },
    { id: "teologia-sistematica" },
  ];
}

export default function CoursePage() {
  return <CoursePageClient />;
}
