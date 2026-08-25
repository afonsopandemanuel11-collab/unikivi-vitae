"use client";

interface PrintButtonProps {
  /** Nome sugerido para o ficheiro PDF (ex: "Afonso_Pande_Manuel") */
  pdfName?: string;
}

export default function PrintButton({ pdfName }: PrintButtonProps) {
  function handlePrint() {
    if (typeof window !== "undefined") {
      // Define o título do documento antes de imprimir para que o browser
      // sugira o nome correto ao guardar como PDF
      const originalTitle = document.title;
      if (pdfName) {
        document.title = `${pdfName}_CV`;
      }
      window.print();
      // Restaura o título original após o diálogo fechar
      setTimeout(() => {
        document.title = originalTitle;
      }, 500);
    }
  }

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
    >
      <span className="material-symbols-outlined text-base">print</span>
      <span>Imprimir / Guardar PDF</span>
    </button>
  );
}
