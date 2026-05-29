"use client";
import { useState } from "react";
import { C } from "@/lib/types";
import type { Proveedor } from "@/lib/types";
import { usePagos } from "@/context/PagosContext";
import { fmtARS, fmtUSD, obraColor } from "@/lib/utils";
import { Card, Modal, G, Field, iSt, btnP, btnS } from "@/components/ui/primitives";

export default function ProveedoresPage() {
  const { obras, pagos, provs, setProvs } = usePagos();
  const [modal, setModal] = useState<string | null>(null);
  const [form, setForm]   = useState<Partial<Proveedor>>({});

  const ff = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [k]: e.target.value }));
  const obraCod = (id: string) => obras.find(o => o.id === id)?.codigo || id;
  const openNuevo = () => { setForm({ nombre: "", obraIds: [], cuit: "", cbu: "", telefono: "", email: "" }); setModal("nuevo"); };
  const openEdit  = (p: Proveedor) => { setForm({ ...p }); setModal(p.id); };
  const save = () => {
    if (modal === "nuevo") setProvs(prev => [...prev, { ...form as Proveedor, id: "PROV-" + String(prev.length + 1).padStart(2, "0") }]);
    else setProvs(prev => prev.map(p => p.id === modal ? { ...p, ...form } as Proveedor : p));
    setModal(null);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.cemento }}>Directorio</p>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 300, color: C.abismo }}>Proveedores</h1>
        </div>
        <button onClick={openNuevo} style={btnP}>+ Nuevo Proveedor</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
        {provs.map(p => {
          const nPagos = pagos.filter(pg => pg.proveedorId === p.id);
          const totalARS = nPagos.filter(pg => pg.moneda === "ARS").reduce((s, pg) => s + pg.montoCuota, 0);
          const totalUSD = nPagos.filter(pg => pg.moneda === "USD").reduce((s, pg) => s + pg.montoCuota, 0);
          return (
            <Card key={p.id} style={{ borderTop: `3px solid ${C.acero}` }}>
              <div style={{ padding: "18px 22px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500, color: C.abismo }}>{p.nombre}</h3>
                  <button onClick={() => openEdit(p)} style={{ ...btnS, padding: "4px 11px", fontSize: 10 }}>Editar</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {[["CUIT", p.cuit], ["CBU / Alias", p.cbu], ["Teléfono", p.telefono], ["Email", p.email]].map(([l, v]) => (
                    <div key={l}>
                      <p style={{ margin: "0 0 1px", fontSize: 9, letterSpacing: "0.07em", textTransform: "uppercase", color: C.niebla }}>{l}</p>
                      <p style={{ margin: 0, fontSize: 12, color: C.abismo }}>{v || "—"}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(p.obraIds || []).map(oid => <span key={oid} style={{ background: obraColor(oid), color: "#fff", padding: "1px 7px", borderRadius: 2, fontSize: 10, fontWeight: 700 }}>{obraCod(oid)}</span>)}
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${C.niebla}`, padding: "10px 22px", background: "#F5F4F2", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: C.cemento }}>{nPagos.length} pago{nPagos.length !== 1 ? "s" : ""}</span>
                <div style={{ textAlign: "right" }}>
                  {totalARS > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: C.acero, display: "block" }}>{fmtARS(totalARS)}</span>}
                  {totalUSD > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: "#3B4A6B", display: "block" }}>{fmtUSD(totalUSD)}</span>}
                  {nPagos.length === 0 && <span style={{ fontSize: 11, color: C.niebla }}>Sin pagos</span>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {(modal === "nuevo" || (modal && modal !== "nuevo")) && (
        <Modal onClose={() => setModal(null)} sub="Proveedores" title={modal === "nuevo" ? "Nuevo Proveedor" : "Editar Proveedor"} wide>
          <G cols="1fr"><Field label="Nombre"><input value={form.nombre} onChange={ff("nombre")} style={iSt} placeholder="Nombre del proveedor"/></Field></G>
          <G cols="1fr 1fr">
            <Field label="CUIT"><input value={form.cuit} onChange={ff("cuit")} style={iSt} placeholder="XX-XXXXXXXX-X"/></Field>
            <Field label="CBU / Alias"><input value={form.cbu} onChange={ff("cbu")} style={iSt} placeholder="CBU o alias"/></Field>
          </G>
          <G cols="1fr 1fr">
            <Field label="Teléfono"><input value={form.telefono} onChange={ff("telefono")} style={iSt} placeholder="011-XXXX-XXXX"/></Field>
            <Field label="Email"><input type="email" value={form.email} onChange={ff("email")} style={iSt} placeholder="email@proveedor.com"/></Field>
          </G>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, letterSpacing: "0.09em", textTransform: "uppercase", color: C.cemento, display: "block", marginBottom: 5, fontWeight: 600 }}>Obras asociadas</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {obras.map(o => {
                const sel = (form.obraIds || []).includes(o.id);
                return (
                  <button key={o.id} type="button"
                    onClick={() => setForm(prev => ({ ...prev, obraIds: sel ? (prev.obraIds || []).filter(id => id !== o.id) : [...(prev.obraIds || []), o.id] }))}
                    style={{ background: sel ? obraColor(o.id) : "transparent", color: sel ? "#fff" : C.cemento, border: `1px solid ${sel ? obraColor(o.id) : C.niebla}`, padding: "6px 16px", borderRadius: 2, fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: sel ? 700 : 400 }}>
                    {o.codigo}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button onClick={() => setModal(null)} style={btnS}>Cancelar</button>
            <button onClick={save} style={btnP}>{modal === "nuevo" ? "Guardar" : "Actualizar"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
