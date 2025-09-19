export default function Banner() {
  return (
    <section className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
      <img
        src="/images/banner.jpg"
        alt="Banner Imóveis União"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Imóveis com Desconto da União
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
            Encontre oportunidades únicas com até 50% de desconto em imóveis em todo o Brasil
          </p>
        </div>
      </div>
    </section>
  );
}

