"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { savePurchasedCourse } from "@/lib/storage";
import { getCourse, type CourseData } from "@/lib/courses";
import { useAuth } from "@/contexts/AuthContext";

export default function InscricaoPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<"pix" | "cartao" | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const data = await getCourse(courseId);
        setCourse(data);
      } catch {
        // Firestore unavailable
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-dark">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-cream-dark">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy">Curso não encontrado</h1>
          <Link href="/courses" className="mt-4 inline-block text-primary hover:text-primary-dark">
            ← Voltar para cursos
          </Link>
        </div>
      </div>
    );
  }

  const totalPix = course.pricePix * quantity;
  const totalCartao = course.priceCard * quantity;
  const parcelaCartao = totalCartao / course.installments;

  const handlePayment = async () => {
    if (!selectedPayment || !user) return;

    setIsProcessing(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const amount = selectedPayment === "pix" ? totalPix : totalCartao;
    await savePurchasedCourse(user.uid, {
      courseId: course.id,
      purchaseDate: new Date().toISOString(),
      paymentMethod: selectedPayment,
      amount: amount,
      status: "paid",
    });

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-navy-dark">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/course/${course.id}`} className="inline-flex items-center text-cream-dark hover:text-primary transition-colors">
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para o curso
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Course Info - Left Side */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-cream-dark/10 bg-navy p-8 shadow-xl">
              <h1 className="mb-2 text-3xl font-bold text-white">Inscrição</h1>
              <p className="mb-6 text-cream-dark">Complete sua inscrição no curso</p>

              {/* Course Details */}
              <div className="mb-6 rounded-xl bg-navy-dark p-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="mb-2 text-xl font-bold text-white">{course.title}</h2>
                    <p className="mb-3 text-sm text-cream-dark">{course.description}</p>
                    <div className="grid gap-2 text-xs text-cream-dark">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{course.startDate} - {course.endDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{course.duration} • {course.totalHours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{course.format}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Professor: {course.instructor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Information */}
              <div className="rounded-xl border border-primary/20 bg-navy-dark p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Informações Importantes
                </h3>
                <ul className="space-y-2 text-sm text-cream-dark">
                  <li className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>A inscrição só é válida após confirmação do pagamento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Você receberá um e-mail de confirmação com os detalhes do curso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Cancelamento com mais de 15 dias: reembolso integral</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Material didático digital incluído no valor da inscrição</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Options - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="rounded-2xl border border-cream-dark/10 bg-navy p-6 shadow-xl">
                <h3 className="mb-6 text-xl font-bold text-white">Selecione a Inscrição</h3>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-cream-dark">
                    Quantidade de Inscrições
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-cream-dark/20 text-cream hover:border-primary hover:text-primary transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-10 w-16 rounded-lg border border-cream-dark/20 bg-navy-dark px-3 text-center text-cream outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-cream-dark/20 text-cream hover:border-primary hover:text-primary transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* PIX Option */}
                <div
                  onClick={() => setSelectedPayment("pix")}
                  className={`mb-4 cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    selectedPayment === "pix"
                      ? "border-primary bg-primary/10"
                      : "border-cream-dark/20 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={selectedPayment === "pix"}
                          onChange={() => setSelectedPayment("pix")}
                          className="h-4 w-4 text-primary"
                        />
                        <span className="font-bold text-white">PIX</span>
                      </div>
                      <p className="mt-1 text-xs text-cream-dark">Pagamento à vista</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        R$ {totalPix.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Credit Card Option */}
                <div
                  onClick={() => setSelectedPayment("cartao")}
                  className={`mb-6 cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    selectedPayment === "cartao"
                      ? "border-primary bg-primary/10"
                      : "border-cream-dark/20 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={selectedPayment === "cartao"}
                          onChange={() => setSelectedPayment("cartao")}
                          className="h-4 w-4 text-primary"
                        />
                        <span className="font-bold text-white">CARTÃO DE CRÉDITO</span>
                      </div>
                      <p className="mt-1 text-xs text-cream-dark">
                        Em até {course.installments}x R$ {parcelaCartao.toFixed(2)}
                      </p>
                      <p className="text-xs text-cream-dark">Sem juros</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        R$ {totalCartao.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-4 rounded-lg bg-navy-dark p-4">
                  <div className="flex items-center justify-between text-cream-dark">
                    <span className="text-sm">Total de Inscrições:</span>
                    <span className="font-bold">{quantity}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handlePayment}
                  disabled={!selectedPayment || isProcessing}
                  className="w-full rounded-full bg-primary px-8 py-4 text-base font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing ? "Processando..." : "Fazer Pedido Agora"}
                </button>

                <p className="mt-4 text-center text-xs text-cream-dark">
                  Pagamento processado com segurança via{" "}
                  <span className="font-semibold text-primary">transforme.tech</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
