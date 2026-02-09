"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

type Status = "em-andamento" | "proximo" | "em-breve";

interface Course {
  id: string;
  titulo: string;
  descricao: string;
  descricaoCompleta: string;
  duracao: string;
  nivel: string;
  dataInicio: string;
  dataFim: string;
  status: Status;
  imagem: string;
  professor: string;
  objetivos: string[];
  conteudoProgramatico: string[];
  requisitos: string[];
  cargaHoraria: string;
  formato: string;
}

export const cursos: Record<string, Course> = {
  "fundamentos-da-fe": {
    id: "fundamentos-da-fe",
    titulo: "Fundamentos da Fé",
    descricao:
      "Estudo das doutrinas essenciais da fé cristã reformada. Base sólida para o crescimento espiritual.",
    descricaoCompleta:
      "Este curso oferece uma jornada profunda pelas doutrinas fundamentais da fé cristã, explorando os pilares da teologia reformada e sua aplicação prática na vida do cristão. Através de um estudo sistemático das Escrituras, os alunos desenvolverão uma compreensão sólida da natureza de Deus, da salvação em Cristo, e do papel do Espírito Santo na vida do crente.",
    duracao: "8 semanas",
    nivel: "Iniciante",
    dataInicio: "11 Mai 2026",
    dataFim: "6 Jul 2026",
    status: "proximo",
    imagem: "/images/cursos/fundamentos-da-fe.jpg",
    professor: "Rev. João Silva",
    cargaHoraria: "24 horas",
    formato: "Presencial - Quartas-feiras às 19h30",
    objetivos: [
      "Compreender as doutrinas essenciais da fé cristã",
      "Desenvolver uma base teológica sólida",
      "Aplicar os fundamentos bíblicos na vida diária",
      "Conhecer a história da igreja e suas confissões",
      "Fortalecer a identidade cristã reformada",
    ],
    conteudoProgramatico: [
      "Semana 1: A Revelação de Deus - A Escritura Sagrada",
      "Semana 2: A Natureza de Deus - Trindade e Atributos Divinos",
      "Semana 3: A Criação e a Queda - O Pecado e suas Consequências",
      "Semana 4: A Pessoa e Obra de Cristo - Encarnação e Redenção",
      "Semana 5: A Salvação pela Graça - Justificação e Santificação",
      "Semana 6: O Espírito Santo - Sua Obra e Dons",
      "Semana 7: A Igreja - Sua Natureza e Missão",
      "Semana 8: As Últimas Coisas - Escatologia e Esperança Cristã",
    ],
    requisitos: [
      "Não há pré-requisitos",
      "Compromisso com a leitura semanal",
      "Participação ativa nas aulas",
    ],
  },
  "hermeneutica": {
    id: "hermeneutica",
    titulo: "Hermenêutica Bíblica",
    descricao:
      "Aprenda princípios de interpretação bíblica para estudar as Escrituras com profundidade e fidelidade.",
    descricaoCompleta:
      "A Hermenêutica Bíblica é a ciência e arte de interpretar as Escrituras Sagradas. Neste curso, você aprenderá os princípios fundamentais para uma interpretação correta e responsável da Palavra de Deus, considerando o contexto histórico, cultural, literário e teológico de cada passagem.",
    duracao: "10 semanas",
    nivel: "Intermediário",
    dataInicio: "13 Jul 2026",
    dataFim: "21 Set 2026",
    status: "em-breve",
    imagem: "/images/cursos/hermeneutica.jpg",
    professor: "Rev. Maria Santos",
    cargaHoraria: "30 horas",
    formato: "Híbrido - Segundas-feiras às 20h",
    objetivos: [
      "Dominar os princípios de interpretação bíblica",
      "Compreender diferentes gêneros literários da Bíblia",
      "Aplicar métodos exegéticos corretos",
      "Evitar erros comuns de interpretação",
      "Desenvolver habilidades de estudo bíblico pessoal",
    ],
    conteudoProgramatico: [
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
    requisitos: [
      "Conhecimento básico da Bíblia",
      "Ter concluído 'Fundamentos da Fé' ou equivalente",
      "Disposição para leitura aprofundada",
    ],
  },
  "antigo-testamento": {
    id: "antigo-testamento",
    titulo: "Antigo Testamento",
    descricao:
      "Estudo aprofundado dos livros do Antigo Testamento, seu contexto histórico e sua relevância hoje.",
    descricaoCompleta:
      "Uma jornada abrangente pelos 39 livros do Antigo Testamento, explorando sua rica história, teologia e relevância para a vida cristã contemporânea. Este curso oferece uma compreensão profunda da aliança de Deus com Israel e como ela aponta para Cristo.",
    duracao: "16 semanas",
    nivel: "Intermediário",
    dataInicio: "28 Set 2026",
    dataFim: "18 Jan 2027",
    status: "em-breve",
    imagem: "/images/cursos/antigo-testamento.jpg",
    professor: "Rev. Pedro Oliveira",
    cargaHoraria: "48 horas",
    formato: "Presencial - Sábados às 9h",
    objetivos: [
      "Conhecer a estrutura e conteúdo do Antigo Testamento",
      "Compreender o contexto histórico de Israel",
      "Identificar temas teológicos principais",
      "Relacionar o AT com o Novo Testamento",
      "Aplicar os ensinamentos do AT hoje",
    ],
    conteudoProgramatico: [
      "Semanas 1-2: Introdução e Pentateuco - A Lei de Moisés",
      "Semanas 3-4: Livros Históricos - A História de Israel",
      "Semanas 5-6: Livros Poéticos - Sabedoria e Adoração",
      "Semanas 7-8: Profetas Maiores - Isaías e Jeremias",
      "Semanas 9-10: Profetas Maiores - Ezequiel e Daniel",
      "Semanas 11-12: Profetas Menores - Parte 1",
      "Semanas 13-14: Profetas Menores - Parte 2",
      "Semanas 15-16: Teologia do AT e Cristologia",
    ],
    requisitos: [
      "Ter concluído 'Fundamentos da Fé'",
      "Conhecimento básico de história bíblica",
      "Compromisso com leitura extensiva",
    ],
  },
  "panorama-biblico": {
    id: "panorama-biblico",
    titulo: "Panorama Bíblico",
    descricao:
      "Uma visão geral de toda a Bíblia, do Gênesis ao Apocalipse. Entenda a grande narrativa das Escrituras.",
    descricaoCompleta:
      "Este curso oferece uma visão panorâmica de toda a Bíblia, revelando a grande narrativa da redenção que se desenrola do Gênesis ao Apocalipse. Você descobrirá como cada livro se conecta ao plano eterno de Deus.",
    duracao: "12 semanas",
    nivel: "Iniciante",
    dataInicio: "10 Fev 2026",
    dataFim: "4 Mai 2026",
    status: "em-andamento",
    imagem: "/images/cursos/panorama-biblico.jpg",
    professor: "Rev. Ana Costa",
    cargaHoraria: "36 horas",
    formato: "Presencial - Terças-feiras às 19h30",
    objetivos: [
      "Ter uma visão completa da narrativa bíblica",
      "Compreender a unidade das Escrituras",
      "Identificar os principais temas bíblicos",
      "Conhecer a estrutura dos 66 livros",
      "Desenvolver amor pela leitura da Bíblia",
    ],
    conteudoProgramatico: [
      "Semana 1: Introdução - A Grande História de Deus",
      "Semanas 2-3: O Antigo Testamento - Criação à Lei",
      "Semanas 4-5: Reino e Exílio - História de Israel",
      "Semanas 6-7: Entre os Testamentos - 400 Anos de Silêncio",
      "Semanas 8-9: Os Evangelhos - A Vida de Jesus",
      "Semana 10: Atos - O Nascimento da Igreja",
      "Semana 11: Epístolas - Teologia Aplicada",
      "Semana 12: Apocalipse - O Fim e o Novo Começo",
    ],
    requisitos: [
      "Não há pré-requisitos",
      "Desejo de conhecer a Bíblia",
      "Leitura diária das Escrituras",
    ],
  },
  "novo-testamento": {
    id: "novo-testamento",
    titulo: "Novo Testamento",
    descricao:
      "Explore os Evangelhos, Atos, as Epístolas e o Apocalipse com profundidade teológica e aplicação prática.",
    descricaoCompleta:
      "Um estudo completo do Novo Testamento, explorando a vida e ensinos de Jesus, o nascimento da igreja, a teologia apostólica e a esperança escatológica. Este curso conecta a mensagem do NT com a vida cristã contemporânea.",
    duracao: "16 semanas",
    nivel: "Intermediário",
    dataInicio: "1 Mar 2027",
    dataFim: "21 Jun 2027",
    status: "em-breve",
    imagem: "/images/cursos/novo-testamento.jpg",
    professor: "Rev. Carlos Mendes",
    cargaHoraria: "48 horas",
    formato: "Híbrido - Domingos às 18h",
    objetivos: [
      "Conhecer profundamente os 27 livros do NT",
      "Compreender a pessoa e obra de Cristo",
      "Estudar a teologia paulina e joanina",
      "Aplicar os ensinamentos apostólicos",
      "Viver segundo o padrão do NT",
    ],
    conteudoProgramatico: [
      "Semanas 1-4: Os Evangelhos Sinóticos",
      "Semanas 5-6: O Evangelho de João",
      "Semana 7: Atos dos Apóstolos",
      "Semanas 8-10: Epístolas Paulinas - Soteriologia",
      "Semanas 11-12: Epístolas Paulinas - Eclesiologia",
      "Semana 13: Epístolas Gerais",
      "Semana 14: Hebreus - Cristo Superior",
      "Semanas 15-16: Apocalipse - Esperança Final",
    ],
    requisitos: [
      "Conhecimento do Antigo Testamento",
      "Ter concluído 'Panorama Bíblico'",
      "Maturidade espiritual",
    ],
  },
  "lideranca-crista": {
    id: "lideranca-crista",
    titulo: "Liderança Cristã",
    descricao:
      "Formação de líderes servos segundo o modelo bíblico. Para quem deseja servir na igreja local.",
    descricaoCompleta:
      "Este curso forma líderes servos segundo o modelo de Cristo, equipando-os com princípios bíblicos e habilidades práticas para servir na igreja local. Aprenda a liderar com humildade, sabedoria e poder do Espírito Santo.",
    duracao: "8 semanas",
    nivel: "Avançado",
    dataInicio: "5 Jul 2027",
    dataFim: "30 Ago 2027",
    status: "em-breve",
    imagem: "/images/cursos/lideranca-crista.jpg",
    professor: "Rev. Marcos Lima",
    cargaHoraria: "32 horas",
    formato: "Presencial - Quintas-feiras às 19h30",
    objetivos: [
      "Desenvolver caráter cristão de liderança",
      "Compreender os modelos bíblicos de liderança",
      "Adquirir habilidades de liderança servidora",
      "Aprender gestão de conflitos e equipes",
      "Preparar-se para o ministério na igreja",
    ],
    conteudoProgramatico: [
      "Semana 1: O Líder Servo - O Modelo de Cristo",
      "Semana 2: Caráter Cristão - Qualificações Bíblicas",
      "Semana 3: Liderança no Antigo Testamento",
      "Semana 4: Liderança Apostólica no NT",
      "Semana 5: Dons Espirituais e Chamado",
      "Semana 6: Gestão de Pessoas e Conflitos",
      "Semana 7: Mentoria e Discipulado",
      "Semana 8: Visão, Planejamento e Execução",
    ],
    requisitos: [
      "Ser membro da igreja há pelo menos 1 ano",
      "Ter concluído 'Fundamentos da Fé'",
      "Indicação pastoral",
    ],
  },
};

export default function CoursePageClient() {
  const params = useParams();
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const courseId = params.id as string;
  const course = cursos[courseId];

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy">Curso não encontrado</h1>
          <button
            onClick={() => router.back()}
            className="mt-4 text-primary hover:text-primary-dark"
          >
            ← Voltar
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = {
    "em-andamento": { label: "Em Andamento", color: "bg-green-600" },
    "proximo": { label: "Próximo", color: "bg-primary" },
    "em-breve": { label: "Em Breve", color: "bg-navy-light" },
  }[course.status];

  const handleEnroll = async () => {
    setIsEnrolling(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsEnrolled(true);
    setIsEnrolling(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Course Image */}
      <div className="relative h-[400px] overflow-hidden bg-navy">
        <Image
          src={course.imagem}
          alt={course.titulo}
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-12">
          <div className="mb-4">
            <span className={`rounded-full px-4 py-1.5 text-sm font-semibold text-white ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            {course.titulo}
          </h1>
          <p className="max-w-3xl text-xl text-cream-dark">
            {course.descricao}
          </p>
        </div>
      </div>

      {/* Course Content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image of Jesus */}
            <div className="mb-12 overflow-hidden rounded-2xl bg-white p-8 shadow-lg">
              <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-xl">
                <Image
                  src="/images/jesus-teaching.jpg"
                  alt="Jesus Cristo ensinando"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center italic text-navy-light">
                &ldquo;Ensinando-os a observar todas as coisas que vos tenho ordenado&rdquo; - Mateus 28:20
              </p>
            </div>

            {/* About Course */}
            <div className="mb-8 rounded-2xl bg-white p-8 shadow-md">
              <h2 className="mb-4 text-2xl font-bold text-navy">Sobre o Curso</h2>
              <p className="leading-relaxed text-navy-light">
                {course.descricaoCompleta}
              </p>
            </div>

            {/* Objectives */}
            <div className="mb-8 rounded-2xl bg-white p-8 shadow-md">
              <h2 className="mb-4 text-2xl font-bold text-navy">Objetivos do Curso</h2>
              <ul className="space-y-3">
                {course.objetivos.map((objetivo, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="mt-1 h-5 w-5 flex-shrink-0 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-navy-light">{objetivo}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Program Content */}
            <div className="mb-8 rounded-2xl bg-white p-8 shadow-md">
              <h2 className="mb-4 text-2xl font-bold text-navy">Conteúdo Programático</h2>
              <div className="space-y-4">
                {course.conteudoProgramatico.map((conteudo, index) => (
                  <div
                    key={index}
                    className="flex gap-4 border-l-4 border-primary pl-4"
                  >
                    <span className="text-lg font-bold text-primary">{index + 1}</span>
                    <p className="text-navy-light">{conteudo}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image of Jesus 2 */}
            <div className="mb-8 overflow-hidden rounded-2xl bg-white p-8 shadow-lg">
              <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-xl">
                <Image
                  src="/images/jesus-praying.jpg"
                  alt="Jesus Cristo orando"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center italic text-navy-light">
                &ldquo;Vinde a mim, todos os que estais cansados e oprimidos&rdquo; - Mateus 11:28
              </p>
            </div>

            {/* Requirements */}
            <div className="rounded-2xl bg-white p-8 shadow-md">
              <h2 className="mb-4 text-2xl font-bold text-navy">Requisitos</h2>
              <ul className="space-y-2">
                {course.requisitos.map((requisito, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-navy-light">{requisito}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Enrollment Card */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-navy-light/10 pb-4">
                    <span className="text-sm font-semibold text-navy-light">Nível</span>
                    <span className="font-bold text-navy">{course.nivel}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-navy-light/10 pb-4">
                    <span className="text-sm font-semibold text-navy-light">Duração</span>
                    <span className="font-bold text-navy">{course.duracao}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-navy-light/10 pb-4">
                    <span className="text-sm font-semibold text-navy-light">Carga Horária</span>
                    <span className="font-bold text-navy">{course.cargaHoraria}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-navy-light/10 pb-4">
                    <span className="text-sm font-semibold text-navy-light">Início</span>
                    <span className="font-bold text-navy">{course.dataInicio}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4">
                    <span className="text-sm font-semibold text-navy-light">Formato</span>
                    <span className="text-right text-sm font-bold text-navy">
                      {course.formato}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleEnroll}
                  disabled={isEnrolled || isEnrolling}
                  className={`w-full rounded-full px-8 py-4 text-base font-semibold transition-all ${
                    isEnrolled
                      ? "bg-green-600 text-white"
                      : isEnrolling
                      ? "bg-navy-light text-white"
                      : "bg-primary text-white hover:bg-primary-dark hover:shadow-lg"
                  }`}
                >
                  {isEnrolled
                    ? "✓ Inscrito com Sucesso"
                    : isEnrolling
                    ? "Inscrevendo..."
                    : "Inscrever-se Agora"}
                </button>

                <button
                  onClick={() => router.back()}
                  className="mt-4 w-full rounded-full border-2 border-navy-light/20 px-8 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy-light hover:bg-cream"
                >
                  ← Voltar
                </button>
              </div>

              {/* Professor Card */}
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <h3 className="mb-4 text-lg font-bold text-navy">Professor</h3>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/images/professor-placeholder.jpg"
                      alt={course.professor}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-navy">{course.professor}</p>
                    <p className="text-sm text-navy-light">Instrutor</p>
                  </div>
                </div>
              </div>

              {/* Jesus Image Card */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src="/images/jesus-shepherd.jpg"
                    alt="Jesus o Bom Pastor"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-center text-sm italic text-navy-light">
                    &ldquo;Eu sou o bom pastor; conheço as minhas ovelhas&rdquo; - João 10:14
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
