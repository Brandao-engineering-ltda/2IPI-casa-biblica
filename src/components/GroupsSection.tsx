"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface GroupDetail {
  cost: string;
  material: string;
  duration: string;
  headline: string;
  body: string[];
  learningPoints: string[];
  targetAudience: string;
  closingQuote?: string;
  closingAuthor?: string;
  enrollmentStatus: "open" | "waitlist";
  spotsText?: string;
  detailUrl: string;
}

interface Group {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  startDate: string;
  dayTime: string;
  location: string;
  facilitators: string[];
  spotsInfo?: string;
  waitlist?: boolean;
  category: "hombridade" | "casais" | "familia";
  detail: GroupDetail;
}

interface EnrollmentFormData {
  nome: string;
  email: string;
  cpf: string;
  ddd: string;
  telefone: string;
  membro: "sim" | "nao" | "";
  dataNascimento: string;
}

/* ------------------------------------------------------------------ */
/*  Data — inner-page details included                                 */
/* ------------------------------------------------------------------ */

const groups: Group[] = [
  {
    id: "comunicacao-sexo-dinheiro",
    title: "Comunicação, Sexo & Dinheiro",
    description:
      "Um curso para fortalecer casamentos através dos três pilares essenciais: comunicação saudável, intimidade equilibrada e administração financeira com sabedoria bíblica.",
    tags: ["Hombridade", "UDF"],
    image:
      "https://2ipi.s3-accelerate.amazonaws.com/groups/comunicacao_sexo_dinheiro-ac712c00ec24d34e9f57bf8bfb59267d2eff3547.jpg",
    startDate: "26/03/2026",
    dayTime: "Quinta-feira às 20:00",
    location: "Online via WhatsApp",
    facilitators: ["Francisco Sales de Sousa Filho"],
    waitlist: true,
    category: "hombridade",
    detail: {
      cost: "R$ 130,00",
      material: "1 Livro mais 1 Manual",
      duration: "12 semanas",
      headline: "Três elementos essenciais para se construir relacionamentos duradouros",
      body: [
        "Este curso apresenta princípios práticos e bíblicos para encontrar soluções reais e desenvolver um casamento satisfatório, duradouro e cheio de paz.",
        "Por muitos anos, homens têm buscado respostas para conflitos dentro do lar, enquanto esposas desejam uma comunicação mais profunda e saudável.",
      ],
      learningPoints: [
        "Como desenvolver uma comunicação clara e respeitosa",
        "Entender as diferenças entre homem e mulher segundo a perspectiva bíblica",
        "Construir uma intimidade saudável no casamento",
        "Administrar recursos financeiros com equilíbrio e propósito",
        "Resolver conflitos de maneira madura e construtiva",
      ],
      targetAudience:
        "Este curso é indicado para homens casados ou noivos que desejam fortalecer seu relacionamento, vencer dificuldades na comunicação, na vida íntima ou na área financeira.",
      closingQuote: "Invista no seu casamento. Cresça como homem. Construa um relacionamento que glorifique a Deus.",
      enrollmentStatus: "waitlist",
      detailUrl:
        "https://app.ipimaringa.com.br/#!/groups-list/detail?id=69a1e275da68e71eb4ef2066",
    },
  },
  {
    id: "integridade-sexual",
    title: "Integridade Sexual",
    description:
      "Um curso para adolescentes meninos que desejam compreender a sexualidade à luz da Palavra de Deus e viver com pureza, honra e propósito.",
    tags: ["Hombridade", "UDF"],
    image:
      "https://2ipi.s3-accelerate.amazonaws.com/groups/6850da6482b61-xs-b94daf6cdb2b52b3f42bbce34b5829caf8d36522.jpg",
    startDate: "01/04/2026",
    dayTime: "Quarta-feira às 19:00",
    location: "Colégio Objetivo",
    facilitators: ["Visa Robson"],
    spotsInfo: "4 vagas restantes",
    category: "hombridade",
    detail: {
      cost: "R$ 130,00",
      material: "1 Livro mais 1 Manual",
      duration: "7 semanas",
      headline: "Uma revolução chamada pureza",
      body: [
        "Vivemos dias em que a sexualidade tem sido distorcida, banalizada e transformada em algo comum e sem valor. Mas uma nova geração está se levantando para recuperar aquilo que foi desprezado.",
        "Deus criou o ser humano como um ser sexual. Isso não é algo errado, vergonhoso ou sujo. Pelo contrário, é um dom precioso que precisa ser compreendido, protegido e vivido dentro do propósito divino.",
      ],
      learningPoints: [
        "O propósito bíblico da sexualidade",
        "Como desenvolver autocontrole e maturidade emocional",
        "Como lidar com pressões culturais e influências externas",
        "O valor da pureza e da honra",
        "Como tomar decisões que preservem seu futuro",
      ],
      targetAudience:
        "Este curso é especialmente direcionado a adolescentes do sexo masculino que desejam crescer em caráter, integridade e responsabilidade.",
      closingQuote: "Pureza não é repressão. É proteção. É honra. É maturidade.",
      enrollmentStatus: "open",
      spotsText: "4 vagas restantes",
      detailUrl:
        "https://app.ipimaringa.com.br/#!/groups-list/detail?id=69a1f25ac9160efea0b42c83",
    },
  },
  {
    id: "homem-ao-maximo-1",
    title: "Homem ao Máximo",
    description:
      "Um curso para homens que desejam compreender sua identidade em Cristo, assumir sua liderança no lar e viver com caráter, coragem e responsabilidade.",
    tags: ["Hombridade", "UDF"],
    image:
      "https://2ipi.s3-accelerate.amazonaws.com/groups/HOMEM-AO-MAXIMO-8ed11ff1b1ffcef734ede450cc3919a5d1bff05b.jpg",
    startDate: "11/04/2026",
    dayTime: "Sábado às 08:00",
    location: "Av. Mauá, 1988, Maringá - PR",
    facilitators: ["Fábio Rogério", "Edinei de Almeida Silva"],
    waitlist: true,
    category: "hombridade",
    detail: {
      cost: "R$ 130,00",
      material: "1 Livro mais 1 Manual",
      duration: "13 semanas",
      headline: "Descubra o plano de Deus para o homem",
      body: [
        "Este curso revela o plano de Deus a respeito da identidade e das responsabilidades do homem. Você vai compreender o propósito de Deus para sua vida, sua família, seu casamento e sua paternidade.",
        "Baseado nos ensinamentos de Edwin Louis Cole, considerado o pai do movimento de homens cristãos, este conteúdo confronta ideias distorcidas sobre masculinidade e apresenta o verdadeiro conceito de um homem cristão contemporâneo.",
      ],
      learningPoints: [
        "O propósito de Deus para o homem",
        "Liderança espiritual no lar",
        "Responsabilidade no casamento",
        "Paternidade com propósito",
        "Caráter, integridade e maturidade emocional",
        "Como se tornar um homem semelhante a Cristo",
      ],
      targetAudience:
        "Um homem que assume a liderança do seu lar, cuida da sua família, reconhece seus erros, é justo e sensato em suas decisões.",
      closingQuote: "Ser homem não é sobre força bruta. É sobre caráter, liderança e semelhança com Cristo.",
      enrollmentStatus: "waitlist",
      detailUrl:
        "https://app.ipimaringa.com.br/#!/groups-list/detail?id=69a1f7127755b6a0cc6e4350",
    },
  },
  {
    id: "homem-ao-maximo-2",
    title: "Homem ao Máximo",
    description:
      "Um curso para homens que desejam compreender sua identidade em Cristo, assumir sua liderança no lar e viver com caráter, coragem e responsabilidade.",
    tags: ["Hombridade", "UDF"],
    image:
      "https://2ipi.s3-accelerate.amazonaws.com/groups/HOMEM-AO-MAXIMO-8ed11ff1b1ffcef734ede450cc3919a5d1bff05b.jpg",
    startDate: "31/03/2026",
    dayTime: "Terça-feira às 19:00",
    location: "Jardim Higienópolis",
    facilitators: ["Natanael Luciano Rodrigues"],
    spotsInfo: "8 vagas restantes",
    category: "hombridade",
    detail: {
      cost: "R$ 130,00",
      material: "1 Livro mais 1 Manual",
      duration: "13 semanas",
      headline: "Descubra o plano de Deus para o homem",
      body: [
        "Este curso revela o plano de Deus a respeito da identidade e das responsabilidades do homem. Você vai compreender o propósito de Deus para sua vida, sua família, seu casamento e sua paternidade.",
        "Baseado nos ensinamentos de Edwin Louis Cole, considerado o pai do movimento de homens cristãos, este conteúdo confronta ideias distorcidas sobre masculinidade e apresenta o verdadeiro conceito de um homem cristão contemporâneo.",
      ],
      learningPoints: [
        "O propósito de Deus para o homem",
        "Liderança espiritual no lar",
        "Responsabilidade no casamento",
        "Paternidade com propósito",
        "Caráter, integridade e maturidade emocional",
        "Como se tornar um homem semelhante a Cristo",
      ],
      targetAudience:
        "Um homem que assume a liderança do seu lar, cuida da sua família, reconhece seus erros, é justo e sensato em suas decisões.",
      closingQuote: "Ser homem não é sobre força bruta. É sobre caráter, liderança e semelhança com Cristo.",
      enrollmentStatus: "open",
      spotsText: "8 vagas restantes",
      detailUrl:
        "https://app.ipimaringa.com.br/#!/groups-list/detail?id=69aecd80cfa2f8dcabc028d9",
    },
  },
  {
    id: "homem-ao-maximo-3",
    title: "Homem ao Máximo",
    description:
      "Um curso para homens que desejam compreender sua identidade em Cristo, assumir sua liderança no lar e viver com caráter, coragem e responsabilidade.",
    tags: ["Hombridade", "UDF"],
    image:
      "https://2ipi.s3-accelerate.amazonaws.com/groups/HOMEM-AO-MAXIMO-8ed11ff1b1ffcef734ede450cc3919a5d1bff05b.jpg",
    startDate: "04/04/2026",
    dayTime: "Sábado às 10:00",
    location: "Jardim Novo Horizonte",
    facilitators: ["Magno Roberto Toniolo"],
    spotsInfo: "6 vagas restantes",
    category: "hombridade",
    detail: {
      cost: "R$ 130,00",
      material: "1 Livro mais 1 Manual",
      duration: "13 semanas",
      headline: "Descubra o plano de Deus para o homem",
      body: [
        "Este curso revela o plano de Deus a respeito da identidade e das responsabilidades do homem. Você vai compreender o propósito de Deus para sua vida, sua família, seu casamento e sua paternidade.",
        "Baseado nos ensinamentos de Edwin Louis Cole, considerado o pai do movimento de homens cristãos, este conteúdo confronta ideias distorcidas sobre masculinidade e apresenta o verdadeiro conceito de um homem cristão contemporâneo.",
      ],
      learningPoints: [
        "O propósito de Deus para o homem",
        "Liderança espiritual no lar",
        "Responsabilidade no casamento",
        "Paternidade com propósito",
        "Caráter, integridade e maturidade emocional",
        "Como se tornar um homem semelhante a Cristo",
      ],
      targetAudience:
        "Um homem que assume a liderança do seu lar, cuida da sua família, reconhece seus erros, é justo e sensato em suas decisões.",
      closingQuote: "Ser homem não é sobre força bruta. É sobre caráter, liderança e semelhança com Cristo.",
      enrollmentStatus: "open",
      spotsText: "6 vagas restantes",
      detailUrl:
        "https://app.ipimaringa.com.br/#!/groups-list/detail?id=69aecdf9cfa2f8dcabc028da",
    },
  },
  {
    id: "homem-ao-maximo-4",
    title: "Homem ao Máximo",
    description:
      "Um curso para homens que desejam compreender sua identidade em Cristo, assumir sua liderança no lar e viver com caráter, coragem e responsabilidade.",
    tags: ["Hombridade", "UDF"],
    image:
      "https://2ipi.s3-accelerate.amazonaws.com/groups/HOMEM-AO-MAXIMO-8ed11ff1b1ffcef734ede450cc3919a5d1bff05b.jpg",
    startDate: "08/04/2026",
    dayTime: "Quarta-feira às 19:30",
    location: "",
    facilitators: [
      "Francisco Pablo Díaz De la Torre",
      "Fernando Henrique Salvalagio",
    ],
    spotsInfo: "4 vagas restantes",
    category: "hombridade",
    detail: {
      cost: "R$ 130,00",
      material: "1 Livro mais 1 Manual",
      duration: "13 semanas",
      headline: "Descubra o plano de Deus para o homem",
      body: [
        "Este curso revela o plano de Deus a respeito da identidade e das responsabilidades do homem. Você vai compreender o propósito de Deus para sua vida, sua família, seu casamento e sua paternidade.",
        "Baseado nos ensinamentos de Edwin Louis Cole, considerado o pai do movimento de homens cristãos, este conteúdo confronta ideias distorcidas sobre masculinidade e apresenta o verdadeiro conceito de um homem cristão contemporâneo.",
      ],
      learningPoints: [
        "O propósito de Deus para o homem",
        "Liderança espiritual no lar",
        "Responsabilidade no casamento",
        "Paternidade com propósito",
        "Caráter, integridade e maturidade emocional",
        "Como se tornar um homem semelhante a Cristo",
      ],
      targetAudience:
        "Um homem que assume a liderança do seu lar, cuida da sua família, reconhece seus erros, é justo e sensato em suas decisões.",
      closingQuote: "Ser homem não é sobre força bruta. É sobre caráter, liderança e semelhança com Cristo.",
      enrollmentStatus: "open",
      spotsText: "4 vagas restantes",
      detailUrl:
        "https://app.ipimaringa.com.br/#!/groups-list/detail?id=69aecea2cfa2f8dcabc028db",
    },
  },
  {
    id: "alianca-amor-incondicional",
    title: "Aliança — Amor Incondicional",
    description:
      "Ensino para casais casados, casados em união estável e noivos. Com duração de 10 semanas. O tema aborda o conceito bíblico sobre a importância da Aliança versus contratos.",
    tags: ["UDF", "Casais"],
    image:
      "https://2ipi.s3-accelerate.amazonaws.com/groups/hq720-a254628405b01677111ccebd12ebba6dd494570f.jpg",
    startDate: "25/03/2026",
    dayTime: "Quarta-feira às 20:00",
    location: "Colégio Objetivo",
    facilitators: ["Kiko e Silmara Machado"],
    waitlist: true,
    category: "casais",
    detail: {
      cost: "R$ 100,00 por casal",
      material: "1 apostila por casal",
      duration: "10 semanas",
      headline: "Aliança — Amor Incondicional",
      body: [
        "O curso Aliança é uma jornada especial preparada para casais que desejam fortalecer seu relacionamento e construir um casamento cada vez mais saudável, profundo e duradouro.",
        "Baseado em princípios bíblicos e em experiências práticas para o dia a dia do casal, o curso conduz os participantes a refletirem sobre a verdadeira essência da aliança no casamento.",
        "O curso também inclui momentos práticos de diálogo e reflexão entre os cônjuges, proporcionando um ambiente seguro e acolhedor para que cada casal possa crescer e renovar sua aliança.",
      ],
      learningPoints: [
        "A importância da aliança no casamento",
        "Comunicação sincera e saudável entre o casal",
        "Transparência e construção de confiança",
        "O poder do perdão no relacionamento",
        "Vida espiritual e oração no casamento",
        "Superação de conflitos e restauração emocional",
      ],
      targetAudience:
        "Este curso é indicado para casais que desejam investir em seu relacionamento, fortalecer sua caminhada juntos e viver um casamento que reflita os valores e princípios do amor de Deus.",
      enrollmentStatus: "waitlist",
      detailUrl:
        "https://app.ipimaringa.com.br/#!/groups-list/detail?id=69a8cf11e92476baebc79d1c",
    },
  },
  {
    id: "pais-para-toda-vida",
    title: "Pais para Toda a Vida",
    description:
      "O Curso Pais Para Toda a Vida oferece conselhos baseados nos princípios da Palavra de Deus que nos ajuda a entender a arte dos relacionamentos entre pais e filhos. Duração de 10 semanas.",
    tags: ["MMI", "Casais"],
    image:
      "https://2ipi.s3-accelerate.amazonaws.com/groups/image-d87026f27f424ae9892e6893152f1b9dcc852a13.jpg",
    startDate: "30/03/2026",
    dayTime: "Segunda-feira às 20:00",
    location: "Condomínio Eco Garden",
    facilitators: ["Joyce Duarte da Silva Guarezi", "Alexandre Guarezi"],
    spotsInfo: "3 vagas restantes",
    category: "familia",
    detail: {
      cost: "R$ 90,00 por casal",
      material: "1 apostila por casal",
      duration: "10 semanas",
      headline: "O curso Pais para Toda a Vida",
      body: [
        "O curso foi desenvolvido para ajudar pais e responsáveis a construírem relacionamentos saudáveis, fortes e duradouros com seus filhos, fundamentados nos princípios da Palavra de Deus.",
        "Mais do que ensinar técnicas de educação, o curso convida os pais a refletirem sobre o impacto da paternidade e da maternidade na formação da próxima geração.",
        "Através de princípios bíblicos práticos e aplicáveis ao cotidiano familiar, os participantes aprendem a desenvolver uma criação baseada no amor, na disciplina equilibrada, no exemplo e na construção de vínculos profundos.",
      ],
      learningPoints: [
        "O papel e a influência da paternidade e da maternidade",
        "Construção de vínculos fortes entre pais e filhos",
        "Disciplina baseada em amor e propósito",
        "Ensino de valores e princípios bíblicos no lar",
        "Comunicação saudável dentro da família",
        "Preparação dos filhos para o propósito que Deus tem para suas vidas",
      ],
      targetAudience:
        "Este curso é indicado para pais, mães e responsáveis que desejam investir no desenvolvimento emocional e espiritual de seus filhos.",
      enrollmentStatus: "open",
      spotsText: "3 vagas restantes",
      detailUrl:
        "https://app.ipimaringa.com.br/#!/groups-list/detail?id=69a8dacf65fd1e338c9fc347",
    },
  },
  {
    id: "como-criar-seus-filhos",
    title: "Como Criar Seus Filhos",
    description:
      "O curso oferece princípios práticos e baseados em valores cristãos para ajudar pais, responsáveis e educadores a compreenderem melhor a educação das crianças.",
    tags: ["UDF", "Casais", "Pais Solo"],
    image:
      "https://2ipi.s3-accelerate.amazonaws.com/groups/Curso_GFI_03-1024x1024-86c125527963a6ffa89305d483ab566a7d1e7043.jpeg",
    startDate: "01/04/2026",
    dayTime: "Quarta-feira às 19:30",
    location: "Colégio Objetivo",
    facilitators: ["Gilson Firmino de Goes"],
    waitlist: true,
    category: "familia",
    detail: {
      cost: "R$ 100,00 por casal",
      material: "1 apostila por casal",
      duration: "10 semanas",
      headline: "Como Criar Seus Filhos",
      body: [
        "O curso foi desenvolvido para ajudar pais, responsáveis e educadores a compreenderem melhor o processo de formação das crianças, oferecendo princípios práticos e eficazes para a criação de filhos com valores sólidos.",
        "Ao longo do curso, os participantes aprendem a importância do exemplo dentro de casa, da disciplina equilibrada, da comunicação positiva e da construção de vínculos.",
        "Seus ensinamentos já foram aplicados por milhões de famílias ao redor do mundo e também têm sido utilizados com grande sucesso em escolas, igrejas e projetos sociais.",
      ],
      learningPoints: [
        "Princípios fundamentais para a educação dos filhos",
        "Disciplina com amor e propósito",
        "Comunicação saudável entre pais e filhos",
        "Construção de valores e caráter nas crianças",
        "Fortalecimento do ambiente familiar",
        "Influência positiva dos pais e educadores na formação da próxima geração",
      ],
      targetAudience:
        "Este curso é indicado para pais, mães, responsáveis, educadores e também para pai ou mãe solo que desejam aprender princípios sólidos para orientar o desenvolvimento de seus filhos.",
      enrollmentStatus: "waitlist",
      detailUrl:
        "https://app.ipimaringa.com.br/#!/groups-list/detail?id=69a8de6865fd1e338c9fcd6a",
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Filter config                                                      */
/* ------------------------------------------------------------------ */

type FilterCategory = "todos" | "hombridade" | "casais" | "familia";

const filterOptions: { label: string; value: FilterCategory; icon: string }[] =
  [
    { label: "Todos", value: "todos", icon: "grid" },
    { label: "Hombridade", value: "hombridade", icon: "shield" },
    { label: "Casais", value: "casais", icon: "heart" },
    { label: "Família", value: "familia", icon: "users" },
  ];

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

function useStaggeredReveal(items: unknown[], isActive: boolean) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [itemsKey, setItemsKey] = useState(items.length);
  const [wasActive, setWasActive] = useState(isActive);

  // Derive resets from prop changes at render time (no refs, no effects)
  if (items.length !== itemsKey) {
    setItemsKey(items.length);
    setVisibleCount(0);
  }
  if (wasActive && !isActive) {
    setVisibleCount(0);
  }
  if (wasActive !== isActive) {
    setWasActive(isActive);
  }

  useEffect(() => {
    if (!isActive) return;
    if (visibleCount >= items.length) return;
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), 80);
    return () => clearTimeout(timer);
  }, [isActive, visibleCount, items.length]);

  return visibleCount;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/*  SVG Icons                                                          */
/* ------------------------------------------------------------------ */

function CalendarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function ClockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LocationIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function PersonIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function CostIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function BookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}


function CheckCircleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function FilterIcon({ type }: { type: string }) {
  const cls = "h-4 w-4";
  if (type === "shield")
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    );
  if (type === "heart")
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    );
  if (type === "users")
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}


/* ------------------------------------------------------------------ */
/*  Enrollment Form Component                                          */
/* ------------------------------------------------------------------ */

interface EnrollmentFormProps {
  group: Group;
  formRef: React.RefObject<HTMLDivElement | null>;
}

function EnrollmentForm({ group, formRef }: EnrollmentFormProps) {
  const [formData, setFormData] = useState<EnrollmentFormData>({
    nome: "",
    email: "",
    cpf: "",
    ddd: "",
    telefone: "",
    membro: "",
    dataNascimento: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const isFormComplete =
    formData.nome &&
    formData.email &&
    formData.cpf &&
    formData.ddd &&
    formData.telefone &&
    formData.membro &&
    formData.dataNascimento;

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 8) {
      value = value.slice(0, 3) + "." + value.slice(3, 6) + "." + value.slice(6, 9) + "-" + value.slice(9);
    } else if (value.length > 5) {
      value = value.slice(0, 3) + "." + value.slice(3, 6) + "." + value.slice(6);
    } else if (value.length > 2) {
      value = value.slice(0, 3) + "." + value.slice(3);
    }
    setFormData({ ...formData, cpf: value });
  };

  const handlePhoneChange = (field: "ddd" | "telefone") => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (field === "ddd") {
      value = value.slice(0, 2);
    } else {
      value = value.slice(0, 9);
    }
    setFormData({ ...formData, [field]: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length >= 5) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4);
    } else if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setFormData({ ...formData, dataNascimento: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormComplete) {
      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          nome: "",
          email: "",
          cpf: "",
          ddd: "",
          telefone: "",
          membro: "",
          dataNascimento: "",
        });
        setSubmitted(false);
      }, 2000);
    }
  };

  const d = group.detail;
  const spotsRemaining = d.spotsText ? parseInt(d.spotsText) : 0;

  return (
    <div ref={formRef} className="rounded-2xl border border-cream-dark/20 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-navy">Faça sua inscrição</h3>
      </div>

      {d.enrollmentStatus === "waitlist" ? (
        <div className="mb-6 rounded-lg bg-amber-50 px-4 py-3 border border-amber-200">
          <p className="text-sm font-medium text-amber-800">
            Grupo cheio. Você será incluído na lista de espera.
          </p>
        </div>
      ) : (
        <div className="mb-6 rounded-lg bg-sky-50 px-4 py-3 border border-sky-200">
          <p className="text-sm font-medium text-sky-800">
            Restam {spotsRemaining} vagas.
          </p>
        </div>
      )}

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-center text-sm font-medium text-emerald-600">
            Inscrição enviada com sucesso!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy">
              Nome completo *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Digite seu nome completo"
              className="w-full rounded-lg border border-cream-dark/30 bg-white px-4 py-2.5 text-sm text-navy placeholder-navy/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Digite seu email"
              className="w-full rounded-lg border border-cream-dark/30 bg-white px-4 py-2.5 text-sm text-navy placeholder-navy/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy">
              CPF *
            </label>
            <input
              type="text"
              value={formData.cpf}
              onChange={handleCPFChange}
              placeholder="Digite seu CPF"
              className="w-full rounded-lg border border-cream-dark/30 bg-white px-4 py-2.5 text-sm text-navy placeholder-navy/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy">
                DDD *
              </label>
              <input
                type="text"
                value={formData.ddd}
                onChange={handlePhoneChange("ddd")}
                placeholder="XX"
                maxLength={2}
                className="w-full rounded-lg border border-cream-dark/30 bg-white px-4 py-2.5 text-sm text-navy placeholder-navy/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-navy">
                Telefone *
              </label>
              <input
                type="text"
                value={formData.telefone}
                onChange={handlePhoneChange("telefone")}
                placeholder="Digite seu telefone"
                className="w-full rounded-lg border border-cream-dark/30 bg-white px-4 py-2.5 text-sm text-navy placeholder-navy/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy">
              Data de nascimento *
            </label>
            <input
              type="text"
              value={formData.dataNascimento}
              onChange={handleDateChange}
              placeholder="DD/MM/AAAA"
              className="w-full rounded-lg border border-cream-dark/30 bg-white px-4 py-2.5 text-sm text-navy placeholder-navy/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-navy">
              Você é membro da igreja? *
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="membro"
                  value="sim"
                  checked={formData.membro === "sim"}
                  onChange={(e) => setFormData({ ...formData, membro: e.target.value as "" | "sim" | "nao" })}
                  className="h-4 w-4 text-primary accent-primary"
                />
                <span className="text-sm text-navy">Sim, sou membro</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="membro"
                  value="nao"
                  checked={formData.membro === "nao"}
                  onChange={(e) => setFormData({ ...formData, membro: e.target.value as "" | "sim" | "nao" })}
                  className="h-4 w-4 text-primary accent-primary"
                />
                <span className="text-sm text-navy">Não sou membro</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormComplete}
            className="mt-6 w-full rounded-lg bg-navy py-3 text-center font-semibold text-white transition-all duration-200 hover:bg-navy-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-navy"
          >
            Confirmar inscrição
          </button>
        </form>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Group Detail Dialog                                                */
