import Link from "next/link";

export default function ExploreSection() {
  return (
    <section className="py-section-gap bg-primary-container relative overflow-hidden">
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary opacity-20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-secondary-fixed-dim opacity-10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="font-headline-lg text-on-primary-container mb-4 text-3xl md:text-4xl">
            Explore a UNIKIVI Vitae
          </h2>
          <p className="font-body-lg text-on-primary-container/80 mb-8 max-w-lg mx-auto md:mx-0">
            Descubra investigadores, projetos e especialistas através do nosso diretório público. Uma rede
            de conhecimento à sua disposição.
          </p>
          <Link
            href="/pesquisa"
            className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-on-primary-fixed-variant transition-all text-label-sm font-label-sm inline-block shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Explorar plataforma
          </Link>
        </div>
        <div className="md:w-1/2">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl shadow-2xl h-64 md:h-96 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-white/40">travel_explore</span>
          </div>
        </div>
      </div>
    </section>
  );
}