import type { Acta } from "@/lib/types";

type RGB3 = [number, number, number];

const RGB = {
  abismo:  [2,   17,  27 ] as RGB3,
  acero:   [47,  72,  88 ] as RGB3,
  cemento: [91,  87,  80 ] as RGB3,
  niebla:  [207, 210, 205] as RGB3,
  notasBg: [245, 244, 242] as RGB3,
};

function fmtFecha(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export async function downloadActaPDF(acta: Acta): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const PW   = 210;
  const PH   = 297;
  const ML   = 20;
  const MR   = 20;
  const CW   = PW - ML - MR;
  let   y    = 24;
  const LH   = 5.5;

  // ── helpers ──────────────────────────────────────────────────
  const tc = (c: RGB3) => doc.setTextColor(c[0], c[1], c[2]);
  const dc = (c: RGB3) => doc.setDrawColor(c[0], c[1], c[2]);
  const fc = (c: RGB3) => doc.setFillColor(c[0], c[1], c[2]);

  const addPage  = () => { doc.addPage(); y = 24; };
  const chkPage  = (h: number) => { if (y + h > PH - 20) addPage(); };

  // Renders text with per-character spacing (reliable across jsPDF versions)
  const spaced = (text: string, x: number, baseY: number, gap: number, align: "left" | "right" = "left") => {
    let total = 0;
    for (let i = 0; i < text.length; i++) {
      total += doc.getTextWidth(text[i]);
      if (i < text.length - 1) total += gap;
    }
    let cx = align === "right" ? x - total : x;
    for (const ch of text) {
      doc.text(ch, cx, baseY);
      cx += doc.getTextWidth(ch) + gap;
    }
  };

  // ── HEADER ───────────────────────────────────────────────────

  // Left — "V A E R" wordmark
  doc.setFont("helvetica", "normal");
  doc.setFontSize(22);
  tc(RGB.abismo);
  spaced("VAER", ML, y, 3.5);

  // Right top — "DOCUMENTO INTERNO" small, spaced
  doc.setFontSize(6.5);
  tc(RGB.cemento);
  spaced("DOCUMENTO INTERNO", PW - MR, y - 7, 1.4, "right");

  // Right — "Acta de Reunion"
  doc.setFontSize(16);
  tc(RGB.abismo);
  doc.text("Acta de Reunion", PW - MR, y, { align: "right" });

  // Rule
  y += 7;
  dc(RGB.abismo);
  doc.setLineWidth(0.5);
  doc.line(ML, y, PW - MR, y);
  y += 12;

  // ── OBRA / FECHA ─────────────────────────────────────────────
  const col2 = ML + CW / 2 + 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  tc(RGB.cemento);
  spaced("OBRA / PROYECTO", ML, y, 1.2);
  spaced("FECHA", col2, y, 1.2);
  y += 7;

  doc.setFontSize(13);
  tc(RGB.abismo);
  doc.text(acta.obra || "—", ML, y);
  doc.text(fmtFecha(acta.fecha), col2, y);
  y += 3;

  // Underlines below values (full-width of each column)
  dc(RGB.niebla);
  doc.setLineWidth(0.3);
  doc.line(ML, y, col2 - 6, y);
  doc.line(col2, y, PW - MR, y);
  y += 13;

  // ── ITEMS ────────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  tc(RGB.cemento);
  spaced("TEMAS TRATADOS / PENDIENTES", ML, y, 1.2);
  y += 4;

  dc(RGB.niebla);
  doc.setLineWidth(0.3);
  doc.line(ML, y, PW - MR, y);
  y += 8;

  const NUM_W = 10;
  const TX    = ML + NUM_W;
  const TW    = CW - NUM_W;

  acta.items.forEach((item, idx) => {
    const lines = doc.splitTextToSize(item.text || "(sin texto)", TW) as string[];
    chkPage(lines.length * LH + 8);

    // Number — small, light
    doc.setFontSize(7.5);
    tc(RGB.niebla);
    doc.text(String(idx + 1).padStart(2, "0"), ML, y);

    // Text
    doc.setFontSize(10.5);
    tc(item.done ? RGB.cemento : RGB.abismo);
    doc.text(lines, TX, y);

    // Strikethrough for resolved items
    if (item.done) {
      dc(RGB.cemento);
      doc.setLineWidth(0.25);
      lines.forEach((line: string, li: number) => {
        const lw = doc.getTextWidth(line);
        doc.line(TX, y + li * LH - 1.2, TX + lw, y + li * LH - 1.2);
      });
    }

    y += lines.length * LH + 3;

    // Item separator
    dc(RGB.niebla);
    doc.setLineWidth(0.2);
    doc.line(ML, y + 1, PW - MR, y + 1);
    y += 6;
  });

  if (acta.items.length === 0) {
    doc.setFontSize(10);
    tc(RGB.niebla);
    doc.text("Sin items registrados.", ML, y);
    y += 10;
  }

  // ── NOTAS ────────────────────────────────────────────────────
  y += 5;
  const notasContent = acta.notas?.trim();
  const notasLines   = notasContent
    ? (doc.splitTextToSize(notasContent, CW - 10) as string[])
    : null;
  const boxH = Math.max((notasLines ? notasLines.length : 0) * LH + 16, 30);

  chkPage(boxH + 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  tc(RGB.cemento);
  spaced("OBSERVACIONES / NOTAS ADICIONALES", ML, y, 1.2);
  y += 4;

  dc(RGB.niebla);
  doc.setLineWidth(0.3);
  doc.line(ML, y, PW - MR, y);
  y += 5;

  // Gray box
  fc(RGB.notasBg);
  doc.rect(ML, y, CW, boxH, "F");
  dc(RGB.niebla);
  doc.setLineWidth(0.2);
  doc.rect(ML, y, CW, boxH, "S");

  if (notasLines) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    tc(RGB.abismo);
    doc.text(notasLines, ML + 5, y + 8);
  } else {
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "italic");
    tc(RGB.niebla);
    doc.text("Agregar notas, acuerdos o comentarios...", ML + 5, y + 9);
  }

  // ── FOOTER (todas las páginas) ────────────────────────────────
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    const resueltos = acta.items.filter(i => i.done).length;
    const total     = acta.items.length;

    dc(RGB.niebla);
    doc.setLineWidth(0.2);
    doc.line(ML, PH - 14, PW - MR, PH - 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    tc(RGB.cemento);
    spaced("VAER - DOCUMENTO INTERNO", ML, PH - 10, 0.8);
    doc.text(`${resueltos}/${total} resueltos · ${fmtFecha(acta.fecha)}`, PW - MR, PH - 10, { align: "right" });
  }

  const slug = (acta.obra || "acta")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();
  doc.save(`acta-${slug}-${acta.fecha || "sin-fecha"}.pdf`);
}
