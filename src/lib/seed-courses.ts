import {
  saveCourse,
  saveModule,
  saveLesson,
  type CourseData,
  type ModuleData,
  type LessonData,
} from "./courses";

interface SeedLesson extends Omit<LessonData, "order"> {
  order: number;
}

interface SeedModule extends Omit<ModuleData, "order"> {
  order: number;
  lessons: SeedLesson[];
}

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
    startDateISO: "2026-02-10",
    endDate: "4 Mai 2026",
    endDateISO: "2026-05-04",
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
    startDateISO: "2026-05-11",
    endDate: "6 Jul 2026",
    endDateISO: "2026-07-06",
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
    startDateISO: "2026-07-13",
    endDate: "21 Set 2026",
    endDateISO: "2026-09-21",
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
    startDateISO: "2026-09-28",
    endDate: "18 Jan 2027",
    endDateISO: "2027-01-18",
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
    startDateISO: "2027-03-01",
    endDate: "21 Jun 2027",
    endDateISO: "2027-06-21",
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
    startDateISO: "2027-07-05",
    endDate: "30 Ago 2027",
    endDateISO: "2027-08-30",
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

// Placeholder video URL for seed data
const VIDEO_URL = "https://www.youtube.com/embed/eAvYmE2YYIU";

const defaultModules: Record<string, SeedModule[]> = {
  "panorama-biblico": [
    {
      id: "modulo-1",
      title: "Módulo 1: Pentateuco e Livros Históricos",
      order: 1,
      lessons: [
        {
          id: "aula-1",
          title: "Introdução ao Panorama Bíblico",
          duration: "30 min",
          type: "video",
          url: VIDEO_URL,
          description: "Visão geral da estrutura da Bíblia e a grande narrativa da redenção.",
          order: 1,
        },
        {
          id: "aula-2",
          title: "Gênesis a Deuteronômio",
          duration: "40 min",
          type: "video",
          url: VIDEO_URL,
          description: "Da criação à preparação para a conquista da terra prometida.",
          order: 2,
        },
        {
          id: "pdf-1",
          title: "Apostila: Linha do Tempo Bíblica",
          duration: "12 páginas",
          type: "pdf",
          url: "/materials/panorama-modulo1.pdf",
          description: "Material complementar com a cronologia dos eventos bíblicos.",
          order: 3,
        },
      ],
    },
    {
      id: "modulo-2",
      title: "Módulo 2: Poesia, Sabedoria e Profetas",
      order: 2,
      lessons: [
        {
          id: "aula-3",
          title: "Livros Poéticos e de Sabedoria",
          duration: "35 min",
          type: "video",
          url: VIDEO_URL,
          description: "Salmos, Provérbios, Jó, Eclesiastes e Cantares de Salomão.",
          order: 1,
        },
        {
          id: "aula-4",
          title: "Os Profetas do Antigo Testamento",
          duration: "40 min",
          type: "video",
          url: VIDEO_URL,
          description: "A mensagem dos profetas maiores e menores e sua relevância.",
          order: 2,
        },
      ],
    },
    {
      id: "modulo-3",
      title: "Módulo 3: O Novo Testamento",
      order: 3,
      lessons: [
        {
          id: "aula-5",
          title: "Os Evangelhos e Atos",
          duration: "35 min",
          type: "video",
          url: VIDEO_URL,
          description: "A vida de Jesus e o nascimento da igreja primitiva.",
          order: 1,
        },
        {
          id: "aula-6",
          title: "Epístolas e Apocalipse",
          duration: "40 min",
          type: "video",
          url: VIDEO_URL,
          description: "As cartas apostólicas e a visão escatológica do Apocalipse.",
          order: 2,
        },
        {
          id: "pdf-2",
          title: "Apostila: Mapa do Novo Testamento",
          duration: "10 páginas",
          type: "pdf",
          url: "/materials/panorama-modulo3.pdf",
          description: "Mapas e cronologia do período do Novo Testamento.",
          order: 3,
        },
      ],
    },
  ],

  "fundamentos-da-fe": [
    {
      id: "modulo-1",
      title: "Módulo 1: Introdução à Teologia",
      order: 1,
      lessons: [
        {
          id: "aula-1",
          title: "O que é Teologia?",
          duration: "25 min",
          type: "video",
          url: VIDEO_URL,
          description: "Introdução ao estudo da teologia e sua importância para a vida cristã.",
          order: 1,
        },
        {
          id: "aula-2",
          title: "As Fontes da Teologia",
          duration: "30 min",
          type: "video",
          url: VIDEO_URL,
          description: "Compreendendo as fontes primárias e secundárias da teologia.",
          order: 2,
        },
        {
          id: "pdf-1",
          title: "Apostila: Conceitos Básicos",
          duration: "15 páginas",
          type: "pdf",
          url: "/materials/fundamentos-modulo1.pdf",
          description: "Material complementar com definições e conceitos fundamentais.",
          order: 3,
        },
      ],
    },
    {
      id: "modulo-2",
      title: "Módulo 2: A Doutrina de Deus",
      order: 2,
      lessons: [
        {
          id: "aula-3",
          title: "Os Atributos de Deus",
          duration: "35 min",
          type: "video",
          url: VIDEO_URL,
          description: "Estudo dos atributos comunicáveis e incomunicáveis de Deus.",
          order: 1,
        },
        {
          id: "aula-4",
          title: "A Trindade",
          duration: "40 min",
          type: "video",
          url: VIDEO_URL,
          description: "Compreendendo a doutrina trinitariana nas Escrituras.",
          order: 2,
        },
        {
          id: "pdf-2",
          title: "Leitura: Confissão de Fé",
          duration: "20 páginas",
          type: "pdf",
          url: "/materials/fundamentos-modulo2.pdf",
          description: "Trechos selecionados da Confissão de Fé sobre Deus.",
          order: 3,
        },
      ],
    },
    {
      id: "modulo-3",
      title: "Módulo 3: A Doutrina da Salvação",
      order: 3,
      lessons: [
        {
          id: "aula-5",
          title: "O Pecado e suas Consequências",
          duration: "30 min",
          type: "video",
          url: VIDEO_URL,
          description: "Entendendo a queda da humanidade e suas implicações.",
          order: 1,
        },
        {
          id: "aula-6",
          title: "A Obra de Cristo",
          duration: "45 min",
          type: "video",
          url: VIDEO_URL,
          description: "A pessoa e obra redentora de Jesus Cristo.",
          order: 2,
        },
        {
          id: "aula-7",
          title: "Justificação pela Fé",
          duration: "35 min",
          type: "video",
          url: VIDEO_URL,
          description: "Como somos justificados diante de Deus.",
          order: 3,
        },
      ],
    },
  ],

  hermeneutica: [
    {
      id: "modulo-1",
      title: "Módulo 1: Introdução à Hermenêutica",
      order: 1,
      lessons: [
        {
          id: "aula-1",
          title: "História e Importância da Hermenêutica",
          duration: "30 min",
          type: "video",
          url: VIDEO_URL,
          description: "Introdução à ciência e arte da interpretação bíblica.",
          order: 1,
        },
        {
          id: "aula-2",
          title: "O Contexto Histórico e Cultural",
          duration: "35 min",
          type: "video",
          url: VIDEO_URL,
          description: "Compreendendo o mundo bíblico para uma interpretação fiel.",
          order: 2,
        },
      ],
    },
    {
      id: "modulo-2",
      title: "Módulo 2: Gêneros Literários",
      order: 2,
      lessons: [
        {
          id: "aula-3",
          title: "Narrativa e Lei",
          duration: "40 min",
          type: "video",
          url: VIDEO_URL,
          description: "Interpretando textos narrativos e legislativos do AT.",
          order: 1,
        },
        {
          id: "aula-4",
          title: "Poesia e Profecia",
          duration: "35 min",
          type: "video",
          url: VIDEO_URL,
          description: "Princípios para interpretar poesia hebraica e textos proféticos.",
          order: 2,
        },
      ],
    },
  ],

  "antigo-testamento": [
    {
      id: "modulo-1",
      title: "Módulo 1: Pentateuco — A Lei de Moisés",
      order: 1,
      lessons: [
        {
          id: "aula-1",
          title: "Introdução ao Pentateuco",
          duration: "35 min",
          type: "video",
          url: VIDEO_URL,
          description: "Visão geral dos cinco livros de Moisés e sua importância.",
          order: 1,
        },
        {
          id: "aula-2",
          title: "Gênesis: Criação e Queda",
          duration: "40 min",
          type: "video",
          url: VIDEO_URL,
          description: "Os primeiros capítulos de Gênesis e a origem da humanidade.",
          order: 2,
        },
      ],
    },
    {
      id: "modulo-2",
      title: "Módulo 2: Livros Históricos",
      order: 2,
      lessons: [
        {
          id: "aula-3",
          title: "A História de Israel",
          duration: "45 min",
          type: "video",
          url: VIDEO_URL,
          description: "De Josué aos Reis: a conquista, os juízes e a monarquia.",
          order: 1,
        },
        {
          id: "aula-4",
          title: "Exílio e Restauração",
          duration: "35 min",
          type: "video",
          url: VIDEO_URL,
          description: "O período do exílio babilônico e o retorno à terra prometida.",
          order: 2,
        },
      ],
    },
    {
      id: "modulo-3",
      title: "Módulo 3: Profetas e Poesia",
      order: 3,
      lessons: [
        {
          id: "aula-5",
          title: "Livros Poéticos e de Sabedoria",
          duration: "40 min",
          type: "video",
          url: VIDEO_URL,
          description: "Salmos, Provérbios, Jó e Eclesiastes: sabedoria e adoração.",
          order: 1,
        },
        {
          id: "aula-6",
          title: "Os Profetas Maiores e Menores",
          duration: "45 min",
          type: "video",
          url: VIDEO_URL,
          description: "A mensagem profética e sua relevância cristológica.",
          order: 2,
        },
      ],
    },
  ],

  "novo-testamento": [
    {
      id: "modulo-1",
      title: "Módulo 1: Evangelhos Sinóticos",
      order: 1,
      lessons: [
        {
          id: "aula-1",
          title: "Introdução aos Evangelhos",
          duration: "30 min",
          type: "video",
          url: VIDEO_URL,
          description: "O contexto histórico e a formação dos quatro Evangelhos.",
          order: 1,
        },
        {
          id: "aula-2",
          title: "Mateus, Marcos e Lucas",
          duration: "40 min",
          type: "video",
          url: VIDEO_URL,
          description: "Semelhanças e diferenças entre os Evangelhos Sinóticos.",
          order: 2,
        },
        {
          id: "aula-3",
          title: "O Evangelho de João",
          duration: "35 min",
          type: "video",
          url: VIDEO_URL,
          description: "A perspectiva teológica única do quarto Evangelho.",
          order: 3,
        },
      ],
    },
    {
      id: "modulo-2",
      title: "Módulo 2: Atos e Cartas Paulinas",
      order: 2,
      lessons: [
        {
          id: "aula-4",
          title: "Atos dos Apóstolos",
          duration: "40 min",
          type: "video",
          url: VIDEO_URL,
          description: "O nascimento e expansão da igreja primitiva.",
          order: 1,
        },
        {
          id: "aula-5",
          title: "As Grandes Epístolas de Paulo",
          duration: "45 min",
          type: "video",
          url: VIDEO_URL,
          description: "Romanos, Coríntios, Gálatas: a teologia paulina.",
          order: 2,
        },
        {
          id: "pdf-1",
          title: "Apostila: Viagens Missionárias de Paulo",
          duration: "15 páginas",
          type: "pdf",
          url: "/materials/nt-modulo2.pdf",
          description: "Mapas e cronologia das viagens missionárias do apóstolo Paulo.",
          order: 3,
        },
      ],
    },
    {
      id: "modulo-3",
      title: "Módulo 3: Cartas Gerais e Apocalipse",
      order: 3,
      lessons: [
        {
          id: "aula-6",
          title: "Hebreus, Tiago e Pedro",
          duration: "35 min",
          type: "video",
          url: VIDEO_URL,
          description: "As epístolas gerais e suas contribuições teológicas.",
          order: 1,
        },
        {
          id: "aula-7",
          title: "O Apocalipse de João",
          duration: "40 min",
          type: "video",
          url: VIDEO_URL,
          description: "Interpretação e mensagem do livro do Apocalipse.",
          order: 2,
        },
      ],
    },
  ],

  "lideranca-crista": [
    {
      id: "modulo-1",
      title: "Módulo 1: Fundamentos da Liderança Bíblica",
      order: 1,
      lessons: [
        {
          id: "aula-1",
          title: "Liderança Serva: O Modelo de Jesus",
          duration: "35 min",
          type: "video",
          url: VIDEO_URL,
          description: "Princípios de liderança extraídos do ministério de Cristo.",
          order: 1,
        },
        {
          id: "aula-2",
          title: "Líderes no Antigo Testamento",
          duration: "30 min",
          type: "video",
          url: VIDEO_URL,
          description: "Lições de Moisés, Josué, Davi e outros líderes bíblicos.",
          order: 2,
        },
        {
          id: "pdf-1",
          title: "Apostila: Perfil do Líder Cristão",
          duration: "10 páginas",
          type: "pdf",
          url: "/materials/lideranca-modulo1.pdf",
          description: "Qualificações bíblicas para líderes segundo 1 Timóteo e Tito.",
          order: 3,
        },
      ],
    },
    {
      id: "modulo-2",
      title: "Módulo 2: Liderança na Prática",
      order: 2,
      lessons: [
        {
          id: "aula-3",
          title: "Gestão de Ministérios na Igreja Local",
          duration: "40 min",
          type: "video",
          url: VIDEO_URL,
          description: "Como organizar e liderar ministérios de forma eficaz.",
          order: 1,
        },
        {
          id: "aula-4",
          title: "Discipulado e Formação de Novos Líderes",
          duration: "35 min",
          type: "video",
          url: VIDEO_URL,
          description: "Estratégias para multiplicar líderes na comunidade de fé.",
          order: 2,
        },
      ],
    },
  ],
};

export async function seedDefaultCourses(
  editorUid: string,
  editorEmail: string
): Promise<number> {
  let count = 0;
  for (const course of defaultCourses) {
    await saveCourse(course, editorUid, editorEmail, "Curso inicial (seed)");

    // Seed modules and lessons for this course
    const modules = defaultModules[course.id];
    if (modules) {
      for (const mod of modules) {
        await saveModule(course.id, { id: mod.id, title: mod.title, order: mod.order });
        for (const lesson of mod.lessons) {
          await saveLesson(course.id, mod.id, lesson);
        }
      }
    }

    count++;
  }
  return count;
}
