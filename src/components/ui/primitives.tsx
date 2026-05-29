"use client";
import React from "react";
import { C } from "@/lib/types";
import { chipColors } from "@/lib/utils";

// ─── STYLE TOKENS ─────────────────────────────────────────────
export const iSt: React.CSSProperties = {
  width: "100%", padding: "9px 12px",
  border: `1px solid ${C.niebla}`, borderRadius: 2,
  fontSize: 13, fontFamily: "inherit",
  color: C.abismo, background: "#fff",
  boxSizing: "border-box", outline: "none",
};
export const lSt: React.CSSProperties = {
  fontSize: 10, letterSpacing: "0.09em", textTransform: "uppercase",
  color: C.cemento, display: "block", marginBottom: 5, fontWeight: 600,
};
export const btnP: React.CSSProperties = {
  background: C.abismo, color: C.blanco, border: "none",
  padding: "10px 22px", borderRadius: 2,
  fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
  cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
};
export const btnS: React.CSSProperties = {
  background: "transparent", color: C.cemento,
  border: `1px solid ${C.niebla}`, padding: "9px 16px", borderRadius: 2,
  fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
  cursor: "pointer", fontFamily: "inherit",
};
export const thSt: React.CSSProperties = {
  padding: "9px 14px", fontSize: 10, letterSpacing: "0.08em",
  textTransform: "uppercase", color: C.cemento, fontWeight: 600,
  textAlign: "left", borderBottom: `1px solid ${C.niebla}`,
  background: "#F0EFEC", whiteSpace: "nowrap",
};
export const tdSt: React.CSSProperties = {
  padding: "10px 14px", fontSize: 12.5, color: C.abismo,
  borderBottom: `1px solid rgba(207,210,205,0.3)`, verticalAlign: "middle",
};

// ─── CHIP ──────────────────────────────────────────────────────
export function Chip({ label }: { label: string }) {
  const { bg, color } = chipColors(label);
  return (
    <span style={{
      background: bg, color, fontSize: 10, fontWeight: 700,
      letterSpacing: "0.06em", textTransform: "uppercase",
      padding: "3px 9px", borderRadius: 2, whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

// ─── CARD ──────────────────────────────────────────────────────
export function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.blanco, borderRadius: 3, boxShadow: "0 1px 4px rgba(2,17,27,0.07)", overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

export function CardHead({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div style={{ padding: "15px 22px", borderBottom: `1px solid ${C.niebla}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.09em", textTransform: "uppercase", color: C.cemento, fontWeight: 600 }}>{title}</p>
      {action}
    </div>
  );
}

// ─── MODAL ─────────────────────────────────────────────────────
export function Modal({ onClose, title, sub, children, wide = false }: {
  onClose: () => void; title: string; sub?: string; children: React.ReactNode; wide?: boolean;
}) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(2,17,27,0.65)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: C.blanco, borderRadius: 3, padding: 40, width: wide ? 740 : 620, maxWidth: "96vw", maxHeight: "92vh", overflowY: "auto", position: "relative", boxShadow: "0 40px 100px rgba(2,17,27,0.3)" }}
      >
        {sub && <p style={{ margin: "0 0 4px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.cemento }}>{sub}</p>}
        <h2 style={{ margin: "0 0 26px", fontSize: 20, fontWeight: 300, color: C.abismo }}>{title}</h2>
        {children}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", fontSize: 22, color: C.cemento, cursor: "pointer", fontFamily: "inherit" }}>×</button>
      </div>
    </div>
  );
}

// ─── FORM GRID & FIELD ─────────────────────────────────────────
export function G({ cols = "1fr 1fr", children }: { cols?: string; children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: cols, gap: 14, marginBottom: 14 }}>{children}</div>;
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={lSt}>{label}</label>{children}</div>;
}

// ─── HORIZONTAL BAR ────────────────────────────────────────────
export function HBar({ value, max, color, label, sub }: { value: number; max: number; color: string; label: string; sub: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 12, color: C.abismo }}>{label}</span>
        <span style={{ fontSize: 11, color: C.cemento, fontWeight: 600 }}>{sub}</span>
      </div>
      <div style={{ background: "#E4E3E0", borderRadius: 2, height: 5, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${max > 0 ? Math.min((value / max) * 100, 100) : 0}%`, background: color, borderRadius: 2, transition: "width 0.4s" }}/>
      </div>
    </div>
  );
}
