"use client";
import { useState } from "react";
import { C, CAT_GASTOS, MESES_NOMBRES, MESES_CORTOS } from "@/lib/types";
import type { GastoFijo, GastoPuntual } from "@/lib/types";
import { usePagos } from "@/context/PagosContext";
import { fmtARS, fmtUSD, fmtDate } from "@/lib/utils";
import { Card, CardHead, Modal, G, Field, iSt, btnP, btnS, thSt, tdSt } from "@/components/ui/primitives";
import { TODAY_STR } from "@/lib/types";

export default function GastosPage() {
  const { gastosFijos, setGastosFijos, pagosFijos, setPagosFijos, gastosPuntuales, setGastosPuntuales } = usePagos();
  const [mes, setMes]     = useState(new Date().getMonth());
  const [anio, setAnio]   = useState(new Date().getFullYear());
  const [modal, setModal] = useState<string | null>(null);
  const [form, setForm]   = useState<any>({});
  const ff = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((prev: any) => ({ ...prev, [k]: e.target.value }));

  const fmtG = (monto: number, moneda: string) => moneda === "USD" ? fmtUSD(monto) : fmtARS(monto);
  const getPagoFijo = (gastoId: string, anio: number, mes: number) => pagosFijos.find(p => p.gastoId === gastoId && p.anio === anio && p.mes === mes);
  const togglePago = (gastoId: string) => {
    setPagosFijos(prev => {
      const idx = prev.findIndex(p => p.gastoId === gastoId && p.anio === anio && p.mes === mes);
      if (idx >= 0) return prev.map((p, i) => i === idx ? { ...p, pagado: !p.pagado, fechaPago: !p.pagado ? TODAY_STR : null } : p);
      return [...prev, { gastoId, anio, mes, pagado: true, fechaPago: TODAY_STR }];
    });
  };

  const activos = gastosFijos.filter(g => g.activo);
  const totalFijosARS = activos.filter(g => g.moneda === "ARS").reduce((s, g) => s + g.monto, 0);
  const totalFijosUSD = activos.filter(g => g.moneda === "USD").reduce((s, g) => s + g.monto, 0);
  const pagsDelMes = activos.map(g => ({ ...g, pago: getPagoFijo(g.id, anio, mes) }));
  const pagadosARS = pagsDelMes.filter(g => g.moneda === "ARS" && g.pago?.pagado).reduce((s, g) => s + g.monto, 0);
  const pendientesARS = totalFijosARS - pagadosARS;
  const puntualesMes = gastosPuntuales.filter(g => { const d = new Date(g.fecha); return d.getFullYear() === anio && d.getMonth() === mes; });
  const puntARS = puntualesMes.filter(g => g.moneda === "ARS").reduce((s, g) => s + g.monto, 0);

  const openNuevoFijo   = () => { setForm({ concepto: "", categoria: "Alquiler", moneda: "ARS", monto: "", dia: "1", activo: true, comentario: "" }); setModal("nuevoGF"); };
  const openEditFijo    = (g: GastoFijo) => { setForm({ ...g, monto: String(g.monto), dia: String(g.dia) }); setModal(`editGF:${g.id}`); };
  const saveFijo = () => {
    const d: GastoFijo = { ...form, monto: Number(form.monto), dia: Number(form.dia) };
    if (modal === "nuevoGF") setGastosFijos(prev => [...prev, { ...d, id: "GF-" + String(prev.length + 1).padStart(2, "0") }]);
    else setGastosFijos(prev => prev.map(g => g.id === form.id ? { ...g, ...d } : g));
    setModal(null);
  };
  const openNuevoPuntual = () => { setForm({ concepto: "", categoria: "Insumos de oficina", moneda: "ARS", monto: "", fecha: TODAY_STR, comentario: "" }); setModal("nuevoGP"); };
  const openEditPuntual  = (g: GastoPuntual) => { setForm({ ...g, monto: String(g.monto) }); setModal(`editGP:${g.id}`); };
  const savePuntual = () => {
    const d: GastoPuntual = { ...form, monto: Number(form.monto) };
    if (modal === "nuevoGP") setGastosPuntuales(prev => [...prev, { ...d, id: "GP-" + String(prev.length + 1).padStart(3, "0") }]);
    else setGastosPuntuales(prev => prev.map(g => g.id === form.id ? { ...g, ...d } : g));
    setModal(null);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.cemento }}>Administración</p>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 300, color: C.abismo }}>Gastos de Oficina</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select value={mes} onChange={e => setMes(Number(e.target.value))} style={{ ...iSt, width: 140, fontSize: 11 }}>
            {MESES_NOMBRES.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={anio} onChange={e => setAnio(Number(e.target.value))} style={{ ...iSt, width: 82, fontSize: 11 }}>
            {[2025, 2026, 2027].map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { l: `Fijos ARS — ${MESES_CORTOS[mes]}`, v: fmtARS(totalFijosARS), a: C.acero, s: "total mensual" },
          { l: `Fijos USD — ${MESES_CORTOS[mes]}`, v: fmtUSD(totalFijosUSD), a: "#3B4A6B", s: "total mensual" },
          { l: "Pendientes ARS", v: fmtARS(pendientesARS), a: pendientesARS > 0 ? C.warning : C.ok, s: pendientesARS > 0 ? "sin pagar este mes" : "todo pagado ✓" },
          { l: "Puntuales ARS", v: fmtARS(puntARS), a: C.cemento, s: `${MESES_CORTOS[mes]} ${anio}` },
        ].map(k => (
          <Card key={k.l} style={{ borderTop: `3px solid ${k.a}`, padding: "16px 20px" }}>
            <p style={{ margin: "0 0 4px", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: C.cemento, fontWeight: 600 }}>{k.l}</p>
            <p style={{ margin: "0 0 2px", fontSize: 18, fontWeight: 300, color: C.abismo }}>{k.v}</p>
            <p style={{ margin: 0, fontSize: 10, color: C.cemento }}>{k.s}</p>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ padding: "15px 22px", borderBottom: `1px solid ${C.niebla}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.09em", textTransform: "uppercase", color: C.cemento, fontWeight: 600 }}>Gastos fijos — {MESES_NOMBRES[mes]} {anio}</p>
          <button onClick={openNuevoFijo} style={{ ...btnP, padding: "6px 14px", fontSize: 10 }}>+ Agregar fijo</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Concepto","Categoría","Mon.","Monto mensual","Día","Estado","Pagado el",""].map(h => <th key={h} style={thSt}>{h}</th>)}</tr></thead>
          <tbody>
            {pagsDelMes.map((g, i) => {
              const pagado = g.pago?.pagado || false;
              return (
                <tr key={g.id} style={{ background: i % 2 === 0 ? "#FAFAF8" : "#fff" }}>
                  <td style={tdSt}><span style={{ fontWeight: 500 }}>{g.concepto}</span></td>
                  <td style={{ ...tdSt, color: C.cemento, fontSize: 11 }}>{g.categoria}</td>
                  <td style={tdSt}><span style={{ fontSize: 11, fontWeight: 700, color: g.moneda === "USD" ? "#3B4A6B" : C.acero }}>{g.moneda}</span></td>
                  <td style={{ ...tdSt, textAlign: "right", fontWeight: 600 }}>{fmtG(g.monto, g.moneda)}</td>
                  <td style={{ ...tdSt, textAlign: "right", color: C.cemento, fontSize: 11 }}>día {g.dia}</td>
                  <td style={tdSt}><span style={{ background: pagado ? "rgba(46,94,62,0.12)" : "rgba(122,92,32,0.1)", color: pagado ? C.ok : C.warning, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 2 }}>{pagado ? "Pagado" : "Pendiente"}</span></td>
                  <td style={{ ...tdSt, color: C.cemento, fontSize: 11 }}>{g.pago?.fechaPago ? fmtDate(g.pago.fechaPago) : "—"}</td>
                  <td style={tdSt}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => togglePago(g.id)} style={{ ...btnP, padding: "4px 10px", fontSize: 10, background: pagado ? C.cemento : C.ok }}>{pagado ? "↩ Desmarcar" : "✓ Pagar"}</button>
                      <button onClick={() => openEditFijo(g)} style={{ ...btnS, padding: "4px 10px", fontSize: 10 }}>Editar</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: `2px solid ${C.abismo}`, background: "#F0EFEC" }}>
              <td colSpan={3} style={{ ...tdSt, fontWeight: 700 }}>Total mensual</td>
              <td style={{ ...tdSt, textAlign: "right", fontWeight: 700 }}>
                {totalFijosARS > 0 && <span style={{ display: "block", color: C.acero }}>{fmtARS(totalFijosARS)}</span>}
                {totalFijosUSD > 0 && <span style={{ display: "block", color: "#3B4A6B" }}>{fmtUSD(totalFijosUSD)}</span>}
              </td>
              <td colSpan={2} style={{ ...tdSt, color: C.cemento, fontSize: 11 }}>Pagado: {fmtARS(pagadosARS)} · Pendiente: {fmtARS(pendientesARS)}</td>
              <td colSpan={2}/>
            </tr>
          </tfoot>
        </table>
      </Card>

      <Card>
        <div style={{ padding: "15px 22px", borderBottom: `1px solid ${C.niebla}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.09em", textTransform: "uppercase", color: C.cemento, fontWeight: 600 }}>Gastos puntuales</p>
          <button onClick={openNuevoPuntual} style={{ ...btnP, padding: "6px 14px", fontSize: 10 }}>+ Agregar gasto</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Fecha","Concepto","Categoría","Mon.","Monto","Comentario",""].map(h => <th key={h} style={thSt}>{h}</th>)}</tr></thead>
          <tbody>
            {[...gastosPuntuales].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map((g, i) => (
              <tr key={g.id} style={{ background: i % 2 === 0 ? "#FAFAF8" : "#fff" }}>
                <td style={{ ...tdSt, color: C.cemento, whiteSpace: "nowrap" }}>{fmtDate(g.fecha)}</td>
                <td style={tdSt}>{g.concepto}</td>
                <td style={{ ...tdSt, color: C.cemento, fontSize: 11 }}>{g.categoria}</td>
                <td style={tdSt}><span style={{ fontSize: 11, fontWeight: 700, color: g.moneda === "USD" ? "#3B4A6B" : C.acero }}>{g.moneda}</span></td>
                <td style={{ ...tdSt, textAlign: "right", fontWeight: 600 }}>{fmtG(g.monto, g.moneda)}</td>
                <td style={{ ...tdSt, color: C.cemento, fontSize: 12, fontStyle: g.comentario ? "normal" : "italic" }}>{g.comentario || "—"}</td>
                <td style={tdSt}><button onClick={() => openEditPuntual(g)} style={{ ...btnS, padding: "4px 10px", fontSize: 10 }}>Editar</button></td>
              </tr>
            ))}
            {gastosPuntuales.length === 0 && <tr><td colSpan={7} style={{ padding: "32px", textAlign: "center", color: C.niebla, fontSize: 13 }}>Sin gastos puntuales</td></tr>}
          </tbody>
        </table>
      </Card>

      {(modal === "nuevoGF" || modal?.startsWith("editGF")) && (
        <Modal onClose={() => setModal(null)} sub="Gastos Admin" title={modal === "nuevoGF" ? "Nuevo Gasto Fijo" : "Editar Gasto Fijo"}>
          <G cols="1fr 1fr">
            <Field label="Concepto"><input value={form.concepto} onChange={ff("concepto")} style={iSt} placeholder="ej: Alquiler oficina"/></Field>
            <Field label="Categoría"><select value={form.categoria} onChange={ff("categoria")} style={iSt}>{CAT_GASTOS.map(c => <option key={c}>{c}</option>)}</select></Field>
          </G>
          <G cols="1fr 1fr 1fr">
            <Field label="Moneda"><select value={form.moneda} onChange={ff("moneda")} style={iSt}><option value="ARS">ARS</option><option value="USD">USD</option></select></Field>
            <Field label="Monto mensual"><input type="number" value={form.monto} onChange={ff("monto")} style={iSt}/></Field>
            <Field label="Día de pago"><input type="number" min="1" max="31" value={form.dia} onChange={ff("dia")} style={iSt}/></Field>
          </G>
          <G cols="1fr"><Field label="Comentario"><input value={form.comentario} onChange={ff("comentario")} style={iSt} placeholder="Notas (opcional)"/></Field></G>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button onClick={() => setModal(null)} style={btnS}>Cancelar</button>
            <button onClick={saveFijo} style={btnP}>{modal === "nuevoGF" ? "Guardar" : "Actualizar"}</button>
          </div>
        </Modal>
      )}
      {(modal === "nuevoGP" || modal?.startsWith("editGP")) && (
        <Modal onClose={() => setModal(null)} sub="Gastos Admin" title={modal === "nuevoGP" ? "Nuevo Gasto Puntual" : "Editar Gasto Puntual"}>
          <G cols="1fr 1fr">
            <Field label="Concepto"><input value={form.concepto} onChange={ff("concepto")} style={iSt} placeholder="ej: Impresión planos"/></Field>
            <Field label="Categoría"><select value={form.categoria} onChange={ff("categoria")} style={iSt}>{CAT_GASTOS.map(c => <option key={c}>{c}</option>)}</select></Field>
          </G>
          <G cols="1fr 1fr 1fr">
            <Field label="Moneda"><select value={form.moneda} onChange={ff("moneda")} style={iSt}><option value="ARS">ARS</option><option value="USD">USD</option></select></Field>
            <Field label="Monto"><input type="number" value={form.monto} onChange={ff("monto")} style={iSt}/></Field>
            <Field label="Fecha"><input type="date" value={form.fecha} onChange={ff("fecha")} style={iSt}/></Field>
          </G>
          <G cols="1fr"><Field label="Comentario"><input value={form.comentario} onChange={ff("comentario")} style={iSt} placeholder="Notas (opcional)"/></Field></G>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button onClick={() => setModal(null)} style={btnS}>Cancelar</button>
            <button onClick={savePuntual} style={btnP}>{modal === "nuevoGP" ? "Guardar" : "Actualizar"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
