"use client";
import Link from "next/link";
import { C } from "@/lib/types";
import { usePagos } from "@/context/PagosContext";
import { ActaListItem } from "@/components/actas/ActaListItem";
import { btnP } from "@/components/ui/primitives";

export default function ActasPage() {
  const { actas, setActas } = usePagos();

  const deleteActa = (id: string) =>
    setActas(prev => prev.filter(a => a.id !== id));

  const sorted = [...actas].sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 26 }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.cemento }}>Documentación</p>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 300, color: C.abismo }}>Actas de Reunión</h1>
          {actas.length > 0 && (
            <p style={{ margin: "5px 0 0", fontSize: 12, color: C.cemento }}>
              {actas.length} acta{actas.length !== 1 ? "s" : ""} registrada{actas.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Link href="/pagos/actas/nueva" style={{ ...btnP, textDecoration: "none", display: "inline-block" }}>
          + Nueva Acta
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: 3, boxShadow: "0 1px 4px rgba(2,17,27,0.07)" }}>
          <p style={{ margin: "0 0 6px", fontSize: 15, color: C.cemento }}>No hay actas registradas todavía</p>
          <p style={{ margin: "0 0 20px", fontSize: 12, color: C.niebla }}>Creá la primera acta de reunión para empezar a documentar</p>
          <Link href="/pagos/actas/nueva" style={{ ...btnP, textDecoration: "none", display: "inline-block" }}>
            + Nueva Acta
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
          {sorted.map(acta => (
            <ActaListItem key={acta.id} acta={acta} onDelete={deleteActa} />
          ))}
        </div>
      )}
    </div>
  );
}
