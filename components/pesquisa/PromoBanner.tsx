export default function PromoBanner() {
  return (
    <div className="bg-primary-container/10 border border-primary/20 rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-primary text-3xl">person_add</span>
        <div>
          <h4 className="font-headline-md text-body-lg font-bold text-primary">
            Gostaria de ter o seu próprio perfil académico?
          </h4>
          <p className="font-body-md text-on-surface-variant">
            Junte-se à UNIKIVI Vitae e aumente a visibilidade da sua investigação.
          </p>
        </div>
      </div>
      <a
        href="/registo"
        className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-sm hover:bg-primary-container transition-all whitespace-nowrap"
      >
        REGISTAR AGORA
      </a>
    </div>
  );
}