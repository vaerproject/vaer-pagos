"use client";
import { createContext, useContext, useState, useEffect } from "react";
import {
  SEED_OBRAS, SEED_PAGOS, SEED_PROVEEDORES,
  SEED_GASTOS_FIJOS, SEED_PAGOS_FIJOS, SEED_GASTOS_PUNTUALES,
} from "@/data/seed";
import type { Obra, Pago, Proveedor, GastoFijo, PagoFijo, GastoPuntual, Acta } from "@/lib/types";

type Ctx = {
  obras:           Obra[];            setObras:           React.Dispatch<React.SetStateAction<Obra[]>>;
  pagos:           Pago[];            setPagos:           React.Dispatch<React.SetStateAction<Pago[]>>;
  provs:           Proveedor[];       setProvs:           React.Dispatch<React.SetStateAction<Proveedor[]>>;
  gastosFijos:     GastoFijo[];       setGastosFijos:     React.Dispatch<React.SetStateAction<GastoFijo[]>>;
  pagosFijos:      PagoFijo[];        setPagosFijos:      React.Dispatch<React.SetStateAction<PagoFijo[]>>;
  gastosPuntuales: GastoPuntual[];    setGastosPuntuales: React.Dispatch<React.SetStateAction<GastoPuntual[]>>;
  actas:           Acta[];            setActas:           React.Dispatch<React.SetStateAction<Acta[]>>;
};

const PagosCtx = createContext<Ctx | null>(null);

function loadActas(): Acta[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("vaer-actas");
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

export function PagosProvider({ children }: { children: React.ReactNode }) {
  const [obras,           setObras]           = useState<Obra[]>(SEED_OBRAS);
  const [pagos,           setPagos]           = useState<Pago[]>(SEED_PAGOS);
  const [provs,           setProvs]           = useState<Proveedor[]>(SEED_PROVEEDORES);
  const [gastosFijos,     setGastosFijos]     = useState<GastoFijo[]>(SEED_GASTOS_FIJOS);
  const [pagosFijos,      setPagosFijos]      = useState<PagoFijo[]>(SEED_PAGOS_FIJOS);
  const [gastosPuntuales, setGastosPuntuales] = useState<GastoPuntual[]>(SEED_GASTOS_PUNTUALES);
  const [actas,           setActas]           = useState<Acta[]>(loadActas);

  useEffect(() => {
    localStorage.setItem("vaer-actas", JSON.stringify(actas));
  }, [actas]);

  return (
    <PagosCtx.Provider value={{ obras, setObras, pagos, setPagos, provs, setProvs, gastosFijos, setGastosFijos, pagosFijos, setPagosFijos, gastosPuntuales, setGastosPuntuales, actas, setActas }}>
      {children}
    </PagosCtx.Provider>
  );
}

export function usePagos(): Ctx {
  const ctx = useContext(PagosCtx);
  if (!ctx) throw new Error("usePagos debe usarse dentro de PagosProvider");
  return ctx;
}
