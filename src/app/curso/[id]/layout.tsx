// Union of all course IDs used across curso pages (main, inscricao, conteudo)
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

export default function CursoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
