"use client";
import { useRouter } from "next/navigation";
import { C } from "@/lib/types";
import type { Acta } from "@/lib/types";
import { usePagos } from "@/context/PagosContext";
import { ActaForm } from "@/components/actas/ActaForm";

export default function NuevaActaPage() {
  const { setActas } = usePagos();
  const router = useRouter();

  const handleSave = (acta: Acta) => {
    setActas(prev => [acta, ...prev]);
    router.push("/pagos/actas");
  };

  return (
    <div>
      <div style={{ marginBottom: 26 }}>
        <p style={{ margin: "0 0 4px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.cemento }}>Actas</p>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 300, color: C.abismo }}>Nueva Acta de Reunión</h1>
      </div>
      <ActaForm
        onSave={handleSave}
        onCancel={() => router.push("/pagos/actas")}
      />
    </div>
  );
}
