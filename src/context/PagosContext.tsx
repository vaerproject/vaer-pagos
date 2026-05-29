"use client";
import { createContext, useContext, useState } from "react";
import {
  SEED_OBRAS, SEED_PAGOS, SEED_PROVEEDORES,
  SEED_GASTOS_FIJOS, SEED_PAGOS_FIJOS, SEED_GASTOS_PUNTUALES,
} from "@/data/seed";
import type { Obra, Pago, Proveedor, GastoFijo, PagoFijo, GastoPuntual } from "@/lib/types";

type Ctx = {
  obras:           Obra[];            setObras:           React.Dispatch<React.SetStateAction<Obra[]>>;
  pagos:           Pago[];            setPagos:           React.Dispatch<React.SetStateAction<Pago[]>>;
  provs:           Proveedor[];       setProvs:           React.Dispatch<React.SetStateAction<Proveedor[]>>;
  gastosFijos:     GastoFijo[];       setGastosFijos:     React.Dispatch<React.SetStateAction<GastoFijo[]>>;
  pagosFijos:      PagoFijo[];        setPagosFijos:      React.Dispatch<React.SetStateAction<PagoFijo[]>>;
  gastosPuntuales: GastoPuntual[];    setGastosPuntuales: React.Dispatch<React.SetStateAction<GastoPuntual[]>>;
};

const PagosCtx = createContext<Ctx | null>(null);

export function PagosProvider({ children }: { children: React.ReactNode }) {
  const [obras,           setObras]           = useState<Obra[]>(SEED_OBRAS);
  const [pagos,           setPagos]           = useState<Pago[]>(SEED_PAGOS);
  const [provs,           setProvs]           = useState<Proveedor[]>(SEED_PROVEEDORES);
  const [gastosFijos,     setGastosFijos]     = useState<GastoFijo[]>(SEED_GASTOS_FIJOS);
  const [pagosFijos,      setPagosFijos]      = useState<PagoFijo[]>(SEED_PAGOS_FIJOS);
  const [gastosPuntuales, setGastosPuntuales] = useState<GastoPuntual[]>(SEED_GASTOS_PUNTUALES);

  return (
    <PagosCtx.Provider value={{ obras, setObras, pagos, setPagos, provs, setProvs, gastosFijos, setGastosFijos, pagosFijos, setPagosFijos, gastosPuntuales, setGastosPuntuales }}>
      {children}
    </PagosCtx.Provider>
  );
}

export function usePagos(): Ctx {
  const ctx = useContext(PagosCtx);
  if (!ctx) throw new Error("usePagos debe usarse dentro de PagosProvider");
  return ctx;
}
