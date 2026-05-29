"use client";
import { C } from "@/lib/types";
import type { Pago } from "@/lib/types";
import { usePagos } from "@/context/PagosContext";
import { fmtARS, fmtUSD, fmtDate, diasPara, obraColor } from "@/lib/utils";
import { Card, Chip, btnP, thSt, tdSt } from "@/components/ui/primitives";
import { TODAY_STR } from "@/lib/types";

export default function CalendarioPage() {
  const { obras, pagos, setPagos } = usePagos();
  const obraCod = (id: string) => obras.find(o => o.id === id)?.codigo || id;
  const marcarPagado = (id: string) => setPagos(prev => prev.map(p => p.id === id ? { ...p, estado: "Pagado", fechaPagoReal: TODAY_STR } : p));

  const pendientes = [...pagos].filter(p => p.estado !== "Pagado").sort((a, b) => new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime());

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <p style={{ margin: "0 0 4px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.cemento }}>Cronograma</p>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 300, color: C.abismo }}>Calendario de Vencimientos</h1>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: C.cemento }}>{pendientes.length} pago{pendientes.length !== 1 ? "s" : ""} pendiente{pendientes.length !== 1 ? "s" : ""}</p>
      </div>
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Fecha","Obra","Concepto","Mon.","Monto","Días","Estado","Comentario",""].map(h => <th key={h} style={thSt}>{h}</th>)}</tr></thead>
          <tbody>
            {pendientes.map(p => {
              const d = diasPara(p.fechaLimite);
              const col = p.estado === "Vencido" ? C.vencido : d <= 3 ? C.warning : C.acero;
              return (
                <tr key={p.id} style={{ borderLeft: p.estado === "Vencido" ? `3px solid ${C.vencido}` : d <= 7 ? `3px solid ${C.warning}` : "3px solid transparent" }}>
                  <td style={{ ...tdSt, fontWeight: 600, color: col }}>{fmtDate(p.fechaLimite)}</td>
                  <td style={tdSt}><span style={{ background: obraColor(p.obraId), color: "#fff", padding: "2px 8px", borderRadius: 2, fontSize: 11, fontWeight: 700 }}>{obraCod(p.obraId)}</span></td>
                  <td style={tdSt}>{p.concepto}</td>
                  <td style={tdSt}><span style={{ fontSize: 11, fontWeight: 700, color: p.moneda === "USD" ? "#3B4A6B" : C.acero }}>{p.moneda}</span></td>
                  <td style={{ ...tdSt, fontWeight: 600 }}>{p.moneda === "USD" ? fmtUSD(p.montoCuota) : fmtARS(p.montoCuota)}{p.moneda === "USD" && p.tipoCambio && <span style={{ display: "block", fontSize: 10, color: C.cemento }}>TC {p.tipoCambio}</span>}</td>
                  <td style={{ ...tdSt, fontWeight: 700, color: col }}>{p.estado === "Vencido" ? `${Math.abs(d)}d venc.` : `${d}d`}</td>
                  <td style={tdSt}><Chip label={p.estado}/></td>
                  <td style={{ ...tdSt, color: C.cemento, fontSize: 12, fontStyle: p.comentario ? "normal" : "italic", maxWidth: 180 }}>{p.comentario || "—"}</td>
                  <td style={tdSt}><button onClick={() => marcarPagado(p.id)} style={{ ...btnP, padding: "4px 10px", fontSize: 10 }}>✓ Pagar</button></td>
                </tr>
              );
            })}
            {pendientes.length === 0 && <tr><td colSpan={9} style={{ padding: "36px", textAlign: "center", color: C.niebla }}>Sin vencimientos pendientes ✓</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
