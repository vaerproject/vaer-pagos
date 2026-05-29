import type { Acta } from "@/lib/types";

type RGB3 = [number, number, number];

const RGB = {
  abismo:  [2,   17,  27 ] as RGB3,
  acero:   [47,  72,  88 ] as RGB3,
  cemento: [91,  87,  80 ] as RGB3,
  niebla:  [207, 210, 205] as RGB3,
  notasBg: [245, 244, 242] as RGB3,
};

const ML = 18;
const MR = 18;

function fmtFecha(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export async function downloadActaPDF(acta: Acta): Promise<void> {
  // Named import — compatible with jsPDF 4.x
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const PW  = 210;
  const PH  = 297;
  const CW  = PW - ML - MR;
  let   y   = 22;
  const LH  = 5.8;

  const tc  = (c: RGB3) => doc.setTextColor(c[0], c[1], c[2]);
  const dc  = (c: RGB3) => doc.setDrawColor(c[0], c[1], c[2]);
  const fc  = (c: RGB3) => doc.setFillColor(c[0], c[1], c[2]);

  const addPage = () => { doc.addPage(); y = 22; };
  const chkPage = (h: number) => { if (y + h > PH - 22) addPage(); };

  // Render text with real per-character letter-spacing
  const spaced = (
    text: string,
    x: number,
    ry: number,
    gap: number,
    align: "left" | "right" = "left",
  ) => {
    let totalW = 0;
    for (let i = 0; i < text.length; i++) {
      totalW += doc.getTextWidth(text[i]);
      if (i < text.length - 1) totalW += gap;
    }
    let cx = align === "right" ? x - totalW : x;
    for (const ch of text) {
      doc.text(ch, cx, ry);
      cx += doc.getTextWidth(ch) + gap;
    }
  };

  // ── HEADER ───────────────────────────────────────────────────

  // Left — V A E R wordmark
  doc.setFont("helvetica", "normal");
  doc.setFontSize(24);
  tc(RGB.abismo);
  spaced("VAER", ML, y, 4);

  // Right — "DOCUMENTO INTERNO" small + "Acta de Reunion"
  doc.setFontSize(6.5);
  tc(RGB.cemento);
  spaced("DOCUMENTO INTERNO", PW - MR, y - 7, 1.4, "right");

  doc.setFontSize(17);
  doc.setFont("helvetica", "normal");
  tc(RGB.abismo);
  doc.text("Acta de Reunion", PW - MR, y, { align: "right" });

  // Dark horizontal rule
  y += 7;
  dc(RGB.abismo);
  doc.setLineWidth(0.6);
  doc.line(ML, y, PW - MR, y);
  y += 13;

  // ── OBRA / FECHA ─────────────────────────────────────────────
  const col2 = ML + CW / 2 + 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  tc(RGB.cemento);
  spaced("OBRA / PROYECTO", ML, y, 1.1);
  spaced("FECHA", col2, y, 1.1);
  y += 7;

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  tc(RGB.abismo);
  doc.text(acta.obra || "—", ML, y);
  doc.text(fmtFecha(acta.fecha), col2, y);
  y += 3;

  // Underlines
  dc(RGB.niebla);
  doc.setLineWidth(0.3);
  doc.line(ML, y, col2 - 4, y);
  doc.line(col2, y, PW - MR, y);
  y += 14;

  // ── ITEMS ────────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  tc(RGB.cemento);
  spaced("TEMAS TRATADOS / PENDIENTES", ML, y, 1.1);
  y += 4;

  dc(RGB.niebla);
  doc.setLineWidth(0.3);
  doc.line(ML, y, PW - MR, y);
  y += 9;

  const NUM_X = ML + 2;
  const TX    = ML + 14;
  const TW    = PW - MR - TX;

  acta.items.forEach((item, idx) => {
    const lines = doc.splitTextToSize(item.text || "(sin texto)", TW) as string[];
    const blockH = lines.length * LH + 9;
    chkPage(blockH);

    // Number — tiny, light
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    tc(RGB.niebla);
    doc.text(String(idx + 1).padStart(2, "0"), NUM_X, y);

    // Text
    doc.setFontSize(10.5);
    doc.setFont("helvetica", "normal");
    tc(item.done ? RGB.cemento : RGB.abismo);
    doc.text(lines, TX, y);

    // Strikethrough for resolved items
    if (item.done) {
      dc(RGB.cemento);
      doc.setLineWidth(0.25);
      lines.forEach((line: string, li: number) => {
        const lw = doc.getTextWidth(line);
        doc.line(TX, y + li * LH - 1.3, TX + lw, y + li * LH - 1.3);
      });
    }

    y += lines.length * LH + 3;

    // Separator
    dc(RGB.niebla);
    doc.setLineWidth(0.15);
    doc.line(ML, y + 1.5, PW - MR, y + 1.5);
    y += 7;
  });

  if (acta.items.length === 0) {
    doc.setFontSize(10);
    tc(RGB.niebla);
    doc.text("Sin items registrados.", ML, y);
    y += 12;
  }

  // ── NOTAS ────────────────────────────────────────────────────
  y += 6;
  const notasContent = acta.notas?.trim();
  const notasLines   = notasContent
    ? (doc.splitTextToSize(notasContent, CW - 10) as string[])
    : null;
  const boxH = Math.max(
    (notasLines ? notasLines.length * LH : 0) + 16,
    30,
  );
  chkPage(boxH + 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  tc(RGB.cemento);
  spaced("OBSERVACIONES / NOTAS ADICIONALES", ML, y, 1.1);
  y += 4;

  dc(RGB.niebla);
  doc.setLineWidth(0.3);
  doc.line(ML, y, PW - MR, y);
  y += 5;

  fc(RGB.notasBg);
  doc.rect(ML, y, CW, boxH, "F");
  dc(RGB.niebla);
  doc.setLineWidth(0.2);
  doc.rect(ML, y, CW, boxH, "S");

  if (notasLines) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    tc(RGB.abismo);
    doc.text(notasLines, ML + 6, y + 9);
  } else {
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "italic");
    tc(RGB.niebla);
    doc.text("Agregar notas, acuerdos o comentarios...", ML + 6, y + 10);
  }

  // ── FOOTER ───────────────────────────────────────────────────
  const totalPages: number = doc.getNumberOfPages
    ? doc.getNumberOfPages()
    : (doc as any).internal.getNumberOfPages?.() ?? 1;

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
    spaced("VAER - DOCUMENTO INTERNO", ML, PH - 10, 0.7);
    doc.text(
      `${resueltos}/${total} resueltos · ${fmtFecha(acta.fecha)}`,
      PW - MR,
      PH - 10,
      { align: "right" },
    );
  }

  const slug = (acta.obra || "acta")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();
  doc.save(`acta-${slug}-${acta.fecha || "sin-fecha"}.pdf`);
}
