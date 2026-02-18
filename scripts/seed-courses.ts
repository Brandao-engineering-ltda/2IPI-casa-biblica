/**
 * Seed script: Populates Firestore with course data from the hardcoded sources.
 *
 * Merges data from:
 *   - CoursePageClient.tsx (course details, objectives, syllabus, requirements)
 *   - inscricao/page.tsx (pricing: pricePix, priceCard, installments)
 *   - courseContent.ts (modules + lessons)
 *
 * Usage:
 *   npx tsx scripts/seed-courses.ts
 *
 * Requires: NEXT_PUBLIC_FIREBASE_* env vars in .env.local
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { config } from "dotenv";

// Load .env.local
config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ──────────────────────────────────────────────────
// Course detail data (from CoursePageClient.tsx)
// ──────────────────────────────────────────────────

interface CourseDetail {
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
}

const courseDetails: Record<string, CourseDetail> = {
  "fundamentos-da-fe": {
    id: "fundamentos-da-fe",
    title: "Fundamentos da Fé",
    description: "Estudo das doutrinas essenciais da fé cristã reformada. Base sólida para o crescimento espiritual.",
    fullDescription: "Este curso oferece uma jornada profunda pelas doutrinas fundamentais da fé cristã, explorando os pilares da teologia reformada e sua aplicação prática na vida do cristão. Através de um estudo sistemático das Escrituras, os alunos desenvolverão uma compreensão sólida da natureza de Deus, da salvação em Cristo, e do papel do Espírito Santo na vida do crente.",
    duration: "8 semanas",
    level: "Iniciante",
    startDate: "11 Mai 2026",
    endDate: "6 Jul 2026",
    status: "proximo",
    image: "/images/cursos/fundamentos-da-fe.jpg",
    instructor: "Rev. João Silva",
    totalHours: "24 horas",
    format: "Presencial - Quartas-feiras às 19h30",
    objectives: [
      "Compreender as doutrinas essenciais da fé cristã",
      "Desenvolver uma base teológica sólida",
      "Aplicar os fundamentos bíblicos na vida diária",
      "Conhecer a história da igreja e suas confissões",
      "Fortalecer a identidade cristã reformada",
    ],
    syllabus: [
      "Semana 1: A Revelação de Deus - A Escritura Sagrada",
      "Semana 2: A Natureza de Deus - Trindade e Atributos Divinos",
      "Semana 3: A Criação e a Queda - O Pecado e suas Consequências",
      "Semana 4: A Pessoa e Obra de Cristo - Encarnação e Redenção",
      "Semana 5: A Salvação pela Graça - Justificação e Santificação",
      "Semana 6: O Espírito Santo - Sua Obra e Dons",
      "Semana 7: A Igreja - Sua Natureza e Missão",
      "Semana 8: As Últimas Coisas - Escatologia e Esperança Cristã",
    ],
    requirements: [
      "Não há pré-requisitos",
      "Compromisso com a leitura semanal",
      "Participação ativa nas aulas",
    ],
  },
  "teologia-sistematica": {
    id: "teologia-sistematica",
    title: "Teologia Sistemática",
    description: "Estudo aprofundado das principais doutrinas cristãs de forma organizada e sistemática.",
    fullDescription: "A Teologia Sistemática oferece uma compreensão organizada e abrangente das principais doutrinas cristãs. Este curso explora sistematicamente a revelação de Deus nas Escrituras, organizando os ensinamentos bíblicos em categorias teológicas claras e aplicáveis à vida cristã.",
    duration: "12 semanas",
    level: "Intermediário",
    startDate: "14 Abr 2026",
    endDate: "6 Jul 2026",
    status: "proximo",
    image: "/images/cursos/panorama-biblico.jpg",
    instructor: "Rev. Roberto Alves",
    totalHours: "36 horas",
    format: "Presencial - Sextas-feiras às 19h30",
    objectives: [
      "Compreender as principais doutrinas cristãs sistematicamente",
      "Organizar o conhecimento teológico de forma lógica",
      "Aplicar as doutrinas à vida prática do cristão",
      "Desenvolver uma cosmovisão bíblica consistente",
      "Preparar-se para o ministério teológico",
    ],
    syllabus: [
      "Semana 1: Introdução à Teologia Sistemática - Método e Fontes",
      "Semana 2: Bibliologia - A Doutrina da Escritura",
      "Semana 3: Teologia Própria - A Doutrina de Deus",
      "Semana 4: Cristologia - A Doutrina de Cristo",
      "Semana 5: Pneumatologia - A Doutrina do Espírito Santo",
      "Semana 6: Antropologia - A Doutrina do Homem",
      "Semana 7: Hamartiologia - A Doutrina do Pecado",
      "Semana 8: Soteriologia - A Doutrina da Salvação",
      "Semana 9: Eclesiologia - A Doutrina da Igreja",
      "Semana 10: Escatologia - A Doutrina das Últimas Coisas",
      "Semana 11: Angelologia e Demonologia",
      "Semana 12: Integração Sistemática - Aplicação Prática",
    ],
    requirements: [
      "Ter concluído 'Fundamentos da Fé'",
      "Conhecimento básico da Bíblia",
      "Disposição para estudo teológico aprofundado",
    ],
  },
  "hermeneutica": {
    id: "hermeneutica",
    title: "Hermenêutica Bíblica",
    description: "Aprenda princípios de interpretação bíblica para estudar as Escrituras com profundidade e fidelidade.",
    fullDescription: "A Hermenêutica Bíblica é a ciência e arte de interpretar as Escrituras Sagradas. Neste curso, você aprenderá os princípios fundamentais para uma interpretação correta e responsável da Palavra de Deus, considerando o contexto histórico, cultural, literário e teológico de cada passagem.",
    duration: "10 semanas",
    level: "Intermediário",
    startDate: "13 Jul 2026",
    endDate: "21 Set 2026",
    status: "em-breve",
    image: "/images/cursos/hermeneutica.jpg",
    instructor: "Rev. Maria Santos",
    totalHours: "30 horas",
    format: "Híbrido - Segundas-feiras às 20h",
    objectives: [
      "Dominar os princípios de interpretação bíblica",
      "Compreender diferentes gêneros literários da Bíblia",
      "Aplicar métodos exegéticos corretos",
      "Evitar erros comuns de interpretação",
      "Desenvolver habilidades de estudo bíblico pessoal",
    ],
    syllabus: [
      "Semana 1: Introdução à Hermenêutica - História e Importância",
      "Semana 2: O Contexto Histórico e Cultural",
      "Semana 3: Análise Gramatical e Sintática",
      "Semana 4: Gêneros Literários - Narrativa e Lei",
      "Semana 5: Gêneros Literários - Poesia e Sabedoria",
      "Semana 6: Gêneros Literários - Profecia",
      "Semana 7: Interpretação de Parábolas e Alegorias",
      "Semana 8: Tipologia e Simbolismo",
      "Semana 9: Teologia Bíblica e Interpretação Cristológica",
      "Semana 10: Aplicação Prática - Do Texto ao Sermão",
    ],
    requirements: [
      "Conhecimento básico da Bíblia",
      "Ter concluído 'Fundamentos da Fé' ou equivalente",
      "Disposição para leitura aprofundada",
    ],
  },
  "hermeneutica-biblica": {
    id: "hermeneutica-biblica",
    title: "Hermenêutica Bíblica",
    description: "Princípios e métodos para interpretação correta das Escrituras Sagradas.",
    fullDescription: "A Hermenêutica Bíblica é a ciência e arte de interpretar as Escrituras Sagradas. Neste curso, você aprenderá os princípios fundamentais para uma interpretação correta e responsável da Palavra de Deus, considerando o contexto histórico, cultural, literário e teológico de cada passagem.",
    duration: "10 semanas",
    level: "Intermediário",
    startDate: "20 Jun 2026",
    endDate: "29 Ago 2026",
    status: "em-breve",
    image: "/images/cursos/hermeneutica.jpg",
    instructor: "Rev. Maria Santos",
    totalHours: "30 horas",
    format: "Híbrido - Segundas-feiras às 20h",
    objectives: [
      "Dominar os princípios de interpretação bíblica",
      "Compreender diferentes gêneros literários da Bíblia",
      "Aplicar métodos exegéticos corretos",
      "Evitar erros comuns de interpretação",
      "Desenvolver habilidades de estudo bíblico pessoal",
    ],
    syllabus: [
      "Semana 1: Introdução à Hermenêutica - História e Importância",
      "Semana 2: O Contexto Histórico e Cultural",
      "Semana 3: Análise Gramatical e Sintática",
      "Semana 4: Gêneros Literários - Narrativa e Lei",
      "Semana 5: Gêneros Literários - Poesia e Sabedoria",
      "Semana 6: Gêneros Literários - Profecia",
      "Semana 7: Interpretação de Parábolas e Alegorias",
      "Semana 8: Tipologia e Simbolismo",
      "Semana 9: Teologia Bíblica e Interpretação Cristológica",
      "Semana 10: Aplicação Prática - Do Texto ao Sermão",
    ],
    requirements: [
      "Conhecimento básico da Bíblia",
      "Ter concluído 'Fundamentos da Fé' ou equivalente",
      "Disposição para leitura aprofundada",
    ],
  },
  "antigo-testamento": {
    id: "antigo-testamento",
    title: "Antigo Testamento",
    description: "Estudo aprofundado dos livros do Antigo Testamento, seu contexto histórico e sua relevância hoje.",
    fullDescription: "Uma jornada abrangente pelos 39 livros do Antigo Testamento, explorando sua rica história, teologia e relevância para a vida cristã contemporânea. Este curso oferece uma compreensão profunda da aliança de Deus com Israel e como ela aponta para Cristo.",
    duration: "16 semanas",
    level: "Intermediário",
    startDate: "28 Set 2026",
    endDate: "18 Jan 2027",
    status: "em-breve",
    image: "/images/cursos/antigo-testamento.jpg",
    instructor: "Rev. Pedro Oliveira",
    totalHours: "48 horas",
    format: "Presencial - Sábados às 9h",
    objectives: [
      "Conhecer a estrutura e conteúdo do Antigo Testamento",
      "Compreender o contexto histórico de Israel",
      "Identificar temas teológicos principais",
      "Relacionar o AT com o Novo Testamento",
      "Aplicar os ensinamentos do AT hoje",
    ],
    syllabus: [
      "Semanas 1-2: Introdução e Pentateuco - A Lei de Moisés",
      "Semanas 3-4: Livros Históricos - A História de Israel",
      "Semanas 5-6: Livros Poéticos - Sabedoria e Adoração",
      "Semanas 7-8: Profetas Maiores - Isaías e Jeremias",
      "Semanas 9-10: Profetas Maiores - Ezequiel e Daniel",
      "Semanas 11-12: Profetas Menores - Parte 1",
      "Semanas 13-14: Profetas Menores - Parte 2",
      "Semanas 15-16: Teologia do AT e Cristologia",
    ],
    requirements: [
      "Ter concluído 'Fundamentos da Fé'",
      "Conhecimento básico de história bíblica",
      "Compromisso com leitura extensiva",
    ],
  },
  "panorama-biblico": {
    id: "panorama-biblico",
    title: "Panorama Bíblico",
    description: "Uma visão geral de toda a Bíblia, do Gênesis ao Apocalipse. Entenda a grande narrativa das Escrituras.",
    fullDescription: "Este curso oferece uma visão panorâmica de toda a Bíblia, revelando a grande narrativa da redenção que se desenrola do Gênesis ao Apocalipse. Você descobrirá como cada livro se conecta ao plano eterno de Deus.",
    duration: "12 semanas",
    level: "Iniciante",
    startDate: "10 Fev 2026",
    endDate: "4 Mai 2026",
    status: "em-andamento",
    image: "/images/cursos/panorama-biblico.jpg",
    instructor: "Rev. Ana Costa",
    totalHours: "36 horas",
    format: "Presencial - Terças-feiras às 19h30",
    objectives: [
      "Ter uma visão completa da narrativa bíblica",
      "Compreender a unidade das Escrituras",
      "Identificar os principais temas bíblicos",
      "Conhecer a estrutura dos 66 livros",
      "Desenvolver amor pela leitura da Bíblia",
    ],
    syllabus: [
      "Semana 1: Introdução - A Grande História de Deus",
      "Semanas 2-3: O Antigo Testamento - Criação à Lei",
      "Semanas 4-5: Reino e Exílio - História de Israel",
      "Semanas 6-7: Entre os Testamentos - 400 Anos de Silêncio",
      "Semanas 8-9: Os Evangelhos - A Vida de Jesus",
      "Semana 10: Atos - O Nascimento da Igreja",
      "Semana 11: Epístolas - Teologia Aplicada",
      "Semana 12: Apocalipse - O Fim e o Novo Começo",
    ],
    requirements: [
      "Não há pré-requisitos",
      "Desejo de conhecer a Bíblia",
      "Leitura diária das Escrituras",
    ],
  },
  "novo-testamento": {
    id: "novo-testamento",
    title: "Novo Testamento",
    description: "Explore os Evangelhos, Atos, as Epístolas e o Apocalipse com profundidade teológica e aplicação prática.",
    fullDescription: "Um estudo completo do Novo Testamento, explorando a vida e ensinos de Jesus, o nascimento da igreja, a teologia apostólica e a esperança escatológica. Este curso conecta a mensagem do NT com a vida cristã contemporânea.",
    duration: "16 semanas",
    level: "Intermediário",
    startDate: "1 Mar 2027",
    endDate: "21 Jun 2027",
    status: "em-breve",
    image: "/images/cursos/novo-testamento.jpg",
    instructor: "Rev. Carlos Mendes",
    totalHours: "48 horas",
    format: "Híbrido - Domingos às 18h",
    objectives: [
      "Conhecer profundamente os 27 livros do NT",
      "Compreender a pessoa e obra de Cristo",
      "Estudar a teologia paulina e joanina",
      "Aplicar os ensinamentos apostólicos",
      "Viver segundo o padrão do NT",
    ],
    syllabus: [
      "Semanas 1-4: Os Evangelhos Sinóticos",
      "Semanas 5-6: O Evangelho de João",
      "Semana 7: Atos dos Apóstolos",
      "Semanas 8-10: Epístolas Paulinas - Soteriologia",
      "Semanas 11-12: Epístolas Paulinas - Eclesiologia",
      "Semana 13: Epístolas Gerais",
      "Semana 14: Hebreus - Cristo Superior",
      "Semanas 15-16: Apocalipse - Esperança Final",
    ],
    requirements: [
      "Conhecimento do Antigo Testamento",
      "Ter concluído 'Panorama Bíblico'",
      "Maturidade espiritual",
    ],
  },
  "lideranca-crista": {
    id: "lideranca-crista",
    title: "Liderança Cristã",
    description: "Formação de líderes servos segundo o modelo bíblico. Para quem deseja servir na igreja local.",
    fullDescription: "Este curso forma líderes servos segundo o modelo de Cristo, equipando-os com princípios bíblicos e habilidades práticas para servir na igreja local. Aprenda a liderar com humildade, sabedoria e poder do Espírito Santo.",
    duration: "8 semanas",
    level: "Avançado",
    startDate: "5 Jul 2027",
    endDate: "30 Ago 2027",
    status: "em-breve",
    image: "/images/cursos/lideranca-crista.jpg",
    instructor: "Rev. Marcos Lima",
    totalHours: "32 horas",
    format: "Presencial - Quintas-feiras às 19h30",
    objectives: [
      "Desenvolver caráter cristão de liderança",
      "Compreender os modelos bíblicos de liderança",
      "Adquirir habilidades de liderança servidora",
      "Aprender gestão de conflitos e equipes",
      "Preparar-se para o ministério na igreja",
    ],
    syllabus: [
      "Semana 1: O Líder Servo - O Modelo de Cristo",
      "Semana 2: Caráter Cristão - Qualificações Bíblicas",
      "Semana 3: Liderança no Antigo Testamento",
      "Semana 4: Liderança Apostólica no NT",
      "Semana 5: Dons Espirituais e Chamado",
      "Semana 6: Gestão de Pessoas e Conflitos",
      "Semana 7: Mentoria e Discipulado",
      "Semana 8: Visão, Planejamento e Execução",
    ],
    requirements: [
      "Ser membro da igreja há pelo menos 1 ano",
      "Ter concluído 'Fundamentos da Fé'",
      "Indicação pastoral",
    ],
  },
};

// ──────────────────────────────────────────────────
// Pricing data (from inscricao/page.tsx)
// ──────────────────────────────────────────────────

const pricing: Record<string, { pricePix: number; priceCard: number; installments: number }> = {
  "fundamentos-da-fe": { pricePix: 250.00, priceCard: 275.00, installments: 3 },
  "teologia-sistematica": { pricePix: 380.00, priceCard: 420.00, installments: 3 },
  "hermeneutica-biblica": { pricePix: 320.00, priceCard: 350.00, installments: 3 },
  "hermeneutica": { pricePix: 320.00, priceCard: 350.00, installments: 3 },
  "antigo-testamento": { pricePix: 400.00, priceCard: 440.00, installments: 3 },
  // Courses without pricing get defaults
  "panorama-biblico": { pricePix: 300.00, priceCard: 330.00, installments: 3 },
  "novo-testamento": { pricePix: 450.00, priceCard: 495.00, installments: 3 },
  "lideranca-crista": { pricePix: 280.00, priceCard: 310.00, installments: 3 },
};

// ──────────────────────────────────────────────────
// Module/Lesson data (from courseContent.ts)
// ──────────────────────────────────────────────────

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "pdf" | "text";
  url: string;
  description: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

const courseModules: Record<string, Module[]> = {
  "fundamentos-da-fe": [
    {
      id: "modulo-1",
      title: "Módulo 1: Introdução à Teologia",
      lessons: [
        { id: "aula-1", title: "O que é Teologia?", duration: "25 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "Introdução ao estudo da teologia e sua importância para a vida cristã." },
        { id: "aula-2", title: "As Fontes da Teologia", duration: "30 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "Compreendendo as fontes primárias e secundárias da teologia." },
        { id: "pdf-1", title: "Apostila: Conceitos Básicos", duration: "15 páginas", type: "pdf", url: "/materials/fundamentos-modulo1.pdf", description: "Material complementar com definições e conceitos fundamentais." },
      ],
    },
    {
      id: "modulo-2",
      title: "Módulo 2: A Doutrina de Deus",
      lessons: [
        { id: "aula-3", title: "Os Atributos de Deus", duration: "35 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "Estudo dos atributos comunicáveis e incomunicáveis de Deus." },
        { id: "aula-4", title: "A Trindade", duration: "40 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "Compreendendo a doutrina trinitariana nas Escrituras." },
        { id: "pdf-2", title: "Leitura: Confissão de Fé", duration: "20 páginas", type: "pdf", url: "/materials/fundamentos-modulo2.pdf", description: "Trechos selecionados da Confissão de Fé sobre Deus." },
      ],
    },
    {
      id: "modulo-3",
      title: "Módulo 3: A Doutrina da Salvação",
      lessons: [
        { id: "aula-5", title: "O Pecado e suas Consequências", duration: "30 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "Entendendo a queda da humanidade e suas implicações." },
        { id: "aula-6", title: "A Obra de Cristo", duration: "45 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "A pessoa e obra redentora de Jesus Cristo." },
        { id: "aula-7", title: "Justificação pela Fé", duration: "35 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "Como somos justificados diante de Deus." },
      ],
    },
  ],
  "teologia-sistematica": [
    {
      id: "modulo-1",
      title: "Módulo 1: Introdução à Teologia Sistemática",
      lessons: [
        { id: "aula-1", title: "Método Teológico", duration: "40 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "Como fazer teologia de forma sistemática." },
      ],
    },
  ],
  "hermeneutica-biblica": [
    {
      id: "modulo-1",
      title: "Módulo 1: Princípios de Interpretação",
      lessons: [
        { id: "aula-1", title: "Contexto Histórico", duration: "35 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "A importância do contexto histórico na interpretação." },
      ],
    },
  ],
  "hermeneutica": [
    {
      id: "modulo-1",
      title: "Módulo 1: Introdução à Hermenêutica",
      lessons: [
        { id: "aula-1", title: "História e Importância da Hermenêutica", duration: "30 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "Introdução à ciência e arte da interpretação bíblica." },
        { id: "aula-2", title: "O Contexto Histórico e Cultural", duration: "35 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "Compreendendo o mundo bíblico para uma interpretação fiel." },
      ],
    },
    {
      id: "modulo-2",
      title: "Módulo 2: Gêneros Literários",
      lessons: [
        { id: "aula-3", title: "Narrativa e Lei", duration: "40 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "Interpretando textos narrativos e legislativos do AT." },
        { id: "aula-4", title: "Poesia e Profecia", duration: "35 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "Princípios para interpretar poesia hebraica e textos proféticos." },
      ],
    },
  ],
  "antigo-testamento": [
    {
      id: "modulo-1",
      title: "Módulo 1: Pentateuco - A Lei de Moisés",
      lessons: [
        { id: "aula-1", title: "Introdução ao Pentateuco", duration: "35 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "Visão geral dos cinco livros de Moisés e sua importância." },
        { id: "aula-2", title: "Gênesis: Criação e Queda", duration: "40 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "Os primeiros capítulos de Gênesis e a origem da humanidade." },
      ],
    },
    {
      id: "modulo-2",
      title: "Módulo 2: Livros Históricos",
      lessons: [
        { id: "aula-3", title: "A História de Israel", duration: "45 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "De Josué aos Reis: a conquista, os juízes e a monarquia." },
        { id: "aula-4", title: "Exílio e Restauração", duration: "35 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "O período do exílio babilônico e o retorno à terra prometida." },
      ],
    },
    {
      id: "modulo-3",
      title: "Módulo 3: Profetas e Poesia",
      lessons: [
        { id: "aula-5", title: "Livros Poéticos e de Sabedoria", duration: "40 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "Salmos, Provérbios, Jó e Eclesiastes: sabedoria e adoração." },
        { id: "aula-6", title: "Os Profetas Maiores e Menores", duration: "45 min", type: "video", url: "https://www.youtube.com/embed/eAvYmE2YYIU", description: "A mensagem profética e sua relevância cristológica." },
      ],
    },
  ],
};

// ──────────────────────────────────────────────────
// Seed function
// ──────────────────────────────────────────────────

async function seed() {
  console.log("Starting Firestore seed...\n");

  const courseIds = Object.keys(courseDetails);
  let order = 0;

  for (const courseId of courseIds) {
    order++;
    const detail = courseDetails[courseId];
    const price = pricing[courseId] || { pricePix: 0, priceCard: 0, installments: 1 };

    // Write course document
    const courseDoc = {
      id: courseId,
      title: detail.title,
      description: detail.description,
      fullDescription: detail.fullDescription,
      duration: detail.duration,
      level: detail.level,
      startDate: detail.startDate,
      endDate: detail.endDate,
      status: detail.status,
      image: detail.image,
      instructor: detail.instructor,
      totalHours: detail.totalHours,
      format: detail.format,
      objectives: detail.objectives,
      syllabus: detail.syllabus,
      requirements: detail.requirements,
      pricePix: price.pricePix,
      priceCard: price.priceCard,
      installments: price.installments,
      order,
      published: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "courses", courseId), courseDoc);
    console.log(`  ✓ Course: ${detail.title}`);

    // Write modules and lessons
    const modules = courseModules[courseId] || [];
    for (let mIdx = 0; mIdx < modules.length; mIdx++) {
      const mod = modules[mIdx];
      await setDoc(doc(db, "courses", courseId, "modules", mod.id), {
        id: mod.id,
        title: mod.title,
        order: mIdx + 1,
      });

      for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
        const lesson = mod.lessons[lIdx];
        await setDoc(
          doc(db, "courses", courseId, "modules", mod.id, "lessons", lesson.id),
          {
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration,
            type: lesson.type,
            url: lesson.url,
            description: lesson.description,
            order: lIdx + 1,
          }
        );
      }

      console.log(`    ✓ Module: ${mod.title} (${mod.lessons.length} lessons)`);
    }
  }

  // Seed admin config
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS
    ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
    : [];

  await setDoc(doc(db, "config", "admin"), { adminEmails });
  console.log(`\n  ✓ Admin config seeded (${adminEmails.length} emails)`);

  console.log(`\nDone! Seeded ${courseIds.length} courses.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
