import { saveCourse, type CourseData } from "./courses";

const defaultCourses: Omit<CourseData, "createdAt" | "updatedAt">[] = [
  {
    id: "panorama-biblico",
    title: "Panorama Bíblico",
    description:
      "Uma visão geral de toda a Bíblia, do Gênesis ao Apocalipse. Entenda a grande narrativa das Escrituras.",
    fullDescription:
      "Uma visão geral de toda a Bíblia, do Gênesis ao Apocalipse. Entenda a grande narrativa das Escrituras.",
    duration: "12 semanas",
    level: "Iniciante",
    startDate: "10 Fev 2026",
    endDate: "4 Mai 2026",
    status: "em-andamento",
    image: "/images/courses/panorama-biblico.jpg",
    instructor: "",
    totalHours: "",
    format: "Online ao vivo",
    objectives: [],
    syllabus: [],
    requirements: [],
    pricePix: 0,
    priceCard: 0,
    installments: 3,
    order: 1,
    published: true,
  },
  {
    id: "fundamentos-da-fe",
    title: "Fundamentos da Fé",
    description:
      "Estudo das doutrinas essenciais da fé cristã reformada. Base sólida para o crescimento espiritual.",
    fullDescription:
      "Estudo das doutrinas essenciais da fé cristã reformada. Base sólida para o crescimento espiritual.",
    duration: "8 semanas",
    level: "Iniciante",
    startDate: "11 Mai 2026",
    endDate: "6 Jul 2026",
    status: "proximo",
    image: "/images/courses/fundamentos-da-fe.jpg",
    instructor: "",
    totalHours: "",
    format: "Online ao vivo",
    objectives: [],
    syllabus: [],
    requirements: [],
    pricePix: 0,
    priceCard: 0,
    installments: 3,
    order: 2,
    published: true,
  },
  {
    id: "hermeneutica",
    title: "Hermenêutica Bíblica",
    description:
      "Aprenda princípios de interpretação bíblica para estudar as Escrituras com profundidade e fidelidade.",
    fullDescription:
      "Aprenda princípios de interpretação bíblica para estudar as Escrituras com profundidade e fidelidade.",
    duration: "10 semanas",
    level: "Intermediário",
    startDate: "13 Jul 2026",
    endDate: "21 Set 2026",
    status: "em-breve",
    image: "/images/courses/hermeneutica.jpg",
    instructor: "",
    totalHours: "",
    format: "Online ao vivo",
    objectives: [],
    syllabus: [],
    requirements: [],
    pricePix: 0,
    priceCard: 0,
    installments: 3,
    order: 3,
    published: true,
  },
  {
    id: "antigo-testamento",
    title: "Antigo Testamento",
    description:
      "Estudo aprofundado dos livros do Antigo Testamento, seu contexto histórico e sua relevância hoje.",
    fullDescription:
      "Estudo aprofundado dos livros do Antigo Testamento, seu contexto histórico e sua relevância hoje.",
    duration: "16 semanas",
    level: "Intermediário",
    startDate: "28 Set 2026",
    endDate: "18 Jan 2027",
    status: "em-breve",
    image: "/images/courses/antigo-testamento.jpg",
    instructor: "",
    totalHours: "",
    format: "Online ao vivo",
    objectives: [],
    syllabus: [],
    requirements: [],
    pricePix: 0,
    priceCard: 0,
    installments: 3,
    order: 4,
    published: true,
  },
  {
    id: "novo-testamento",
    title: "Novo Testamento",
    description:
      "Explore os Evangelhos, Atos, as Epístolas e o Apocalipse com profundidade teológica e aplicação prática.",
    fullDescription:
      "Explore os Evangelhos, Atos, as Epístolas e o Apocalipse com profundidade teológica e aplicação prática.",
    duration: "16 semanas",
    level: "Intermediário",
    startDate: "1 Mar 2027",
    endDate: "21 Jun 2027",
    status: "em-breve",
    image: "/images/courses/novo-testamento.jpg",
    instructor: "",
    totalHours: "",
    format: "Online ao vivo",
    objectives: [],
    syllabus: [],
    requirements: [],
    pricePix: 0,
    priceCard: 0,
    installments: 3,
    order: 5,
    published: true,
  },
  {
    id: "lideranca-crista",
    title: "Liderança Cristã",
    description:
      "Formação de líderes servos segundo o modelo bíblico. Para quem deseja servir na igreja local.",
    fullDescription:
      "Formação de líderes servos segundo o modelo bíblico. Para quem deseja servir na igreja local.",
    duration: "8 semanas",
    level: "Avançado",
    startDate: "5 Jul 2027",
    endDate: "30 Ago 2027",
    status: "em-breve",
    image: "/images/courses/lideranca-crista.jpg",
    instructor: "",
    totalHours: "",
    format: "Online ao vivo",
    objectives: [],
    syllabus: [],
    requirements: [],
    pricePix: 0,
    priceCard: 0,
    installments: 3,
    order: 6,
    published: true,
  },
];

export async function seedDefaultCourses(
  editorUid: string,
  editorEmail: string
): Promise<number> {
  let count = 0;
  for (const course of defaultCourses) {
    await saveCourse(course, editorUid, editorEmail, "Curso inicial (seed)");
    count++;
  }
  return count;
}
