// Reuse course IDs from the public curso layout for static export
const ALL_COURSE_IDS = [
  "fundamentos-da-fe",
  "hermeneutica",
  "antigo-testamento",
  "panorama-biblico",
  "novo-testamento",
  "lideranca-crista",
  "teologia-sistematica",
  "hermeneutica-biblica",
];

export function generateStaticParams() {
  return ALL_COURSE_IDS.map((id) => ({ id }));
}

export default function AdminCursoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
