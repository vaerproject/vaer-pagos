"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { C, CATEGORIAS } from "@/lib/types";
import type { Pago } from "@/lib/types";
import { usePagos } from "@/context/PagosContext";
import { fmtARS, fmtUSD, fmtDate, diasPara, obraColor } from "@/lib/utils";
import { Card, Chip, btnP, btnS, thSt, tdSt, Modal, G, Field, iSt } from "@/components/ui/primitives";
import { TODAY_STR } from "@/lib/types";

function PagosPageInner() {
  const { obras, provs, pagos, setPagos } = usePagos();
  const searchParams = useSearchParams();
  const [fEst, setFEst] = useState("Todos");
  const [fObra, setFObra] = useState(() => searchParams.get("obra") || "Todas");
  const [selPago, setSelPago] = useState<Pago | null>(null);
  const [editComentario, setEditComentario] = useState<string | null>(null);
  const [modal, setModal]  = useState<string | null>(null);
  const [form, setForm]    = useState<Partial<Pago>>({});

  useEffect(() => {
    const obra = searchParams.get("obra");
    if (obra) setFObra(obra);
  }, [searchParams]);

  const obraNombre = (id: string) => obras.find(o => o.id === id)?.nombre || id;
  const obraCod    = (id: string) => obras.find(o => o.id === id)?.codigo || id;
  const provNombre = (id: string | null) => id ? (provs.find(p => p.id === id)?.nombre || "—") : "—";
  const ff = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const pagosFiltrados = useMemo(() =>
    pagos
      .filter(p => (fEst === "Todos" || p.estado === fEst) && (fObra === "Todas" || p.obraId === fObra))
      .sort((a, b) => new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime()),
    [pagos, fEst, fObra]);

  const marcarPagado = (id: string) => {
    setPagos(prev => prev.map(p => p.id === id ? { ...p, estado: "Pagado", fechaPagoReal: TODAY_STR } : p));
    setSelPago(null);
  };
  const eliminarPago = (id: string) => { setPagos(prev => prev.filter(p => p.id !== id)); setSelPago(null); };
  const saveComentario = (id: string, val: string) => {
    setPagos(prev => prev.map(p => p.id === id ? { ...p, comentario: val } : p));
    setEditComentario(null);
  };
  const openNuevoPago = () => {
    setForm({ obraId: "", proveedorId: null, categoria: "Materiales", concepto: "", montoTotal: 0, moneda: "ARS", tipoCambio: null, nCuotas: 1, cuotaActual: 1, montoCuota: 0, fechaLimite: "", estado: "Pendiente", fechaPagoReal: null, obs: "", comentario: "" });
    setModal("nuevoPago");
  };
  const openEditPago = (p: Pago) => { setForm({ ...p }); setModal("editPago"); };
  const savePago = () => {
    const d = { ...form, montoTotal: Number(form.montoTotal), montoCuota: Number(form.montoCuota), nCuotas: Number(form.nCuotas), cuotaActual: Number(form.cuotaActual), tipoCambio: form.moneda === "USD" && form.tipoCambio ? Number(form.tipoCambio) : null, proveedorId: form.proveedorId || null, fechaPagoReal: form.estado === "Pagado" ? (form.fechaPagoReal || TODAY_STR) : null } as Pago;
    if (modal === "nuevoPago") setPagos(prev => [...prev, { ...d, id: "P-" + String(prev.length + 1).padStart(3, "0") }]);
    else setPagos(prev => prev.map(p => p.id === form.id ? { ...p, ...d } : p));
    setModal(null); setSelPago(null);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.cemento }}>Gestión</p>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 300, color: C.abismo }}>Todos los Pagos</h1>
        </div>
        <button onClick={openNuevoPago} style={btnP}>+ Nuevo Pago</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        {["Todos", "Pendiente", "Vencido", "Pagado"].map(e => (
          <button key={e} onClick={() => setFEst(e)} style={{ padding: "7px 16px", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", border: "1px solid", borderRadius: 2, background: fEst === e ? C.abismo : "transparent", color: fEst === e ? C.blanco : C.cemento, borderColor: fEst === e ? C.abismo : C.niebla }}>{e}</button>
        ))}
        <select value={fObra} onChange={e => setFObra(e.target.value)} style={{ ...iSt, width: "auto", flex: 1, maxWidth: 280, fontSize: 11 }}>
          <option value="Todas">Todas las obras</option>
          {obras.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
        </select>
        {fObra !== "Todas" && <button onClick={() => setFObra("Todas")} style={{ ...btnS, padding: "7px 12px", fontSize: 10 }}>× Limpiar</button>}
      </div>

      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Obra","Proveedor","Concepto","Rubro","Mon.","Monto","Cuota","Vence","Estado","Comentario",""].map(h => <th key={h} style={thSt}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {pagosFiltrados.map(p => {
              const d = diasPara(p.fechaLimite);
              return (
                <tr key={p.id}
                  onClick={() => setSelPago(selPago?.id === p.id ? null : p)}
                  style={{ cursor: "pointer", background: selPago?.id === p.id ? "rgba(47,72,88,0.05)" : "transparent", borderLeft: p.estado === "Vencido" ? `3px solid ${C.vencido}` : d <= 7 && p.estado === "Pendiente" ? `3px solid ${C.warning}` : "3px solid transparent" }}
                >
                  <td style={tdSt}><span style={{ background: obraColor(p.obraId), color: "#fff", padding: "2px 8px", borderRadius: 2, fontSize: 11, fontWeight: 700 }}>{obraCod(p.obraId)}</span></td>
                  <td style={{ ...tdSt, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{provNombre(p.proveedorId)}</td>
                  <td style={{ ...tdSt, maxWidth: 180 }}>{p.concepto}</td>
                  <td style={{ ...tdSt, color: C.cemento, fontSize: 11 }}>{p.categoria}</td>
                  <td style={tdSt}><span style={{ fontSize: 11, fontWeight: 700, color: p.moneda === "USD" ? "#3B4A6B" : C.acero }}>{p.moneda}</span></td>
                  <td style={{ ...tdSt, fontWeight: 600 }}>
                    {p.moneda === "USD" ? fmtUSD(p.montoCuota) : fmtARS(p.montoCuota)}
                    {p.moneda === "USD" && p.tipoCambio && <span style={{ display: "block", fontSize: 10, color: C.cemento }}>TC {p.tipoCambio}</span>}
                  </td>
                  <td style={{ ...tdSt, textAlign: "center", color: C.cemento, fontSize: 11 }}>{p.cuotaActual}/{p.nCuotas}</td>
                  <td style={{ ...tdSt, color: d <= 0 ? C.vencido : d <= 7 && p.estado === "Pendiente" ? C.warning : C.abismo, fontWeight: d <= 7 ? 600 : 400 }}>
                    {fmtDate(p.fechaLimite)}
                    {p.estado !== "Pagado" && <span style={{ display: "block", fontSize: 10, color: d <= 0 ? C.vencido : d <= 7 ? C.warning : C.niebla }}>{d <= 0 ? `${Math.abs(d)}d venc.` : `${d}d`}</span>}
                  </td>
                  <td style={tdSt}><Chip label={p.estado}/></td>
                  <td style={{ ...tdSt, maxWidth: 200 }} onClick={e => e.stopPropagation()}>
                    {editComentario === p.id ? (
                      <input autoFocus defaultValue={p.comentario}
                        onBlur={e => saveComentario(p.id, e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") saveComentario(p.id, (e.target as HTMLInputElement).value); if (e.key === "Escape") setEditComentario(null); }}
                        style={{ ...iSt, fontSize: 12, padding: "5px 8px" }}
                      />
                    ) : (
                      <span onClick={() => setEditComentario(p.id)} title="Clic para editar"
                        style={{ display: "block", fontSize: 12, color: p.comentario ? C.abismo : C.niebla, fontStyle: p.comentario ? "normal" : "italic", cursor: "text", minHeight: 20, borderBottom: `1px dashed ${C.niebla}`, paddingBottom: 2 }}>
                        {p.comentario || "Agregar comentario…"}
                      </span>
                    )}
                  </td>
                  <td style={tdSt} onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEditPago(p)} style={{ ...btnS, padding: "4px 10px", fontSize: 10 }}>Editar</button>
                      {p.estado !== "Pagado" && <button onClick={() => marcarPagado(p.id)} style={{ ...btnP, padding: "4px 10px", fontSize: 10 }}>✓</button>}
                    </div>
                  </td>
                </tr>
              );
            })}
            {pagosFiltrados.length === 0 && <tr><td colSpan={11} style={{ padding: "40px", textAlign: "center", color: C.niebla, fontSize: 13 }}>Sin registros con los filtros actuales</td></tr>}
          </tbody>
        </table>
      </Card>

      {selPago && (
        <div style={{ marginTop: 16, background: C.blanco, borderRadius: 3, boxShadow: "0 1px 4px rgba(2,17,27,0.07)", padding: "22px 26px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.cemento }}>{selPago.id} · {obraNombre(selPago.obraId)}</p>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 300 }}>{selPago.concepto}</h2>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {selPago.estado !== "Pagado" && <button onClick={() => marcarPagado(selPago.id)} style={{ ...btnP, padding: "6px 14px", fontSize: 10 }}>✓ Marcar Pagado</button>}
              <button onClick={() => openEditPago(selPago)} style={{ ...btnS, padding: "6px 12px", fontSize: 10 }}>Editar</button>
              <button onClick={() => eliminarPago(selPago.id)} style={{ ...btnS, padding: "6px 12px", fontSize: 10, color: C.vencido, borderColor: "rgba(122,48,48,0.3)" }}>Eliminar</button>
              <button onClick={() => setSelPago(null)} style={{ ...btnS, padding: "6px 10px" }}>×</button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
            {[
              ["Proveedor", provNombre(selPago.proveedorId)],
              ["Rubro", selPago.categoria],
              ["Moneda", selPago.moneda],
              ["Monto Cuota", selPago.moneda === "USD" ? fmtUSD(selPago.montoCuota) : fmtARS(selPago.montoCuota)],
              ["Tipo de cambio", selPago.tipoCambio ? `$ ${selPago.tipoCambio}` : "—"],
              ["En ARS", selPago.moneda === "USD" && selPago.tipoCambio ? fmtARS(selPago.montoCuota * selPago.tipoCambio) : "—"],
              ["Monto Total", selPago.moneda === "USD" ? fmtUSD(selPago.montoTotal) : fmtARS(selPago.montoTotal)],
              ["Cuota", `${selPago.cuotaActual}/${selPago.nCuotas}`],
              ["Fecha Límite", fmtDate(selPago.fechaLimite)],
              ["Fecha Pago", fmtDate(selPago.fechaPagoReal)],
              ["Comentario", selPago.comentario || "—"],
            ].map(([l, v]) => (
              <div key={l} style={{ borderLeft: `2px solid ${C.niebla}`, paddingLeft: 10 }}>
                <p style={{ margin: "0 0 2px", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: C.cemento }}>{l}</p>
                <p style={{ margin: 0, fontSize: 12, color: C.abismo }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(modal === "nuevoPago" || modal === "editPago") && (
        <Modal onClose={() => setModal(null)} sub="Sistema de Pagos" title={modal === "nuevoPago" ? "Nuevo Pago" : "Editar Pago"}>
          <G cols="1fr 1fr">
            <Field label="Obra"><select value={form.obraId} onChange={ff("obraId")} style={iSt}><option value="">Seleccionar obra…</option>{obras.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}</select></Field>
            <Field label="Proveedor"><select value={form.proveedorId || ""} onChange={ff("proveedorId")} style={iSt}><option value="">Sin proveedor</option>{provs.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select></Field>
          </G>
          <G cols="1fr 1fr">
            <Field label="Categoría"><select value={form.categoria} onChange={ff("categoria")} style={iSt}>{CATEGORIAS.map(c => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Concepto"><input value={form.concepto} onChange={ff("concepto")} style={iSt} placeholder="Descripción"/></Field>
          </G>
          <G cols="1fr 1fr 1fr">
            <Field label="Moneda"><select value={form.moneda} onChange={ff("moneda")} style={iSt}><option value="ARS">ARS – Pesos</option><option value="USD">USD – Dólares</option></select></Field>
            <Field label="Monto Total"><input type="number" value={form.montoTotal} onChange={ff("montoTotal")} style={iSt}/></Field>
            <Field label={form.moneda === "USD" ? "Tipo de cambio" : "—"}>
              {form.moneda === "USD" ? <input type="number" value={form.tipoCambio || ""} onChange={ff("tipoCambio")} style={iSt} placeholder="ej: 1200"/> : <input disabled style={{ ...iSt, background: "#F5F4F2", color: C.niebla }} value="No aplica"/>}
            </Field>
          </G>
          <G cols="1fr 1fr 1fr 1fr">
            <Field label="N° Cuotas"><input type="number" min="1" value={form.nCuotas} onChange={ff("nCuotas")} style={iSt}/></Field>
            <Field label="Cuota Actual"><input type="number" min="1" value={form.cuotaActual} onChange={ff("cuotaActual")} style={iSt}/></Field>
            <Field label="Monto Cuota"><input type="number" value={form.montoCuota} onChange={ff("montoCuota")} style={iSt}/></Field>
            <Field label="Fecha Límite"><input type="date" value={form.fechaLimite} onChange={ff("fechaLimite")} style={iSt}/></Field>
          </G>
          <G cols="1fr 1fr">
            <Field label="Estado"><select value={form.estado} onChange={ff("estado")} style={iSt}>{["Pendiente", "Pagado", "Vencido"].map(e => <option key={e}>{e}</option>)}</select></Field>
            {form.estado === "Pagado" ? <Field label="Fecha Pago Real"><input type="date" value={form.fechaPagoReal || ""} onChange={ff("fechaPagoReal")} style={iSt}/></Field> : <div/>}
          </G>
          <G cols="1fr">
            <Field label="Comentario"><input value={form.comentario} onChange={ff("comentario")} style={iSt} placeholder="Nota interna (opcional)"/></Field>
          </G>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button onClick={() => setModal(null)} style={btnS}>Cancelar</button>
            <button onClick={savePago} style={btnP}>{modal === "nuevoPago" ? "Guardar Pago" : "Actualizar"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function PagosPage() {
  return (
    <Suspense>
      <PagosPageInner />
    </Suspense>
  );
}
