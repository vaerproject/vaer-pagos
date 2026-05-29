"use client";
import { useMemo } from "react";
import { C, OBRA_COLORS } from "@/lib/types";
import { usePagos } from "@/context/PagosContext";
import { fmtARS, fmtUSD, fmtDate, diasPara, obraColor, obraEstColor, isThisWeek, startOfWeek, endOfWeek, sumARS, sumUSD } from "@/lib/utils";
import { Card, CardHead, Chip, HBar as HBarComp, btnP, btnS, thSt, tdSt, iSt } from "@/components/ui/primitives";
import { TODAY_STR } from "@/lib/types";
import { useState } from "react";

export default function DashboardPage() {
  const { obras, pagos, setPagos } = usePagos();
  const [dashObra, setDashObra] = useState("Todas");

  const marcarPagado = (id: string) => setPagos(prev => prev.map(p => p.id === id ? { ...p, estado: "Pagado", fechaPagoReal: TODAY_STR } : p));
  const obraCod  = (id: string) => obras.find(o => o.id === id)?.codigo || id;

  const dash = useMemo(() => {
    const src   = dashObra === "Todas" ? pagos : pagos.filter(p => p.obraId === dashObra);
    const pend  = src.filter(p => p.estado !== "Pagado");
    const venc  = src.filter(p => p.estado === "Vencido");
    const sem   = src.filter(p => p.estado !== "Pagado" && isThisWeek(p.fechaLimite));
    const pagd  = src.filter(p => p.estado === "Pagado");
    const cats: Record<string, { ars: number; usd: number }> = {};
    src.forEach(p => {
      if (!cats[p.categoria]) cats[p.categoria] = { ars: 0, usd: 0 };
      if (p.moneda === "ARS") cats[p.categoria].ars += p.montoCuota;
      else cats[p.categoria].usd += p.montoCuota;
    });
    const porCat = Object.entries(cats).map(([k, v]) => ({ cat: k, ...v })).sort((a, b) => b.ars - a.ars);
    const porObra = obras.map(o => {
      const ps = src.filter(p => p.obraId === o.id);
      return { ...o, pendARS: sumARS(ps.filter(p => p.estado !== "Pagado")), pendUSD: sumUSD(ps.filter(p => p.estado !== "Pagado")), vencARS: sumARS(ps.filter(p => p.estado === "Vencido")), pagARS: sumARS(ps.filter(p => p.estado === "Pagado")), count: ps.length };
    }).filter(o => o.count > 0);
    return {
      semList: [...sem].sort((a, b) => new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime()),
      semARS: sumARS(sem), semUSD: sumUSD(sem),
      pendARS: sumARS(pend), pendUSD: sumUSD(pend),
      vencARS: sumARS(venc),
      vencList: [...venc].sort((a, b) => new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime()),
      pagARS: sumARS(pagd),
      porCat, porObra,
    };
  }, [pagos, obras, dashObra]);

  const resumenObras = useMemo(() => obras.map(o => {
    const ps = pagos.filter(p => p.obraId === o.id);
    return { ...o, pendARS: sumARS(ps.filter(p => p.estado !== "Pagado")), pendUSD: sumUSD(ps.filter(p => p.estado !== "Pagado")), vencARS: sumARS(ps.filter(p => p.estado === "Vencido")), pagARS: sumARS(ps.filter(p => p.estado === "Pagado")), nPagos: ps.length };
  }), [pagos, obras]);

  const CAT_COLORS = [C.acero, C.cemento, "#3B5248", "#6B4C3B", "#3B4A6B", "#7A6030"];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 26 }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.cemento }}>Dashboard</p>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 300, color: C.abismo }}>
            {dashObra === "Todas" ? "Esta semana – todas las obras" : `Esta semana – ${obras.find(o => o.id === dashObra)?.codigo}`}
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: 12, color: C.cemento }}>
            {fmtDate(startOfWeek().toISOString().slice(0, 10))} al {fmtDate(endOfWeek().toISOString().slice(0, 10))}
          </p>
        </div>
        <select value={dashObra} onChange={e => setDashObra(e.target.value)} style={{ ...iSt, width: 260, fontSize: 11 }}>
          <option value="Todas">Todas las obras</option>
          {obras.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
        </select>
      </div>

      {/* Global KPIs */}
      {dashObra === "Todas" && (() => {
        const todoPend  = pagos.filter(p => p.estado !== "Pagado");
        const todoVenc  = pagos.filter(p => p.estado === "Vencido");
        const todoPagd  = pagos.filter(p => p.estado === "Pagado");
        const todoProx7 = pagos.filter(p => p.estado === "Pendiente" && diasPara(p.fechaLimite) <= 7 && diasPara(p.fechaLimite) > 0);
        return (
          <>
            <p style={{ margin: "0 0 10px", fontSize: 10, letterSpacing: "0.09em", textTransform: "uppercase", color: C.cemento, fontWeight: 600 }}>Resumen global</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 28 }}>
              {[
                { l: "Pendiente ARS",  v: fmtARS(sumARS(todoPend)),  a: C.acero,                                      s: `${todoPend.length} pagos` },
                { l: "Pendiente USD",  v: fmtUSD(sumUSD(todoPend)),  a: "#3B4A6B",                                    s: sumUSD(todoPend) > 0 ? "pendiente" : "Sin USD pendiente" },
                { l: "Vencido ARS",    v: fmtARS(sumARS(todoVenc)),  a: todoVenc.length > 0 ? C.vencido : C.niebla,   s: todoVenc.length > 0 ? `${todoVenc.length} sin pagar` : "Sin vencidos ✓" },
                { l: "Próx. 7 días",   v: fmtARS(sumARS(todoProx7)), a: C.warning,                                    s: `${todoProx7.length} pago${todoProx7.length !== 1 ? "s" : ""}` },
                { l: "Total pagado",   v: fmtARS(sumARS(todoPagd)),  a: C.ok,                                         s: `${todoPagd.length} pagados` },
              ].map(k => (
                <Card key={k.l} style={{ borderTop: `3px solid ${k.a}`, padding: "16px 18px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: C.cemento, fontWeight: 600 }}>{k.l}</p>
                  <p style={{ margin: "0 0 2px", fontSize: 17, fontWeight: 300, color: C.abismo }}>{k.v}</p>
                  <p style={{ margin: 0, fontSize: 10, color: C.cemento }}>{k.s}</p>
                </Card>
              ))}
            </div>

            <Card style={{ marginBottom: 24 }}>
              <CardHead title="Estado por obra"/>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Obra","Estado","Pend. ARS","Pend. USD","Vencido","Pagado","Pagos"].map(h => <th key={h} style={thSt}>{h}</th>)}</tr></thead>
                <tbody>
                  {resumenObras.map(o => (
                    <tr key={o.id} style={{ cursor: "pointer" }} onClick={() => setDashObra(o.id)}>
                      <td style={tdSt}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ background: obraColor(o.id), color: "#fff", padding: "2px 8px", borderRadius: 2, fontSize: 11, fontWeight: 700 }}>{o.codigo}</span>
                          <span style={{ fontSize: 12 }}>{o.nombre.split("–")[1]?.trim()}</span>
                        </div>
                      </td>
                      <td style={tdSt}><span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: obraEstColor(o.estado) }}>{o.estado}</span></td>
                      <td style={{ ...tdSt, fontWeight: 600, color: C.acero }}>{o.pendARS > 0 ? fmtARS(o.pendARS) : "—"}</td>
                      <td style={{ ...tdSt, fontWeight: 600, color: "#3B4A6B" }}>{o.pendUSD > 0 ? fmtUSD(o.pendUSD) : "—"}</td>
                      <td style={{ ...tdSt, fontWeight: 600, color: o.vencARS > 0 ? C.vencido : C.niebla }}>{o.vencARS > 0 ? fmtARS(o.vencARS) : "—"}</td>
                      <td style={{ ...tdSt, color: C.ok }}>{o.pagARS > 0 ? fmtARS(o.pagARS) : "—"}</td>
                      <td style={{ ...tdSt, color: C.cemento, textAlign: "center" }}>{o.nPagos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <div style={{ height: 1, background: C.niebla, marginBottom: 24, opacity: 0.4 }}/>
          </>
        );
      })()}

      {/* KPIs semana */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { l: "Esta semana (ARS)", v: fmtARS(dash.semARS), a: C.acero, s: `${dash.semList.length} pago${dash.semList.length !== 1 ? "s" : ""}` },
          { l: "Esta semana (USD)", v: fmtUSD(dash.semUSD), a: "#3B4A6B", s: dash.semUSD > 0 ? "ver TC en cada pago" : "Sin pagos USD" },
          { l: "Total pendiente", v: fmtARS(dash.pendARS), a: C.cemento, s: "todas las fechas" },
          { l: "Vencido", v: fmtARS(dash.vencARS), a: dash.vencARS > 0 ? C.vencido : C.niebla, s: dash.vencARS > 0 ? `${dash.vencList.length} vencido${dash.vencList.length !== 1 ? "s" : ""}` : "Sin vencidos ✓" },
        ].map(k => (
          <Card key={k.l} style={{ borderTop: `3px solid ${k.a}`, padding: "18px 20px" }}>
            <p style={{ margin: "0 0 5px", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: C.cemento, fontWeight: 600 }}>{k.l}</p>
            <p style={{ margin: "0 0 3px", fontSize: 19, fontWeight: 300, color: C.abismo }}>{k.v}</p>
            <p style={{ margin: 0, fontSize: 11, color: C.cemento }}>{k.s}</p>
          </Card>
        ))}
      </div>

      {/* Pagos de la semana */}
      <Card style={{ marginBottom: 20 }}>
        <CardHead title={`Pagos a realizar esta semana (${dash.semList.length})`}/>
        {dash.semList.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Obra","Concepto","Mon.","Monto","Vence","Estado","Comentario",""].map(h => <th key={h} style={thSt}>{h}</th>)}</tr></thead>
            <tbody>
              {dash.semList.map(p => {
                const d = diasPara(p.fechaLimite);
                return (
                  <tr key={p.id} style={{ borderLeft: p.estado === "Vencido" ? `3px solid ${C.vencido}` : d <= 2 ? `3px solid ${C.warning}` : "3px solid transparent" }}>
                    <td style={tdSt}><span style={{ background: obraColor(p.obraId), color: "#fff", padding: "2px 8px", borderRadius: 2, fontSize: 11, fontWeight: 700 }}>{obraCod(p.obraId)}</span></td>
                    <td style={tdSt}>{p.concepto}</td>
                    <td style={tdSt}><span style={{ fontSize: 11, fontWeight: 700, color: p.moneda === "USD" ? "#3B4A6B" : C.acero }}>{p.moneda}</span></td>
                    <td style={{ ...tdSt, fontWeight: 600 }}>{p.moneda === "USD" ? fmtUSD(p.montoCuota) : fmtARS(p.montoCuota)}{p.moneda === "USD" && p.tipoCambio && <span style={{ display: "block", fontSize: 10, color: C.cemento }}>TC {p.tipoCambio} · ≈{fmtARS(p.montoCuota * p.tipoCambio)}</span>}</td>
                    <td style={{ ...tdSt, fontWeight: 600, color: d <= 0 ? C.vencido : d <= 2 ? C.warning : C.acero }}>
                      {fmtDate(p.fechaLimite)}<span style={{ display: "block", fontSize: 10, color: d <= 0 ? C.vencido : d <= 2 ? C.warning : C.niebla }}>{d <= 0 ? `${Math.abs(d)}d vencido` : `${d}d`}</span>
                    </td>
                    <td style={tdSt}><Chip label={p.estado}/></td>
                    <td style={{ ...tdSt, color: C.cemento, fontSize: 12, fontStyle: p.comentario ? "normal" : "italic", maxWidth: 180 }}>{p.comentario || "—"}</td>
                    <td style={tdSt}>{p.estado !== "Pagado" && <button onClick={() => marcarPagado(p.id)} style={{ ...btnP, padding: "5px 12px", fontSize: 10 }}>✓ Pagar</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <p style={{ padding: "28px 22px", margin: 0, color: C.niebla, fontSize: 13 }}>Sin pagos esta semana ✓</p>}
      </Card>

      {/* Vencidos */}
      {dash.vencList.length > 0 && (
        <Card style={{ marginBottom: 20, borderTop: `3px solid ${C.vencido}` }}>
          <CardHead title={`⚠ Vencidos – ${dash.vencList.length} pago${dash.vencList.length !== 1 ? "s" : ""} sin pagar`}/>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Obra","Concepto","Monto","Vencido hace","Comentario",""].map(h => <th key={h} style={thSt}>{h}</th>)}</tr></thead>
            <tbody>
              {dash.vencList.map(p => (
                <tr key={p.id}>
                  <td style={tdSt}><span style={{ background: obraColor(p.obraId), color: "#fff", padding: "2px 8px", borderRadius: 2, fontSize: 11, fontWeight: 700 }}>{obraCod(p.obraId)}</span></td>
                  <td style={tdSt}>{p.concepto}</td>
                  <td style={{ ...tdSt, fontWeight: 600 }}>{p.moneda === "USD" ? fmtUSD(p.montoCuota) : fmtARS(p.montoCuota)}</td>
                  <td style={{ ...tdSt, color: C.vencido, fontWeight: 700 }}>{Math.abs(diasPara(p.fechaLimite))} días</td>
                  <td style={{ ...tdSt, color: C.cemento, fontSize: 12, fontStyle: p.comentario ? "normal" : "italic" }}>{p.comentario || "—"}</td>
                  <td style={tdSt}><button onClick={() => marcarPagado(p.id)} style={{ ...btnP, padding: "5px 12px", fontSize: 10, background: C.vencido }}>✓ Pagar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Por obra + por rubro */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Card>
          <CardHead title="Pendiente por obra"/>
          <div style={{ padding: "16px 22px" }}>
            {dash.porObra.map(o => (
              <div key={o.id} style={{ marginBottom: 16, cursor: "pointer" }} onClick={() => setDashObra(o.id)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ background: obraColor(o.id), color: "#fff", padding: "1px 7px", borderRadius: 2, fontSize: 10, fontWeight: 700 }}>{o.codigo}</span>
                    <span style={{ fontSize: 12, color: C.abismo }}>{o.nombre.split("–")[1]?.trim()}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {o.pendARS > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: C.acero, display: "block" }}>{fmtARS(o.pendARS)}</span>}
                    {o.pendUSD > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: "#3B4A6B", display: "block" }}>{fmtUSD(o.pendUSD)}</span>}
                  </div>
                </div>
                {o.vencARS > 0 && <span style={{ fontSize: 10, color: C.vencido, fontWeight: 600 }}>⚠ {fmtARS(o.vencARS)} vencido</span>}
              </div>
            ))}
            {dash.porObra.length === 0 && <p style={{ fontSize: 12, color: C.niebla, margin: 0 }}>Sin datos</p>}
          </div>
        </Card>
        <Card>
          <CardHead title="Gasto por rubro (ARS)"/>
          <div style={{ padding: "16px 22px" }}>
            {dash.porCat.map((c, i) => (
              <HBarComp key={c.cat} label={c.cat} sub={`${fmtARS(c.ars)}${c.usd > 0 ? ` + ${fmtUSD(c.usd)}` : ""}`} value={c.ars} max={dash.porCat[0]?.ars || 1} color={CAT_COLORS[i] || C.acero}/>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
