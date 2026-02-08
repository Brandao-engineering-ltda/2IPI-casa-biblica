export function VideoSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-navy md:text-4xl">
            Conheça o Instituto
          </h2>
          <p className="mt-4 text-lg text-navy-light">
            Assista e descubra como o Instituto Casa Bíblica pode transformar
            sua caminhada com a Palavra
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl shadow-lg">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/uPJlTDGiVtw"
              title="Instituto Casa Bíblica — 2ª IPI de Maringá"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
