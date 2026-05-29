import { C, OBRA_COLORS, TODAY } from "./types";

// ─── FORMAT ──────────────────────────────────────────────────
export const fmtARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n || 0);

export const fmtUSD = (n: number) =>
  `U$D ${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(n || 0)}`;

export const fmtDate = (d: string | null) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

export const fmtMonto = (monto: number, moneda: "ARS" | "USD") =>
  moneda === "USD" ? fmtUSD(monto) : fmtARS(monto);

// ─── DATE UTILS ──────────────────────────────────────────────
export const diasPara = (f: string) =>
  Math.ceil((new Date(f).getTime() - TODAY.getTime()) / 86400000);

export const startOfWeek = () => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
};

export const endOfWeek = () => {
  const d = startOfWeek();
  d.setDate(d.getDate() + 6);
  return d;
};

export const isThisWeek = (f: string) => {
  const dt = new Date(f);
  return dt >= startOfWeek() && dt <= endOfWeek();
};

// ─── COLOR UTILS ─────────────────────────────────────────────
export const obraColor = (id: string) => OBRA_COLORS[id] || C.acero;

export const obraEstColor = (e: string) =>
  ({ "En curso": C.acero, "Pausada": C.cemento, "Finalizada": C.ok, "Por iniciar": C.niebla }[e] || C.cemento);

export const chipColors = (e: string) =>
  ({
    Pendiente: { bg: "rgba(47,72,88,0.12)", color: C.acero },
    Pagado:    { bg: "rgba(46,94,62,0.13)", color: C.ok },
    Vencido:   { bg: "rgba(122,48,48,0.14)", color: C.vencido },
  }[e] || { bg: "#eee", color: "#555" });

// ─── AGGREGATION ─────────────────────────────────────────────
export const sumARS = (arr: { moneda: string; montoCuota: number }[]) =>
  arr.filter(p => p.moneda === "ARS").reduce((s, p) => s + p.montoCuota, 0);

export const sumUSD = (arr: { moneda: string; montoCuota: number }[]) =>
  arr.filter(p => p.moneda === "USD").reduce((s, p) => s + p.montoCuota, 0);
