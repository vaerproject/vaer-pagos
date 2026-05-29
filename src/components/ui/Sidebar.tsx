"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { C, OBRA_COLORS } from "@/lib/types";
import { VaerWordmark, IsoMark } from "@/components/brand/VaerBrand";
import type { Obra } from "@/lib/types";

const NAV = [
  { href: "/pagos/dashboard",   label: "Dashboard"    },
  { href: "/pagos",             label: "Pagos"        },
  { href: "/pagos/calendario",  label: "Calendario"   },
  { href: "/pagos/proveedores", label: "Proveedores"  },
  { href: "/pagos/obras",       label: "Obras"        },
  { href: "/pagos/gastos",      label: "Gastos Admin" },
];

export function Sidebar({ obras }: { obras: Obra[] }) {
  const path = usePathname();

  const navSt = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 10,
    padding: "11px 24px 11px 22px", cursor: "pointer",
    fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
    color: active ? "rgba(251,251,251,0.92)" : "rgba(207,210,205,0.42)",
    border: "none",
    background: active ? "rgba(251,251,251,0.06)" : "transparent",
    width: "100%", textAlign: "left", fontFamily: "inherit",
    borderLeft: active ? `2px solid ${C.niebla}` : "2px solid transparent",
    textDecoration: "none",
  });

  return (
    <aside style={{ width: 224, background: C.abismo, display: "flex", flexDirection: "column", position: "fixed", height: "100vh", zIndex: 200, top: 0, left: 0 }}>
      {/* Logo */}
      <div style={{ padding: "26px 22px 20px", borderBottom: "1px solid rgba(251,251,251,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <IsoMark color={C.blanco} size={18}/>
          <VaerWordmark color={C.blanco} height={15}/>
        </div>
        <p style={{ margin: 0, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(207,210,205,0.3)" }}>Sistema de Pagos</p>
      </div>

      {/* Obras rápido */}
      <div style={{ padding: "12px 0 8px", borderBottom: "1px solid rgba(251,251,251,0.06)" }}>
        <p style={{ margin: "0 0 4px 22px", fontSize: 9, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(207,210,205,0.25)" }}>Obras</p>
        {obras.map(o => (
          <Link key={o.id} href={`/pagos?obra=${o.id}`}
            style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 22px", width: "100%", textDecoration: "none" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: OBRA_COLORS[o.id] || C.acero, flexShrink: 0 }}/>
            <span style={{ fontSize: 10, color: "rgba(207,210,205,0.55)", letterSpacing: "0.03em", fontWeight: 600 }}>{o.codigo}</span>
            <span style={{ fontSize: 10, color: "rgba(207,210,205,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {o.nombre.split("–")[1]?.trim() || ""}
            </span>
          </Link>
        ))}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 10 }}>
        {NAV.map(item => {
          const active = path === item.href || (item.href !== "/pagos" && path.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={navSt(active)}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: active ? C.niebla : "transparent", flexShrink: 0 }}/>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Informe DA link */}
      <div style={{ padding: "10px 22px", borderTop: "1px solid rgba(251,251,251,0.06)" }}>
        <Link href="/informe-inversion/DA"
          style={{ display: "block", fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(207,210,205,0.45)", textDecoration: "none", padding: "6px 0" }}>
          📊 Informe Inversión DA →
        </Link>
      </div>

      <div style={{ padding: "12px 22px", borderTop: "1px solid rgba(251,251,251,0.07)" }}>
        <p style={{ margin: 0, fontSize: 9, color: "rgba(207,210,205,0.25)", letterSpacing: "0.05em", textTransform: "uppercase" }}>VAER · Mayo 2026</p>
      </div>
    </aside>
  );
}
