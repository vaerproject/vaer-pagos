"use client";
import { useParams, useRouter } from "next/navigation";
import { C } from "@/lib/types";
import type { Acta } from "@/lib/types";
import { usePagos } from "@/context/PagosContext";
import { ActaForm } from "@/components/actas/ActaForm";

export default function EditActaPage() {
  const { id } = useParams<{ id: string }>();
  const { actas, setActas } = usePagos();
  const router = useRouter();

  const acta = actas.find(a => a.id === id);

  if (!acta) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ margin: "0 0 6px", fontSize: 15, color: C.cemento }}>Acta no encontrada</p>
        <button
          type="button"
          onClick={() => router.push("/pagos/actas")}
          style={{ marginTop: 14, fontSize: 11, color: C.acero, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.06em", textTransform: "uppercase" }}
        >
          ← Volver al listado
        </button>
      </div>
    );
  }

  const handleSave = (updated: Acta) => {
    setActas(prev => prev.map(a => a.id === id ? updated : a));
    router.push("/pagos/actas");
  };

  return (
    <div>
      <div style={{ marginBottom: 26 }}>
        <p style={{ margin: "0 0 4px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.cemento }}>Actas</p>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 300, color: C.abismo }}>
          {acta.obra || "Editar Acta"}
        </h1>
        {acta.actualizadoEn && (
          <p style={{ margin: "5px 0 0", fontSize: 11, color: C.niebla }}>
            Última edición: {new Date(acta.actualizadoEn).toLocaleString("es-AR")}
          </p>
        )}
      </div>
      <ActaForm
        initial={acta}
        isEdit
        onSave={handleSave}
        onCancel={() => router.push("/pagos/actas")}
      />
    </div>
  );
}
