"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { C, ESTADOS_OBRA } from "@/lib/types";
import type { Obra } from "@/lib/types";
import { usePagos } from "@/context/PagosContext";
import { fmtARS, fmtUSD, fmtDate, obraColor, obraEstColor, sumARS, sumUSD } from "@/lib/utils";
import { Card, Modal, G, Field, iSt, btnP, btnS } from "@/components/ui/primitives";

export default function ObrasPage() {
  const { obras, setObras, pagos } = usePagos();
  const [modal, setModal] = useState<string | null>(null);
  const [form, setForm]   = useState<Partial<Obra>>({});
  const ff = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(prev => ({ ...prev, [k]: e.target.value }));
  const openNueva = () => { setForm({ nombre: "", responsable: "", estado: "Por iniciar", ubicacion: "", fechaInicio: "", presupuesto: undefined }); setModal("nueva"); };
  const openEdit  = (o: Obra) => { setForm({ ...o, presupuesto: o.presupuesto ?? undefined }); setModal(o.id); };
  const save = () => {
    const d = { ...form, presupuesto: form.presupuesto ? Number(form.presupuesto) : null } as Obra;
    if (modal === "nueva") { const cod = (form.responsable || "").toUpperCase(); setObras(prev => [...prev, { ...d, id: `OB-${cod}`, codigo: cod }]); }
    else setObras(prev => prev.map(o => o.id === modal ? { ...o, ...d } : o));
    setModal(null);
  };
  const resumen = useMemo(() => obras.map(o => {
    const ps = pagos.filter(p => p.obraId === o.id);
    return { ...o, pendARS: sumARS(ps.filter(p => p.estado !== "Pagado")), pendUSD: sumUSD(ps.filter(p => p.estado !== "Pagado")), vencARS: sumARS(ps.filter(p => p.estado === "Vencido")), pagARS: sumARS(ps.filter(p => p.estado === "Pagado")), totalARS: sumARS(ps), nPagos: ps.length };
  }), [obras, pagos]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.cemento }}>Catálogo</p>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 300, color: C.abismo }}>Obras</h1>
        </div>
        <button onClick={openNueva} style={btnP}>+ Nueva Obra</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
        {resumen.map(o => (
          <Card key={o.id} style={{ borderTop: `3px solid ${obraColor(o.id)}` }}>
            <div style={{ padding: "18px 22px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ background: obraColor(o.id), color: "#fff", padding: "2px 9px", borderRadius: 2, fontSize: 12, fontWeight: 700 }}>{o.codigo}</span>
                    <span style={{ fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase", color: obraEstColor(o.estado), fontWeight: 600 }}>{o.estado}</span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 400, color: C.abismo }}>{o.nombre.split("–")[1]?.trim() || o.nombre}</h3>
                </div>
                <button onClick={() => openEdit(o)} style={{ ...btnS, padding: "4px 11px", fontSize: 10 }}>Editar</button>
              </div>
              {o.ubicacion && <p style={{ margin: "0 0 2px", fontSize: 12, color: C.cemento }}>📍 {o.ubicacion}</p>}
              <p style={{ margin: "0 0 10px", fontSize: 11, color: C.niebla }}>Inicio: {fmtDate(o.fechaInicio)} · {o.nPagos} pago{o.nPagos !== 1 ? "s" : ""}</p>
              {o.presupuesto
                ? <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 10, color: C.cemento }}>Presupuesto: {fmtARS(o.presupuesto)}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: o.totalARS / o.presupuesto > 0.8 ? C.vencido : C.acero }}>{Math.round((o.totalARS / o.presupuesto) * 100)}%</span>
                    </div>
                    <div style={{ background: "#E4E3E0", borderRadius: 2, height: 5 }}><div style={{ height: "100%", width: `${Math.min((o.totalARS / o.presupuesto) * 100, 100)}%`, background: obraColor(o.id), borderRadius: 2 }}/></div>
                  </div>
                : <p style={{ margin: 0, fontSize: 11, color: C.niebla, fontStyle: "italic" }}>Sin presupuesto cerrado</p>
              }
              {o.id === "OB-DA" && <Link href="/informe-inversion/DA" style={{ display: "inline-block", marginTop: 10, fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase", color: obraColor(o.id), textDecoration: "none", fontWeight: 600 }}>📊 Ver Informe de Inversión →</Link>}
            </div>
            <div style={{ borderTop: `1px solid ${C.niebla}`, padding: "12px 22px", background: "#F5F4F2", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[["Pendiente ARS", fmtARS(o.pendARS), C.acero], ["Pendiente USD", o.pendUSD ? fmtUSD(o.pendUSD) : "—", "#3B4A6B"], ["Pagado ARS", fmtARS(o.pagARS), C.ok]].map(([l, v, col]) => (
                <div key={l}><p style={{ margin: "0 0 1px", fontSize: 9, letterSpacing: "0.07em", textTransform: "uppercase", color: C.niebla }}>{l}</p><p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: col as string }}>{v}</p></div>
              ))}
              {o.vencARS > 0 && <div style={{ gridColumn: "1/-1" }}><p style={{ margin: 0, fontSize: 11, color: C.vencido, fontWeight: 600 }}>⚠ {fmtARS(o.vencARS)} vencido</p></div>}
            </div>
          </Card>
        ))}
      </div>

      {(modal === "nueva" || (modal && modal !== "nueva")) && (
        <Modal onClose={() => setModal(null)} sub="Obras" title={modal === "nueva" ? "Nueva Obra" : "Editar Obra"}>
          <G cols="1fr"><Field label="Nombre completo"><input value={form.nombre} onChange={ff("nombre")} style={iSt} placeholder="ej: FE – Interiorismo Consultorios"/></Field></G>
          <G cols="1fr 1fr">
            <Field label="Código / Responsable"><input value={form.responsable} onChange={ff("responsable")} style={iSt} placeholder="ej: FE"/></Field>
            <Field label="Estado"><select value={form.estado} onChange={ff("estado")} style={iSt}>{ESTADOS_OBRA.map(e => <option key={e}>{e}</option>)}</select></Field>
          </G>
          <G cols="1fr 1fr">
            <Field label="Ubicación"><input value={form.ubicacion} onChange={ff("ubicacion")} style={iSt} placeholder="Dirección o referencia"/></Field>
            <Field label="Fecha de Inicio"><input type="date" value={form.fechaInicio} onChange={ff("fechaInicio")} style={iSt}/></Field>
          </G>
          <G cols="1fr">
            <Field label="Presupuesto Total ARS (vacío si no está cerrado)"><input type="number" value={form.presupuesto ?? ""} onChange={ff("presupuesto")} style={iSt} placeholder="Sin presupuesto cerrado"/></Field>
          </G>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button onClick={() => setModal(null)} style={btnS}>Cancelar</button>
            <button onClick={save} style={btnP}>{modal === "nueva" ? "Guardar Obra" : "Actualizar"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
