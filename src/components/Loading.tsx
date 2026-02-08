import Image from "next/image";

export function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <Image
            src="/logo-2ipi.jpg"
            alt="Instituto Casa Bíblica"
            width={80}
            height={80}
            className="rounded-xl animate-pulse"
          />
          <div className="absolute inset-0 rounded-xl border-2 border-primary animate-spin border-t-transparent"></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-cream">Carregando</span>
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}