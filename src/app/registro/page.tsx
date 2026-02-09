"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveUserData } from "@/lib/storage";

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nomeCompleto: "João Silva Santos",
    email: "joao.silva@email.com",
    telefone: "(11) 98765-4321",
    dataNascimento: "1990-05-15",
    sexo: "masculino",
    estadoCivil: "casado",
    escolaridade: "superior-completo",
    profissao: "Professor",
    endereco: "Rua das Flores, 123, Apto 45",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01234-567",
    denominacao: "Igreja Batista",
    comoConheceu: "Redes sociais",
    observacoes: "Tenho interesse em aprofundar meus conhecimentos teológicos para melhor servir na igreja local.",
    senha: "senha123",
    confirmarSenha: "senha123"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = "Nome completo é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (formData.senha.length < 6) {
      newErrors.senha = "A senha deve ter no mínimo 6 caracteres";
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = "Confirmação de senha é obrigatória";
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem";
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = "Data de nascimento é obrigatória";
    }

    if (!formData.sexo) {
      newErrors.sexo = "Sexo é obrigatório";
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = "Cidade é obrigatória";
    }

    if (!formData.estado) {
      newErrors.estado = "Estado é obrigatório";
    }

    if (!acceptedTerms) {
      newErrors.terms = "Você precisa aceitar os termos de compromisso para continuar";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Save user data to localStorage (excluding passwords for security)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { senha, confirmarSenha, ...userData } = formData;
      saveUserData(userData);
      
      console.log("Form submitted:", formData);
      router.push("/dashboard");
    }, 1500);
  }

  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-dark py-12">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-6">
        <div className="rounded-2xl border border-cream-dark/10 bg-navy p-8 shadow-xl">
          <div className="flex flex-col items-center">
            <Image
              src="/logo-3d.png"
              alt="Logo Instituto Casa Bíblica"
              width={64}
              height={64}
              className="mb-6 rounded-xl"
            />
            <h1 className="text-3xl font-bold text-white">
              Criar Conta
            </h1>
            <p className="mt-2 text-center text-sm text-cream-dark">
              Preencha seus dados para se inscrever no Instituto Casa Bíblica
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-6">
            {/* Dados Pessoais */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">Dados Pessoais</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="nomeCompleto" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    Nome Completo <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="nomeCompleto"
                    name="nomeCompleto"
                    type="text"
                    value={formData.nomeCompleto}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    className={`w-full rounded-lg border ${errors.nomeCompleto ? 'border-red-400' : 'border-cream-dark/20'} bg-navy-dark px-4 py-3 text-sm text-cream placeholder:text-cream-dark/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary`}
                  />
                  {errors.nomeCompleto && (
                    <p className="mt-1 text-xs text-red-400">{errors.nomeCompleto}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    E-mail <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className={`w-full rounded-lg border ${errors.email ? 'border-red-400' : 'border-cream-dark/20'} bg-navy-dark px-4 py-3 text-sm text-cream placeholder:text-cream-dark/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    Senha <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="senha"
                      name="senha"
                      type={showPassword ? "text" : "password"}
                      value={formData.senha}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      className={`w-full rounded-lg border ${errors.senha ? 'border-red-400' : 'border-cream-dark/20'} bg-navy-dark px-4 py-3 pr-10 text-sm text-cream placeholder:text-cream-dark/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-dark hover:text-primary transition-colors"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.senha && (
                    <p className="mt-1 text-xs text-red-400">{errors.senha}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmarSenha" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    Confirmar Senha <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmarSenha"
                      name="confirmarSenha"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmarSenha}
                      onChange={handleChange}
                      placeholder="Digite a senha novamente"
                      className={`w-full rounded-lg border ${errors.confirmarSenha ? 'border-red-400' : 'border-cream-dark/20'} bg-navy-dark px-4 py-3 pr-10 text-sm text-cream placeholder:text-cream-dark/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-dark hover:text-primary transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmarSenha && (
                    <p className="mt-1 text-xs text-red-400">{errors.confirmarSenha}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="telefone" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    Telefone/WhatsApp <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    className={`w-full rounded-lg border ${errors.telefone ? 'border-red-400' : 'border-cream-dark/20'} bg-navy-dark px-4 py-3 text-sm text-cream placeholder:text-cream-dark/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary`}
                  />
                  {errors.telefone && (
                    <p className="mt-1 text-xs text-red-400">{errors.telefone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="dataNascimento" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    Data de Nascimento <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="dataNascimento"
                    name="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${errors.dataNascimento ? 'border-red-400' : 'border-cream-dark/20'} bg-navy-dark px-4 py-3 text-sm text-cream placeholder:text-cream-dark/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary`}
                  />
                  {errors.dataNascimento && (
                    <p className="mt-1 text-xs text-red-400">{errors.dataNascimento}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="sexo" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    Sexo <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="sexo"
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${errors.sexo ? 'border-red-400' : 'border-cream-dark/20'} bg-navy-dark px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary`}
                  >
                    <option value="">Selecione</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </select>
                  {errors.sexo && (
                    <p className="mt-1 text-xs text-red-400">{errors.sexo}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="estadoCivil" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    Estado Civil
                  </label>
                  <select
                    id="estadoCivil"
                    name="estadoCivil"
                    value={formData.estadoCivil}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-cream-dark/20 bg-navy-dark px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Selecione</option>
                    <option value="solteiro">Solteiro(a)</option>
                    <option value="casado">Casado(a)</option>
                    <option value="divorciado">Divorciado(a)</option>
                    <option value="viuvo">Viúvo(a)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Formação */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">Formação Acadêmica e Profissional</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="escolaridade" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    Escolaridade
                  </label>
                  <select
                    id="escolaridade"
                    name="escolaridade"
                    value={formData.escolaridade}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-cream-dark/20 bg-navy-dark px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Selecione</option>
                    <option value="fundamental-incompleto">Fundamental Incompleto</option>
                    <option value="fundamental-completo">Fundamental Completo</option>
                    <option value="medio-incompleto">Médio Incompleto</option>
                    <option value="medio-completo">Médio Completo</option>
                    <option value="superior-incompleto">Superior Incompleto</option>
                    <option value="superior-completo">Superior Completo</option>
                    <option value="pos-graduacao">Pós-Graduação</option>
                    <option value="mestrado">Mestrado</option>
                    <option value="doutorado">Doutorado</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="profissao" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    Profissão
                  </label>
                  <input
                    id="profissao"
                    name="profissao"
                    type="text"
                    value={formData.profissao}
                    onChange={handleChange}
                    placeholder="Sua profissão"
                    className="w-full rounded-lg border border-cream-dark/20 bg-navy-dark px-4 py-3 text-sm text-cream placeholder:text-cream-dark/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">Endereço</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="endereco" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    Endereço
                  </label>
                  <input
                    id="endereco"
                    name="endereco"
                    type="text"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Rua, número, complemento"
                    className="w-full rounded-lg border border-cream-dark/20 bg-navy-dark px-4 py-3 text-sm text-cream placeholder:text-cream-dark/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="cidade" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    Cidade <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="cidade"
                    name="cidade"
                    type="text"
                    value={formData.cidade}
                    onChange={handleChange}
                    placeholder="Sua cidade"
                    className={`w-full rounded-lg border ${errors.cidade ? 'border-red-400' : 'border-cream-dark/20'} bg-navy-dark px-4 py-3 text-sm text-cream placeholder:text-cream-dark/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary`}
                  />
                  {errors.cidade && (
                    <p className="mt-1 text-xs text-red-400">{errors.cidade}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="estado" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    Estado <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${errors.estado ? 'border-red-400' : 'border-cream-dark/20'} bg-navy-dark px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary`}
                  >
                    <option value="">Selecione</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </select>
                  {errors.estado && (
                    <p className="mt-1 text-xs text-red-400">{errors.estado}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="cep" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    CEP
                  </label>
                  <input
                    id="cep"
                    name="cep"
                    type="text"
                    value={formData.cep}
                    onChange={handleChange}
                    placeholder="00000-000"
                    className="w-full rounded-lg border border-cream-dark/20 bg-navy-dark px-4 py-3 text-sm text-cream placeholder:text-cream-dark/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Informações Religiosas */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">Informações Adicionais</h2>
              <div className="grid gap-5">
                <div>
                  <label htmlFor="denominacao" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    Denominação Religiosa
                  </label>
                  <input
                    id="denominacao"
                    name="denominacao"
                    type="text"
                    value={formData.denominacao}
                    onChange={handleChange}
                    placeholder="Sua denominação (se houver)"
                    className="w-full rounded-lg border border-cream-dark/20 bg-navy-dark px-4 py-3 text-sm text-cream placeholder:text-cream-dark/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="comoConheceu" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    Como conheceu o Instituto Casa Bíblica?
                  </label>
                  <input
                    id="comoConheceu"
                    name="comoConheceu"
                    type="text"
                    value={formData.comoConheceu}
                    onChange={handleChange}
                    placeholder="Ex: Redes sociais, indicação, site, etc."
                    className="w-full rounded-lg border border-cream-dark/20 bg-navy-dark px-4 py-3 text-sm text-cream placeholder:text-cream-dark/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="observacoes" className="mb-1.5 block text-sm font-medium text-cream-dark">
                    Observações
                  </label>
                  <textarea
                    id="observacoes"
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    placeholder="Algo mais que gostaria de compartilhar?"
                    rows={4}
                    className="w-full rounded-lg border border-cream-dark/20 bg-navy-dark px-4 py-3 text-sm text-cream placeholder:text-cream-dark/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Termo de Compromisso */}
            <div className="border-t border-cream-dark/20 pt-6">
              <h2 className="mb-4 text-lg font-semibold text-white">Termo de Compromisso</h2>
              
              <div className="mb-4 max-h-60 overflow-y-auto rounded-lg border border-cream-dark/20 bg-navy-dark p-4 text-sm text-cream-dark">
                <h3 className="mb-3 font-semibold text-white">TERMO DE COMPROMISSO DO ALUNO</h3>
                
                <p className="mb-3">
                  Eu, aluno(a) regularmente matriculado no <strong>Instituto Casa Bíblica</strong>, declaro estar ciente e concordo com os seguintes termos:
                </p>

                <h4 className="mb-2 mt-4 font-semibold text-white">1. COMPROMISSO COM OS ESTUDOS</h4>
                <ul className="mb-3 ml-4 list-disc space-y-1">
                  <li>Dedicar-me aos estudos com seriedade, disciplina e responsabilidade.</li>
                  <li>Cumprir com as atividades, tarefas e avaliações propostas pelos professores.</li>
                  <li>Manter frequência regular nas aulas e participar ativamente das atividades propostas.</li>
                  <li>Respeitar os prazos estabelecidos para entrega de trabalhos e avaliações.</li>
                </ul>

                <h4 className="mb-2 mt-4 font-semibold text-white">2. CONDUTA E ÉTICA</h4>
                <ul className="mb-3 ml-4 list-disc space-y-1">
                  <li>Manter uma conduta cristã compatível com os princípios bíblicos ensinados no Instituto.</li>
                  <li>Tratar com respeito e consideração os professores, coordenadores, funcionários e demais alunos.</li>
                  <li>Zelar pela boa reputação e imagem do Instituto Casa Bíblica.</li>
                  <li>Não praticar plágio ou qualquer forma de desonestidade acadêmica.</li>
                </ul>

                <h4 className="mb-2 mt-4 font-semibold text-white">3. USO DA PLATAFORMA E MATERIAIS</h4>
                <ul className="mb-3 ml-4 list-disc space-y-1">
                  <li>Utilizar a plataforma de ensino de forma responsável e adequada.</li>
                  <li>Não compartilhar minha senha ou permitir acesso de terceiros à minha conta.</li>
                  <li>Respeitar os direitos autorais dos materiais didáticos disponibilizados.</li>
                  <li>Não reproduzir, distribuir ou comercializar o conteúdo dos cursos sem autorização expressa.</li>
                </ul>

                <h4 className="mb-2 mt-4 font-semibold text-white">4. COMUNICAÇÃO E INFORMAÇÕES</h4>
                <ul className="mb-3 ml-4 list-disc space-y-1">
                  <li>Manter meus dados cadastrais sempre atualizados.</li>
                  <li>Verificar regularmente meu e-mail institucional e comunicados da plataforma.</li>
                  <li>Comunicar à coordenação qualquer dificuldade ou impedimento que afete meus estudos.</li>
                </ul>

                <h4 className="mb-2 mt-4 font-semibold text-white">5. ASPECTOS FINANCEIROS</h4>
                <ul className="mb-3 ml-4 list-disc space-y-1">
                  <li>Cumprir com os compromissos financeiros assumidos no ato da matrícula.</li>
                  <li>Estar ciente das políticas de pagamento, cancelamento e reembolso.</li>
                  <li>Comunicar eventuais dificuldades financeiras à administração com antecedência.</li>
                </ul>

                <h4 className="mb-2 mt-4 font-semibold text-white">6. CERTIFICAÇÃO</h4>
                <ul className="mb-3 ml-4 list-disc space-y-1">
                  <li>Compreendo que o certificado será emitido apenas mediante aprovação com nota mínima estabelecida.</li>
                  <li>Estou ciente dos requisitos necessários para conclusão do curso.</li>
                  <li>Entendo que o certificado tem validade para fins eclesiásticos e de conhecimento pessoal.</li>
                </ul>

                <h4 className="mb-2 mt-4 font-semibold text-white">7. PROTEÇÃO DE DADOS (LGPD)</h4>
                <ul className="mb-3 ml-4 list-disc space-y-1">
                  <li>Autorizo o Instituto Casa Bíblica a coletar, armazenar e processar meus dados pessoais.</li>
                  <li>Compreendo que meus dados serão utilizados exclusivamente para fins educacionais e administrativos.</li>
                  <li>Estou ciente de que posso solicitar acesso, correção ou exclusão dos meus dados a qualquer momento.</li>
                </ul>

                <h4 className="mb-2 mt-4 font-semibold text-white">8. DISPOSIÇÕES GERAIS</h4>
                <ul className="mb-3 ml-4 list-disc space-y-1">
                  <li>Concordo em cumprir o regimento interno e as normas estabelecidas pelo Instituto.</li>
                  <li>Estou ciente de que o descumprimento deste termo pode resultar em advertências ou desligamento.</li>
                  <li>Compreendo que o Instituto se reserva o direito de atualizar este termo quando necessário.</li>
                </ul>

                <p className="mt-4 text-xs italic">
                  Ao marcar a caixa abaixo, declaro que li, compreendi e concordo com todos os termos acima estabelecidos.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (e.target.checked && errors.terms) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.terms;
                        return newErrors;
                      });
                    }
                  }}
                  className="mt-1 h-5 w-5 cursor-pointer rounded border-cream-dark/20 bg-navy-dark text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                />
                <label htmlFor="acceptTerms" className="cursor-pointer text-sm text-cream-dark">
                  Li e aceito o <strong className="text-white">Termo de Compromisso</strong> do Instituto Casa Bíblica. Declaro estar ciente de todos os direitos e deveres como aluno(a) desta instituição. <span className="text-red-400">*</span>
                </label>
              </div>
              {errors.terms && (
                <p className="mt-2 text-xs text-red-400">{errors.terms}</p>
              )}
            </div>

            {/* Botões */}
            <div className="flex flex-col gap-3 pt-4 md:flex-row">
              <button
                type="submit"
                disabled={isSubmitting || !acceptedTerms}
                className="flex-1 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Enviando..." : "Criar Conta"}
              </button>
              <Link
                href="/login"
                className="flex-1 rounded-full border border-cream-dark/20 px-8 py-3.5 text-center text-base font-semibold text-cream-dark transition-colors hover:border-primary hover:text-primary"
              >
                Cancelar
              </Link>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-cream-dark">
              Já tem uma conta?{" "}
              <Link href="/login" className="font-semibold text-primary transition-colors hover:text-primary-light">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
