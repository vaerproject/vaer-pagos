import type { Acta } from "@/lib/types";

const RGB = {
  abismo:  [2,   17,  27 ] as [number, number, number],
  acero:   [47,  72,  88 ] as [number, number, number],
  cemento: [91,  87,  80 ] as [number, number, number],
  niebla:  [207, 210, 205] as [number, number, number],
  blanco:  [251, 251, 251] as [number, number, number],
};

function fmtFecha(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export async function downloadActaPDF(acta: Acta): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const PW     = 210;
  const PH     = 297;
  const ML     = 20;
  const MR     = 20;
  const CW     = PW - ML - MR;
  let   y      = ML;
  const LINE_H = 5.5;

  const addPage = () => { doc.addPage(); y = ML; };
  const checkPage = (needed: number) => { if (y + needed > PH - 18) addPage(); };

  // ── HEADER ─────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...RGB.acero);
  doc.text("VAER", ML, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(...RGB.abismo);
  doc.text("Acta de Reunion", PW - MR, y, { align: "right" });

  y += 4;
  doc.setDrawColor(...RGB.niebla);
  doc.setLineWidth(0.4);
  doc.line(ML, y, PW - MR, y);
  y += 9;

  // ── OBRA + FECHA ────────────────────────────────────────────
  const col2 = ML + CW / 2 + 4;
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...RGB.cemento);
  doc.text("OBRA / PROYECTO", ML, y);
  doc.text("FECHA", col2, y);
  y += 5;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...RGB.abismo);
  doc.text(acta.obra || "—", ML, y);
  doc.text(fmtFecha(acta.fecha), col2, y);
  y += 9;

  // ── DIVIDER ─────────────────────────────────────────────────
  doc.setDrawColor(...RGB.niebla);
  doc.line(ML, y, PW - MR, y);
  y += 8;

  // ── ITEMS ───────────────────────────────────────────────────
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...RGB.cemento);
  doc.text("TEMAS TRATADOS / PENDIENTES", ML, y);
  y += 7;

  const NUM_W  = 10;
  const SYM_W  = 7;
  const TEXT_X = ML + NUM_W + SYM_W;
  const TEXT_W = CW - NUM_W - SYM_W;

  acta.items.forEach((item, idx) => {
    const lines = doc.splitTextToSize(item.text || "(sin texto)", TEXT_W) as string[];
    const blockH = lines.length * LINE_H + 5;
    checkPage(blockH);

    const numStr = String(idx + 1).padStart(2, "0") + ".";
    const sym    = item.done ? "(ok)" : "( )";
    const col    = item.done ? RGB.acero : RGB.abismo;

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RGB.cemento);
    doc.text(numStr, ML, y);

    doc.setFont("helvetica", item.done ? "italic" : "normal");
    doc.setFontSize(8);
    doc.setTextColor(...RGB.cemento);
    doc.text(sym, ML + NUM_W, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...col);
    doc.text(lines, TEXT_X, y);

    if (item.done) {
      lines.forEach((line, li) => {
        const lw  = doc.getTextWidth(line);
        const ly  = y + li * LINE_H - 1;
        doc.setDrawColor(...RGB.acero);
        doc.setLineWidth(0.25);
        doc.line(TEXT_X, ly, TEXT_X + lw, ly);
      });
    }

    y += blockH - 1;
  });

  if (acta.items.length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(...RGB.niebla);
    doc.text("Sin items registrados.", ML, y);
    y += 8;
  }

  // ── NOTAS ───────────────────────────────────────────────────
  if (acta.notas?.trim()) {
    y += 4;
    checkPage(20);
    doc.setDrawColor(...RGB.niebla);
    doc.line(ML, y, PW - MR, y);
    y += 8;

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RGB.cemento);
    doc.text("NOTAS", ML, y);
    y += 6;

    const notasLines = doc.splitTextToSize(acta.notas, CW) as string[];
    checkPage(notasLines.length * LINE_H + 4);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...RGB.abismo);
    doc.text(notasLines, ML, y);
    y += notasLines.length * LINE_H + 4;
  }

  // ── FOOTER (todas las páginas) ───────────────────────────────
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    const resueltos = acta.items.filter(i => i.done).length;
    const total     = acta.items.length;
    const footerR   = `${resueltos}/${total} resueltos · ${fmtFecha(acta.fecha)}`;

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...RGB.cemento);
    doc.text("VAER — Documento interno", ML, PH - 10);
    doc.text(footerR, PW - MR, PH - 10, { align: "right" });

    if (totalPages > 1) {
      doc.text(`${p} / ${totalPages}`, PW / 2, PH - 10, { align: "center" });
    }

    doc.setDrawColor(...RGB.niebla);
    doc.setLineWidth(0.25);
    doc.line(ML, PH - 13, PW - MR, PH - 13);
  }

  const slug = (acta.obra || "acta").replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
  doc.save(`acta-${slug}-${acta.fecha || "sin-fecha"}.pdf`);
}
