export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "pdf" | "text";
  url?: string;
  description: string;
  completed?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface CourseContent {
  id: string;
  titulo: string;
  descricao: string;
  professor: string;
  imagem: string;
  duracao: string;
  nivel: string;
  dataInicio: string;
  dataFim: string;
  modules: Module[];
}

export const coursesContent: Record<string, CourseContent> = {
  "fundamentos-da-fe": {
    id: "fundamentos-da-fe",
    titulo: "Fundamentos da Fé",
    descricao: "Estudo das doutrinas essenciais da fé cristã reformada. Base sólida para o crescimento espiritual.",
    professor: "Rev. João Silva",
    imagem: "/images/cursos/fundamentos-da-fe.jpg",
    duracao: "8 semanas",
    nivel: "Iniciante",
    dataInicio: "11 Mai 2026",
    dataFim: "6 Jul 2026",
    modules: [
      {
        id: "modulo-1",
        title: "Módulo 1: Introdução à Teologia",
        lessons: [
          {
            id: "aula-1",
            title: "O que é Teologia?",
            duration: "25 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Introdução ao estudo da teologia e sua importância para a vida cristã.",
            completed: false
          },
          {
            id: "aula-2",
            title: "As Fontes da Teologia",
            duration: "30 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Compreendendo as fontes primárias e secundárias da teologia.",
            completed: false
          },
          {
            id: "pdf-1",
            title: "Apostila: Conceitos Básicos",
            duration: "15 páginas",
            type: "pdf",
            url: "/materials/fundamentos-modulo1.pdf",
            description: "Material complementar com definições e conceitos fundamentais.",
            completed: false
          }
        ]
      },
      {
        id: "modulo-2",
        title: "Módulo 2: A Doutrina de Deus",
        lessons: [
          {
            id: "aula-3",
            title: "Os Atributos de Deus",
            duration: "35 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Estudo dos atributos comunicáveis e incomunicáveis de Deus.",
            completed: false
          },
          {
            id: "aula-4",
            title: "A Trindade",
            duration: "40 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Compreendendo a doutrina trinitariana nas Escrituras.",
            completed: false
          },
          {
            id: "pdf-2",
            title: "Leitura: Confissão de Fé",
            duration: "20 páginas",
            type: "pdf",
            url: "/materials/fundamentos-modulo2.pdf",
            description: "Trechos selecionados da Confissão de Fé sobre Deus.",
            completed: false
          }
        ]
      },
      {
        id: "modulo-3",
        title: "Módulo 3: A Doutrina da Salvação",
        lessons: [
          {
            id: "aula-5",
            title: "O Pecado e suas Consequências",
            duration: "30 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Entendendo a queda da humanidade e suas implicações.",
            completed: false
          },
          {
            id: "aula-6",
            title: "A Obra de Cristo",
            duration: "45 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "A pessoa e obra redentora de Jesus Cristo.",
            completed: false
          },
          {
            id: "aula-7",
            title: "Justificação pela Fé",
            duration: "35 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Como somos justificados diante de Deus.",
            completed: false
          }
        ]
      }
    ]
  },
  "teologia-sistematica": {
    id: "teologia-sistematica",
    titulo: "Teologia Sistemática",
    descricao: "Estudo aprofundado das principais doutrinas cristãs de forma organizada e sistemática.",
    professor: "Dr. Maria Santos",
    imagem: "/images/cursos/panorama-biblico.jpg",
    duracao: "12 semanas",
    nivel: "Intermediário",
    dataInicio: "14 Abr 2026",
    dataFim: "6 Jul 2026",
    modules: [
      {
        id: "modulo-1",
        title: "Módulo 1: Introdução à Teologia Sistemática",
        lessons: [
          {
            id: "aula-1",
            title: "Método Teológico",
            duration: "40 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Como fazer teologia de forma sistemática.",
            completed: false
          }
        ]
      }
    ]
  },
  "hermeneutica-biblica": {
    id: "hermeneutica-biblica",
    titulo: "Hermenêutica Bíblica",
    descricao: "Princípios e métodos para interpretação correta das Escrituras Sagradas.",
    professor: "Prof. Pedro Costa",
    imagem: "/images/cursos/hermeneutica.jpg",
    duracao: "10 semanas",
    nivel: "Intermediário",
    dataInicio: "20 Jun 2026",
    dataFim: "29 Ago 2026",
    modules: [
      {
        id: "modulo-1",
        title: "Módulo 1: Princípios de Interpretação",
        lessons: [
          {
            id: "aula-1",
            title: "Contexto Histórico",
            duration: "35 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "A importância do contexto histórico na interpretação.",
            completed: false
          }
        ]
      }
    ]
  },
  "hermeneutica": {
    id: "hermeneutica",
    titulo: "Hermenêutica Bíblica",
    descricao: "Aprenda princípios de interpretação bíblica para estudar as Escrituras com profundidade e fidelidade.",
    professor: "Rev. Maria Santos",
    imagem: "/images/cursos/hermeneutica.jpg",
    duracao: "10 semanas",
    nivel: "Intermediário",
    dataInicio: "13 Jul 2026",
    dataFim: "21 Set 2026",
    modules: [
      {
        id: "modulo-1",
        title: "Módulo 1: Introdução à Hermenêutica",
        lessons: [
          {
            id: "aula-1",
            title: "História e Importância da Hermenêutica",
            duration: "30 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Introdução à ciência e arte da interpretação bíblica.",
            completed: false
          },
          {
            id: "aula-2",
            title: "O Contexto Histórico e Cultural",
            duration: "35 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Compreendendo o mundo bíblico para uma interpretação fiel.",
            completed: false
          }
        ]
      },
      {
        id: "modulo-2",
        title: "Módulo 2: Gêneros Literários",
        lessons: [
          {
            id: "aula-3",
            title: "Narrativa e Lei",
            duration: "40 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Interpretando textos narrativos e legislativos do AT.",
            completed: false
          },
          {
            id: "aula-4",
            title: "Poesia e Profecia",
            duration: "35 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Princípios para interpretar poesia hebraica e textos proféticos.",
            completed: false
          }
        ]
      }
    ]
  },
  "antigo-testamento": {
    id: "antigo-testamento",
    titulo: "Antigo Testamento",
    descricao: "Estudo aprofundado dos livros do Antigo Testamento, seu contexto histórico e sua relevância hoje.",
    professor: "Rev. Pedro Oliveira",
    imagem: "/images/cursos/antigo-testamento.jpg",
    duracao: "16 semanas",
    nivel: "Intermediário",
    dataInicio: "28 Set 2026",
    dataFim: "18 Jan 2027",
    modules: [
      {
        id: "modulo-1",
        title: "Módulo 1: Pentateuco - A Lei de Moisés",
        lessons: [
          {
            id: "aula-1",
            title: "Introdução ao Pentateuco",
            duration: "35 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Visão geral dos cinco livros de Moisés e sua importância.",
            completed: false
          },
          {
            id: "aula-2",
            title: "Gênesis: Criação e Queda",
            duration: "40 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Os primeiros capítulos de Gênesis e a origem da humanidade.",
            completed: false
          }
        ]
      },
      {
        id: "modulo-2",
        title: "Módulo 2: Livros Históricos",
        lessons: [
          {
            id: "aula-3",
            title: "A História de Israel",
            duration: "45 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "De Josué aos Reis: a conquista, os juízes e a monarquia.",
            completed: false
          },
          {
            id: "aula-4",
            title: "Exílio e Restauração",
            duration: "35 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "O período do exílio babilônico e o retorno à terra prometida.",
            completed: false
          }
        ]
      },
      {
        id: "modulo-3",
        title: "Módulo 3: Profetas e Poesia",
        lessons: [
          {
            id: "aula-5",
            title: "Livros Poéticos e de Sabedoria",
            duration: "40 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Salmos, Provérbios, Jó e Eclesiastes: sabedoria e adoração.",
            completed: false
          },
          {
            id: "aula-6",
            title: "Os Profetas Maiores e Menores",
            duration: "45 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "A mensagem profética e sua relevância cristológica.",
            completed: false
          }
        ]
      }
    ]
  }
};

/** Get total lesson count for a course */
export function getTotalLessons(courseId: string): number {
  const course = coursesContent[courseId];
  if (!course) return 0;
  return course.modules.reduce((total, m) => total + m.lessons.length, 0);
}

/** Get all lesson IDs for a course */
export function getAllLessonIds(courseId: string): string[] {
  const course = coursesContent[courseId];
  if (!course) return [];
  return course.modules.flatMap(m => m.lessons.map(l => l.id));
}