/* ------------------------------------------------------------------ */

interface GroupDetailDialogProps {
  group: Group | null;
  onClose: () => void;
}

function GroupDetailDialog({ group, onClose }: GroupDetailDialogProps) {
  const [animateIn, setAnimateIn] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (group) {
      requestAnimationFrame(() => setAnimateIn(true));
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [group]);

  const handleClose = useCallback(() => {
    setAnimateIn(false);
    setTimeout(() => onClose(), 300);
  }, [onClose]);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  if (!group) return null;

  const d = group.detail;

  const dialog = (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes: ${group.title}`}
      data-testid="group-detail-dialog"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        animateIn ? "bg-black/60 backdrop-blur-sm" : "bg-black/0"
      }`}
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div
        className={`relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ${
          animateIn
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-8 scale-95 opacity-0"
        }`}
      >
        {/* Header with image */}
        <div className="relative h-48 shrink-0 overflow-hidden sm:h-56">
          <Image
            src={group.image}
            alt={group.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/40 to-transparent" />

          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
            aria-label="Fechar"
            data-testid="dialog-close-button"
          >
            <CloseIcon />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {group.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl font-extrabold text-white drop-shadow-lg sm:text-3xl">
              {group.title}
            </h2>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Quick info cards */}
          <div className="grid grid-cols-2 gap-3 border-b border-cream-dark/20 p-6 sm:grid-cols-4">
            <div className="flex flex-col items-center rounded-xl bg-cream/60 p-3 text-center">
              <CalendarIcon className="mb-1 h-5 w-5 text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-navy/50">Início</span>
              <span className="text-sm font-bold text-navy">{group.startDate}</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-cream/60 p-3 text-center">
              <ClockIcon className="mb-1 h-5 w-5 text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-navy/50">Quando</span>
              <span className="text-sm font-bold text-navy">{group.dayTime}</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-cream/60 p-3 text-center">
              <CostIcon className="mb-1 h-5 w-5 text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-navy/50">Custo</span>
              <span className="text-sm font-bold text-navy">{d.cost}</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-cream/60 p-3 text-center">
              <BookIcon className="mb-1 h-5 w-5 text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-navy/50">Duração</span>
              <span className="text-sm font-bold text-navy">{d.duration}</span>
            </div>
          </div>

          {/* Details body */}
          <div className="space-y-6 p-6">
            {/* Location & facilitator */}
            <div className="flex flex-wrap gap-4 text-sm text-navy/70">
              {group.location && (
                <span className="flex items-center gap-1.5">
                  <LocationIcon className="h-4 w-4 text-primary" />
                  {group.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <PersonIcon className="h-4 w-4 text-primary" />
                {group.facilitators.join(", ")}
              </span>
            </div>

            {/* Material */}
            <div className="flex items-center gap-2 rounded-lg bg-cream/40 px-3 py-2 text-sm text-navy/70">
              <BookIcon className="h-4 w-4 text-primary" />
              <span><strong>Material:</strong> {d.material}</span>
            </div>

            {/* Headline & body */}
            <div>
              <h3 className="mb-3 text-lg font-bold text-navy" data-testid="dialog-headline">
                {d.headline}
              </h3>
              {d.body.map((p, i) => (
                <p key={i} className="mb-2 text-sm leading-relaxed text-navy/70">
                  {p}
                </p>
              ))}
            </div>

            {/* Learning points */}
            <div>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-navy/80">
                O que você vai aprender
              </h4>
              <ul className="space-y-2">
                {d.learningPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-navy/70">
                    <CheckCircleIcon />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target audience */}
            <div className="rounded-xl bg-navy/5 p-4">
              <h4 className="mb-2 text-sm font-bold text-navy/80">Para quem é este curso?</h4>
              <p className="text-sm leading-relaxed text-navy/60">{d.targetAudience}</p>
            </div>

            {/* Closing quote */}
            {d.closingQuote && (
              <blockquote className="border-l-4 border-primary pl-4 italic text-navy/60">
                {d.closingQuote}
                {d.closingAuthor && (
                  <span className="mt-1 block text-xs font-medium not-italic text-navy/40">
                    — {d.closingAuthor}
                  </span>
                )}
              </blockquote>
            )}


            {/* Enrollment Form */}
            <EnrollmentForm group={group} formRef={formRef} />
          </div>
        </div>

      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(dialog, document.body);
  }
  return dialog;
}

/* ------------------------------------------------------------------ */
/*  Group Card with Floating Design                                   */
/* ------------------------------------------------------------------ */

interface GroupCardProps {
  group: Group;
  index: number;
  isVisible: boolean;
  onOpenDetail: (group: Group) => void;
}

function GroupCard({ group, index, isVisible, onOpenDetail }: GroupCardProps) {
  return (
    <article
      data-testid="group-card"
      className={`group/card relative flex flex-col overflow-hidden rounded-3xl bg-white transition-all duration-500 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0"
      }`}
      style={{
        transitionDelay: `${index * 60}ms`,
        boxShadow: "0 8px 30px rgb(0, 0, 0, 0.12)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 50px rgb(0, 0, 0, 0.2)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-8px) rotateX(2deg)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgb(0, 0, 0, 0.12)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0) rotateX(0)";
      }}
    >
      {/* Card Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={group.image}
          alt={group.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 via-navy-dark/20 to-transparent transition-opacity duration-300 group-hover/card:from-navy-dark/80" />


        {/* Status Badge */}
        <div className="absolute right-3 top-3">
          {group.waitlist ? (
            <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
              Lista de espera
            </span>
          ) : (
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
              Inscrições abertas
            </span>
          )}
        </div>

        {/* Title over image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold leading-tight text-white drop-shadow-lg">
            {group.title}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {group.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-navy/10 px-2.5 py-0.5 text-xs font-medium text-navy transition-colors duration-200 group-hover/card:bg-primary/10 group-hover/card:text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-navy/70">
          {group.description}
        </p>

        {/* Details */}
        <div className="mt-auto space-y-2 border-t border-cream-dark/20 pt-4">
          <div className="flex items-center gap-2 text-sm text-navy/80">
            <CalendarIcon className="h-4 w-4 shrink-0 text-primary" />
            <span>Início: {group.startDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-navy/80">
            <ClockIcon className="h-4 w-4 shrink-0 text-primary" />
            <span>{group.dayTime}</span>
          </div>
          {group.location && (
            <div className="flex items-center gap-2 text-sm text-navy/80">
              <LocationIcon className="h-4 w-4 shrink-0 text-primary" />
              <span className="line-clamp-1">{group.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-navy/80">
            <PersonIcon className="h-4 w-4 shrink-0 text-primary" />
            <span className="line-clamp-1">
              {group.facilitators.join(", ")}
            </span>
          </div>
        </div>

        {/* Spots / Waitlist indicator */}
        {(group.spotsInfo || group.waitlist) && (
          <div className="mt-3">
            {group.spotsInfo && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {group.spotsInfo}
              </div>
            )}
            {group.waitlist && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                Lista de espera disponível
              </div>
            )}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={() => onOpenDetail(group)}
          className="mt-4 block w-full rounded-xl bg-navy py-2.5 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-primary hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
          data-testid="ver-detalhes-button"
        >
          Ver detalhes
        </button>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Section                                                       */
/* ------------------------------------------------------------------ */

export function GroupsSection() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("todos");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const { ref: sectionRef, inView } = useInView(0.05);

  const filteredGroups =
    activeFilter === "todos"
      ? groups
      : groups.filter((g) => g.category === activeFilter);

  const visibleCount = useStaggeredReveal(filteredGroups, inView);

  return (
    <section id="grupos" className="relative overflow-hidden bg-cream py-20" ref={sectionRef}>
      {/* Decorative background elements with subtle animation */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-navy/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div
          className={`mx-auto mb-4 text-center transition-all duration-700 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <Image
            src="https://app.ipimaringa.com.br/assets/images/logo/ipimaringa.png"
            alt="Somos Casa"
            width={180}
            height={97}
            className="mx-auto mb-4"
            unoptimized
          />
          <h2 className="text-3xl font-extrabold text-navy md:text-4xl lg:text-5xl">
            Grupos da{" "}
            <span className="text-primary">2ª IPI de Maringá</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-navy/60">
            Encontre um grupo para crescer, aprender e caminhar junto.
          </p>
        </div>

        {/* Filter Pills */}
        <div
          className={`mb-12 flex flex-wrap items-center justify-center gap-2 transition-all delay-200 duration-700 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                activeFilter === opt.value
                  ? "bg-navy text-white shadow-lg shadow-navy/20 scale-105"
                  : "bg-white text-navy/70 shadow-sm hover:bg-navy/5 hover:text-navy hover:scale-105"
              }`}
              data-testid={`filter-${opt.value}`}
            >
              <FilterIcon type={opt.icon} />
              {opt.label}
            </button>
          ))}
        </div>

        {/* Groups Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group, i) => (
            <GroupCard
              key={group.id}
              group={group}
              index={i}
              isVisible={i < visibleCount}
              onOpenDetail={setSelectedGroup}
            />
          ))}
        </div>

      </div>

      {/* Detail Dialog */}
      <GroupDetailDialog
        group={selectedGroup}
        onClose={() => setSelectedGroup(null)}
      />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports for testing                                                */
/* ------------------------------------------------------------------ */

export { groups, GroupCard, GroupDetailDialog };
export type { Group, GroupDetail, FilterCategory };
