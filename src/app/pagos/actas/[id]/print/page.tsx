"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Acta } from "@/lib/types";

function fmtFecha(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const F = {
  abismo:  "#02111B",
  cemento: "#5B5750",
  niebla:  "#CFD2CD",
  notasBg: "#F5F4F2",
};

export default function PrintActaPage() {
  const { id } = useParams<{ id: string }>();
  const [acta, setActa] = useState<Acta | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vaer-actas");
      if (saved) {
        const list: Acta[] = JSON.parse(saved);
        const found = list.find(a => a.id === id);
        if (found) setActa(found);
      }
    } catch {}
  }, [id]);

  useEffect(() => {
    if (!acta) return;
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, [acta]);

  if (!acta) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Helvetica Neue, sans-serif", color: F.cemento, fontSize: 14 }}>
        Cargando acta…
      </div>
    );
  }

  const resueltos = acta.items.filter(i => i.done).length;
  const total     = acta.items.length;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: white; }
        @media print {
          @page {
            size: A4;
            margin: 18mm 18mm 20mm 18mm;
          }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
        @media screen {
          body { padding: 40px; background: #EDECEA; }
          .page { max-width: 740px; margin: 0 auto; background: white; padding: 40px 50px 60px; box-shadow: 0 4px 24px rgba(2,17,27,0.12); }
        }
        @media print {
          body { padding: 0; background: white; }
          .page { padding: 0; box-shadow: none; }
        }
      `}</style>

      {/* Botón solo en pantalla */}
      <div className="no-print" style={{ maxWidth: 740, margin: "0 auto 16px", display: "flex", gap: 10 }}>
        <button onClick={() => window.print()} style={{ background: F.abismo, color: "white", border: "none", padding: "10px 22px", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", borderRadius: 2 }}>
          Guardar como PDF
        </button>
        <button onClick={() => window.close()} style={{ background: "transparent", color: F.cemento, border: `1px solid ${F.niebla}`, padding: "9px 16px", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", borderRadius: 2 }}>
          Cerrar
        </button>
      </div>

      <div className="page" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 300, color: F.abismo }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 400, letterSpacing: "0.28em", color: F.abismo, lineHeight: 1 }}>
            VAER
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 7.5, letterSpacing: "0.16em", color: F.cemento, marginBottom: 4, textTransform: "uppercase" }}>
              Documento Interno
            </div>
            <div style={{ fontSize: 20, fontWeight: 300, color: F.abismo, lineHeight: 1 }}>
              Acta de Reunion
            </div>
          </div>
        </div>
        <hr style={{ border: "none", borderTop: `0.6px solid ${F.abismo}`, margin: "8px 0 18px" }} />

        {/* ── OBRA / FECHA ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 24, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 7.5, letterSpacing: "0.13em", textTransform: "uppercase", color: F.cemento, marginBottom: 6 }}>
              Obra / Proyecto
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: F.abismo, paddingBottom: 5, borderBottom: `0.4px solid ${F.niebla}` }}>
              {acta.obra || "—"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 7.5, letterSpacing: "0.13em", textTransform: "uppercase", color: F.cemento, marginBottom: 6 }}>
              Fecha
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: F.abismo, paddingBottom: 5, borderBottom: `0.4px solid ${F.niebla}` }}>
              {fmtFecha(acta.fecha)}
            </div>
          </div>
        </div>

        {/* ── ITEMS ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 7.5, letterSpacing: "0.13em", textTransform: "uppercase", color: F.cemento, marginBottom: 5 }}>
            Temas tratados / Pendientes
          </div>
          <hr style={{ border: "none", borderTop: `0.4px solid ${F.niebla}`, margin: "0 0 0" }} />

          {acta.items.length === 0 && (
            <div style={{ padding: "20px 0", fontSize: 12, color: F.niebla, fontStyle: "italic" }}>
              Sin ítems registrados.
            </div>
          )}

          {acta.items.map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: 14,
                padding: "9px 0",
                borderBottom: `0.3px solid #E4E3E0`,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 8, color: F.niebla, minWidth: 18, paddingTop: 2, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span style={{
                fontSize: 11,
                fontWeight: 300,
                lineHeight: 1.65,
                color: item.done ? F.cemento : F.abismo,
                textDecoration: item.done ? "line-through" : "none",
                flex: 1,
              }}>
                {item.text || "(sin texto)"}
              </span>
            </div>
          ))}
        </div>

        {/* ── NOTAS ── */}
        <div>
          <div style={{ fontSize: 7.5, letterSpacing: "0.13em", textTransform: "uppercase", color: F.cemento, marginBottom: 5 }}>
            Observaciones / Notas adicionales
          </div>
          <hr style={{ border: "none", borderTop: `0.4px solid ${F.niebla}`, margin: "0 0 8px" }} />
          <div style={{
            background: F.notasBg,
            border: `0.5px solid ${F.niebla}`,
            padding: "12px 16px",
            minHeight: 64,
            fontSize: 11,
            fontWeight: 300,
            lineHeight: 1.65,
            color: acta.notas?.trim() ? F.abismo : F.niebla,
            fontStyle: acta.notas?.trim() ? "normal" : "italic",
          }}>
            {acta.notas?.trim() || "Agregar notas, acuerdos o comentarios…"}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          marginTop: 40,
          paddingTop: 8,
          borderTop: `0.3px solid ${F.niebla}`,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 7.5,
          letterSpacing: "0.09em",
          color: F.cemento,
        }}>
          <span>VAER - DOCUMENTO INTERNO</span>
          <span>{resueltos}/{total} resueltos · {fmtFecha(acta.fecha)}</span>
        </div>
      </div>
    </>
  );
}
