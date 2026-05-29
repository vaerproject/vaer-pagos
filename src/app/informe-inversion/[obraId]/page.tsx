"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { C } from "@/lib/types";
import { DA_CURVA, DA_DONUT } from "@/data/seed";
import { fmtARS } from "@/lib/utils";
import { VaerWordmark, IsoMark } from "@/components/brand/VaerBrand";

// ── Dynamically import Chart.js only on client ──────────────────
let Chart: any = null;
if (typeof window !== "undefined") {
  Chart = require("chart.js/auto").default;
}

export default function InformeInversionPage({ params }: { params: { obraId: string } }) {
  const curvaRef  = useRef<HTMLCanvasElement>(null);
  const donutRef  = useRef<HTMLCanvasElement>(null);
  const curvaInst = useRef<any>(null);
  const donutInst = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ChartJS = require("chart.js/auto").default;

    // ── CURVA CHART ──
    if (curvaRef.current) {
      if (curvaInst.current) curvaInst.current.destroy();
      curvaInst.current = new ChartJS(curvaRef.current, {
        data: {
          labels: DA_CURVA.map(m => m.mes),
          datasets: [
            {
              type: "bar", label: "Materiales",
              data: DA_CURVA.map(m => m.mat),
              backgroundColor: "rgba(2,17,27,0.88)", borderRadius: 0, order: 2,
            },
            {
              type: "bar", label: "Mano de Obra",
              data: DA_CURVA.map(m => m.mo),
              backgroundColor: "rgba(47,72,88,0.50)", borderRadius: 0, order: 2,
            },
            {
              type: "line", label: "% Acumulado",
              data: DA_CURVA.map(m => m.acum),
              yAxisID: "y2",
              borderColor: "#8E9189", backgroundColor: "rgba(142,145,137,0.06)",
              borderWidth: 1.5, tension: 0.4, fill: true,
              pointBackgroundColor: "#8E9189", pointRadius: 4, pointHoverRadius: 6, order: 1,
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { position: "top", align: "end", labels: { font: { family: "Fragment Mono", size: 9 }, color: C.cemento, boxWidth: 10, padding: 22 } },
            tooltip: {
              backgroundColor: C.abismo, padding: 14,
              titleFont: { family: "Fragment Mono", size: 9 }, bodyFont: { family: "Archivo", size: 11, weight: "300" },
              callbacks: { label: (c: any) => c.dataset.yAxisID === "y2" ? `  Acum. ${c.raw}%` : `  $${(c.raw / 1000).toFixed(1)}M` }
            }
          },
          scales: {
            x: { stacked: true, grid: { display: false }, ticks: { font: { family: "Fragment Mono", size: 9 }, color: "#9AA0A6", padding: 8 }, border: { color: C.niebla } },
            y: { stacked: true, grid: { color: "rgba(207,210,205,.22)" }, ticks: { font: { family: "Fragment Mono", size: 9 }, color: "#9AA0A6", padding: 8, callback: (v: any) => `$${(v / 1000).toFixed(0)}M` }, border: { display: false } },
            y2: { position: "right", min: 0, max: 100, grid: { display: false }, ticks: { font: { family: "Fragment Mono", size: 9 }, color: "#8E9189", padding: 8, callback: (v: any) => `${v}%` }, border: { display: false } }
          }
        }
      });
    }

    // ── DONUT CHART ──
    if (donutRef.current) {
      if (donutInst.current) donutInst.current.destroy();
      donutInst.current = new ChartJS(donutRef.current, {
        type: "doughnut",
        data: {
          labels: DA_DONUT.map(d => d.label),
          datasets: [{ data: DA_DONUT.map(d => d.ars), backgroundColor: DA_DONUT.map(d => d.color), borderWidth: 0, hoverOffset: 6 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: "68%",
          plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: C.abismo, padding: 12, titleFont: { family: "Fragment Mono", size: 9 }, bodyFont: { family: "Archivo", size: 11, weight: "300" }, callbacks: { label: (c: any) => `  $${(c.raw / 1000000).toFixed(1)}M` } }
          }
        }
      });
    }
    return () => { curvaInst.current?.destroy(); donutInst.current?.destroy(); };
  }, []);

  const obra = params.obraId;

  return (
    <div style={{ background: C.blanco, minHeight: "100vh", fontFamily: "'Archivo','Helvetica Neue',sans-serif", fontWeight: 300 }}>

      {/* ── HEADER ── */}
      <header style={{ background: C.abismo, padding: "36px 60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <IsoMark color={C.blanco} size={36}/>
          <div style={{ borderLeft: "1px solid rgba(207,210,205,0.25)", paddingLeft: 20 }}>
            <VaerWordmark color={C.niebla} height={20}/>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: "0 0 6px", fontFamily: "'Fragment Mono',monospace", fontSize: "0.58rem", color: C.acero, letterSpacing: "0.18em", textTransform: "uppercase" }}>Informe de Inversión</p>
          <h1 style={{ margin: "0 0 5px", fontFamily: "'Archivo',sans-serif", fontWeight: 300, fontSize: "1.3rem", color: C.blanco, letterSpacing: "0.02em" }}>Informe de Inversión</h1>
          <p style={{ margin: 0, fontFamily: "'Fragment Mono',monospace", fontSize: "0.62rem", color: C.cemento, letterSpacing: "0.06em" }}>Obra {obra.toUpperCase()} &nbsp;·&nbsp; Mayo 2026</p>
        </div>
      </header>

      {/* ── 01 CURVA ── */}
      <section style={{ padding: "52px 60px", borderBottom: `1px solid ${C.niebla}` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 36 }}>
          <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.58rem", color: C.niebla, letterSpacing: "0.1em" }}>01 /</span>
          <span style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 300, fontSize: "0.95rem", letterSpacing: "0.07em", textTransform: "uppercase" }}>Curva de Inversión Mensual</span>
        </div>
        <div style={{ position: "relative", height: 380 }}>
          <canvas ref={curvaRef}/>
        </div>
        {/* Grid mensual */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(9,1fr)", borderTop: `1px solid ${C.niebla}`, marginTop: 24 }}>
          {DA_CURVA.map((m, i) => (
            <div key={i} style={{ padding: "22px 10px 20px", textAlign: "center", borderRight: i < 8 ? `1px solid ${C.niebla}` : "none", background: i === 2 ? "rgba(47,72,88,0.04)" : "transparent" }}>
              <div style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.5rem", letterSpacing: "0.12em", color: C.cemento, textTransform: "uppercase", marginBottom: 10 }}>{m.mes}{i === 2 ? " ↑" : ""}</div>
              <div style={{ fontFamily: "'Archivo',sans-serif", fontWeight: i === 2 ? 500 : 400, fontSize: "0.8rem", color: C.abismo, marginBottom: 8 }}>${(m.total / 1000).toFixed(1)}M</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.abismo, flexShrink: 0 }}/>
                <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.46rem", color: C.cemento }}>MAT</span>
                <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.5rem", color: C.abismo }}>${(m.mat / 1000).toFixed(1)}M</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.acero, flexShrink: 0 }}/>
                <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.46rem", color: C.cemento }}>MO</span>
                <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.5rem", color: C.acero }}>${(m.mo / 1000).toFixed(1)}M</span>
              </div>
              <div style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.46rem", color: C.niebla, marginTop: 9 }}>{m.acum}% acum.</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 02 COMPOSICIÓN ── */}
      <section style={{ padding: "52px 60px", borderBottom: `1px solid ${C.niebla}` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 36 }}>
          <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.58rem", color: C.niebla, letterSpacing: "0.1em" }}>02 /</span>
          <span style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 300, fontSize: "0.95rem", letterSpacing: "0.07em", textTransform: "uppercase" }}>Composición de la Inversión</span>
        </div>
        <div style={{ maxWidth: 460, margin: "0 auto" }}>
          <div style={{ position: "relative", width: 210, height: 210, margin: "0 auto 28px" }}>
            <canvas ref={donutRef}/>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
              <div style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 300, fontSize: "1.35rem", color: C.abismo, lineHeight: 1 }}>$284M</div>
              <div style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.46rem", color: C.cemento, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 5 }}>Total obra</div>
            </div>
          </div>
          <ul style={{ listStyle: "none" }}>
            {DA_DONUT.map(d => (
              <li key={d.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.niebla}`, fontFamily: "'Archivo',sans-serif", fontWeight: 300, fontSize: "0.72rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }}/>
                {d.label}
                <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.55rem", color: C.niebla, marginLeft: "auto", marginRight: 8 }}>{d.pct}%</span>
                <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.6rem", color: C.cemento, whiteSpace: "nowrap" }}>{fmtARS(d.ars)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 03 RUBROS ── */}
      <section style={{ borderBottom: `1px solid ${C.niebla}` }}>
        <div style={{ padding: "48px 60px 36px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.58rem", color: C.niebla, letterSpacing: "0.1em" }}>03 /</span>
            <span style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 300, fontSize: "0.95rem", letterSpacing: "0.07em", textTransform: "uppercase" }}>Distribución por Rubros — Materiales</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {[
            { name: "Obra Gruesa", total: "$61,600,000", width: "40%", items: [["Estructura PB — losa entrepiso","8%","$12,320,000"],["Estructura PA — columnas y vigas","8%","$12,320,000"],["Estructura PA — losa techo","6%","$9,240,000"],["Mampostería — muros ext. e int.","7%","$10,780,000"],["Contrapisos","3%","$4,620,000"],["Revoques grueso y fino","4%","$6,160,000"],["Carpetas — nivelación","4%","$6,160,000"]] },
            { name: "Instalaciones", total: "$33,880,000", width: "22%", items: [["Sanitaria — agua y desagües","7%","$10,780,000"],["Electricidad — canaleteado","8%","$12,320,000"],["Pluvial — desagües","2%","$3,080,000"],["Gas — cañerías","3%","$4,620,000"],["Iluminación — artefactos y tablero","2%","$3,080,000"]] },
            { name: "Terminaciones", total: "$38,500,000", width: "25%", items: [["Pisos — porcelanato PB y PA","8%","$12,320,000"],["Pintura interior y exterior","5%","$7,700,000"],["Aberturas — puertas y ventanas","5%","$7,700,000"],["Artefactos sanitarios","3%","$4,620,000"],["Muebles utilitarios","2%","$3,080,000"],["Retoques finales y limpieza","2%","$3,080,000"]] },
            { name: "Piscina + Imprevistos", total: "$20,020,000", width: "13%", items: [["Piscina — ejecución completa","8%","$12,320,000"],["Reserva imprevistos","5%","$7,700,000"]] },
          ].map((cat, ci) => (
            <div key={cat.name} style={{ padding: "32px 44px", borderRight: ci % 2 === 0 ? `1px solid ${C.niebla}` : "none", borderBottom: ci < 2 ? `1px solid ${C.niebla}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.niebla}` }}>
                <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.cemento }}>{cat.name}</span>
                <span style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 400, fontSize: "0.88rem" }}>{cat.total}</span>
              </div>
              <div style={{ height: 2, background: C.niebla, marginBottom: 16, borderRadius: 1, overflow: "hidden" }}>
                <div style={{ height: "100%", width: cat.width, background: C.acero, borderRadius: 1 }}/>
              </div>
              {cat.items.map(([name, pct, monto]) => (
                <div key={name} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.niebla}` }}>
                  <span style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 300, fontSize: "0.72rem", flex: 1 }}>{name}</span>
                  <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.52rem", color: C.niebla, margin: "0 14px" }}>{pct}</span>
                  <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.63rem", color: C.cemento }}>{monto}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── KPIs ── */}
      <div style={{ padding: "40px 60px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.58rem", color: C.niebla, letterSpacing: "0.1em" }}>— /</span>
          <span style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 300, fontSize: "0.95rem", letterSpacing: "0.07em", textTransform: "uppercase" }}>Resumen de Inversión</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: `1px solid ${C.niebla}`, borderBottom: `1px solid ${C.niebla}` }}>
        {[
          { label: "Materiales", value: "$154.0M", sub: "54.2% del total", accent: false },
          { label: "Mano de Obra", value: "$130.4M", sub: "45.8% del total", accent: true },
          { label: "Inversión Total", value: "$284.4M", sub: "9 meses de ejecución", accent: false },
          { label: "Pico de Desembolso", value: "Mes 3", sub: "$53.6M · 18.9% del total", accent: true },
        ].map((k, i) => (
          <div key={k.label} style={{ padding: "36px 44px", borderRight: i < 3 ? `1px solid ${C.niebla}` : "none", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 44, width: 24, height: 2, background: C.acero }}/>
            <div style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.cemento, marginBottom: 12 }}>{k.label}</div>
            <div style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 300, fontSize: "1.7rem", color: k.accent ? C.acero : C.abismo, letterSpacing: "-0.01em", lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.55rem", color: C.niebla, marginTop: 8 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.abismo, padding: "26px 60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.52rem", color: C.acero, letterSpacing: "0.12em", textTransform: "uppercase" }}>Informe confidencial · Obra {obra.toUpperCase()} · Mayo 2026</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IsoMark color="rgba(207,210,205,0.4)" size={16}/>
          <VaerWordmark color="rgba(91,87,80,0.7)" height={12}/>
        </div>
        <Link href="/pagos" style={{ fontFamily: "'Fragment Mono',monospace", fontSize: "0.52rem", color: C.cemento, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>← Volver al sistema</Link>
      </footer>
    </div>
  );
}
