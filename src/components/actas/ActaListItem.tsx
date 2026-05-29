"use client";
import Link from "next/link";
import { C } from "@/lib/types";
import type { Acta } from "@/lib/types";
import { Card, btnP, btnS } from "@/components/ui/primitives";
import { downloadActaPDF } from "@/lib/actasPdf";

function fmtFecha(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

interface Props {
  acta:     Acta;
  onDelete: (id: string) => void;
}

export function ActaListItem({ acta, onDelete }: Props) {
  const resueltos = acta.items.filter(i => i.done).length;
  const total     = acta.items.length;
  const pct       = total > 0 ? Math.round((resueltos / total) * 100) : 0;
  const allDone   = total > 0 && resueltos === total;

  return (
    <Card style={{ borderTop: `3px solid ${allDone ? C.ok : C.acero}` }}>
      <div style={{ padding: "18px 22px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <h3 style={{ margin: "0 0 3px", fontSize: 15, fontWeight: 500, color: C.abismo }}>
              {acta.obra || <span style={{ color: C.niebla, fontStyle: "italic" }}>Sin nombre de obra</span>}
            </h3>
            <p style={{ margin: 0, fontSize: 11, color: C.cemento }}>{fmtFecha(acta.fecha)}</p>
          </div>
          {allDone && (
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: C.ok, background: "rgba(46,94,62,0.1)", padding: "3px 9px", borderRadius: 2 }}>
              Completa
            </span>
          )}
        </div>

        {/* Barra de progreso */}
        {total > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: C.cemento }}>{resueltos}/{total} ítems resueltos</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: allDone ? C.ok : C.acero }}>{pct}%</span>
            </div>
            <div style={{ background: "#E4E3E0", borderRadius: 2, height: 4 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: allDone ? C.ok : C.acero, borderRadius: 2, transition: "width 0.3s" }} />
            </div>
          </div>
        )}

        {total === 0 && (
          <p style={{ margin: "0 0 10px", fontSize: 12, color: C.niebla, fontStyle: "italic" }}>Sin ítems registrados</p>
        )}

        {/* Preview items */}
        {acta.items.slice(0, 3).map((item, i) => (
          <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: item.done ? C.ok : C.cemento, marginTop: 1, flexShrink: 0 }}>
              {item.done ? "✓" : "○"}
            </span>
            <span style={{ fontSize: 12, color: item.done ? C.cemento : C.abismo, textDecoration: item.done ? "line-through" : "none", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 340 }}>
              {item.text || "(sin texto)"}
            </span>
          </div>
        ))}
        {total > 3 && (
          <p style={{ margin: "4px 0 0", fontSize: 11, color: C.niebla }}>+{total - 3} ítems más…</p>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${C.niebla}`, padding: "10px 22px", background: "#F5F4F2", display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
          type="button"
          onClick={() => downloadActaPDF(acta)}
          style={{ ...btnS, padding: "5px 14px", fontSize: 10 }}
        >
          ↓ PDF
        </button>
        <Link href={`/pagos/actas/${acta.id}`} style={{ ...btnS, padding: "5px 14px", fontSize: 10, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
          Editar
        </Link>
        <button
          type="button"
          onClick={() => { if (confirm("¿Eliminar esta acta?")) onDelete(acta.id); }}
          style={{ ...btnS, padding: "5px 12px", fontSize: 10, color: C.vencido, borderColor: "rgba(122,48,48,0.25)" }}
        >
          Eliminar
        </button>
      </div>
    </Card>
  );
}
