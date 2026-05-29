"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { C } from "@/lib/types";
import type { Acta, ActaItem } from "@/lib/types";
import { usePagos } from "@/context/PagosContext";
import { Card, iSt, lSt, btnP, btnS } from "@/components/ui/primitives";
import { ActaItemRow } from "@/components/actas/ActaItemRow";
const openPrint = (id: string) => window.open(`/pagos/actas/${id}/print`, "_blank");
import { TODAY_STR } from "@/lib/types";

const newItemId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

interface Props {
  initial?: Acta;
  onSave:   (acta: Acta) => void;
  onCancel: () => void;
  isEdit?:  boolean;
}

export function ActaForm({ initial, onSave, onCancel, isEdit = false }: Props) {
  const { obras } = usePagos();

  const blank = useCallback((): Acta => ({
    id:            `ACTA-${Date.now()}`,
    obra:          "",
    fecha:         TODAY_STR,
    items:         [],
    notas:         "",
    creadoEn:      new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  }), []);

  const [acta, setActa] = useState<Acta>(initial ?? blank);
  const notasRef = useRef<HTMLTextAreaElement>(null);

  const resizeNotas = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };
  useEffect(() => { if (notasRef.current) resizeNotas(notasRef.current); }, [acta.notas]);

  const setField = (k: keyof Acta, v: string) =>
    setActa(prev => ({ ...prev, [k]: v, actualizadoEn: new Date().toISOString() }));

  const addItem = () =>
    setActa(prev => ({ ...prev, items: [...prev.items, { id: newItemId(), text: "", done: false }] }));

  const updateItem = (id: string, text: string) =>
    setActa(prev => ({ ...prev, items: prev.items.map(it => it.id === id ? { ...it, text } : it) }));

  const toggleItem = (id: string) =>
    setActa(prev => ({ ...prev, items: prev.items.map(it => it.id === id ? { ...it, done: !it.done } : it) }));

  const deleteItem = (id: string) =>
    setActa(prev => ({ ...prev, items: prev.items.filter(it => it.id !== id) }));

  const handleKeyDownOnInput = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); addItem(); }
  };

  const resueltos = acta.items.filter(i => i.done).length;

  return (
    <div>
      {/* ── Encabezado ────────────────────────────────────────── */}
      <Card style={{ marginBottom: 20, padding: "24px 28px" }}>
        <p style={{ margin: "0 0 18px", fontSize: 10, letterSpacing: "0.09em", textTransform: "uppercase", color: C.cemento, fontWeight: 600 }}>
          Datos del acta
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 16 }}>
          <div>
            <label style={lSt}>Obra / Proyecto</label>
            <input
              list="obras-list"
              value={acta.obra}
              onChange={e => setField("obra", e.target.value)}
              placeholder="Nombre de la obra o proyecto…"
              style={iSt}
            />
            <datalist id="obras-list">
              {obras.map(o => <option key={o.id} value={o.nombre} />)}
            </datalist>
          </div>
          <div>
            <label style={lSt}>Fecha</label>
            <input
              type="date"
              value={acta.fecha}
              onChange={e => setField("fecha", e.target.value)}
              style={iSt}
            />
          </div>
        </div>
      </Card>

      {/* ── Ítems ─────────────────────────────────────────────── */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ padding: "15px 22px", borderBottom: `1px solid ${C.niebla}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.09em", textTransform: "uppercase", color: C.cemento, fontWeight: 600 }}>
              Temas tratados / Pendientes
            </p>
            {acta.items.length > 0 && (
              <p style={{ margin: "3px 0 0", fontSize: 11, color: C.niebla }}>
                {resueltos}/{acta.items.length} resueltos
              </p>
            )}
          </div>
          <button type="button" onClick={addItem} style={{ ...btnP, padding: "6px 16px", fontSize: 10 }}>
            + Agregar ítem
          </button>
        </div>

        <div style={{ padding: "4px 22px 14px" }}>
          {acta.items.length === 0 ? (
            <div style={{ padding: "28px 0", textAlign: "center" }}>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: C.niebla }}>Sin ítems todavía</p>
              <button type="button" onClick={addItem} style={{ ...btnS, padding: "8px 20px", fontSize: 11 }}>
                + Agregar primer ítem
              </button>
            </div>
          ) : (
            acta.items.map((item, idx) => (
              <ActaItemRow
                key={item.id}
                item={item}
                index={idx}
                onChange={updateItem}
                onToggle={toggleItem}
                onDelete={deleteItem}
              />
            ))
          )}
        </div>

        {acta.items.length > 0 && (
          <div style={{ padding: "10px 22px", borderTop: `1px solid rgba(207,210,205,0.35)` }}>
            <button
              type="button"
              onClick={addItem}
              onKeyDown={handleKeyDownOnInput}
              style={{ ...btnS, padding: "7px 18px", fontSize: 10, width: "100%", textAlign: "center" }}
            >
              + Agregar ítem (o presioná Enter)
            </button>
          </div>
        )}
      </Card>

      {/* ── Notas ─────────────────────────────────────────────── */}
      <Card style={{ marginBottom: 28, padding: "20px 22px" }}>
        <label style={{ ...lSt, marginBottom: 8 }}>Notas adicionales</label>
        <textarea
          ref={notasRef}
          value={acta.notas}
          rows={3}
          placeholder="Observaciones generales, próximos pasos, acuerdos…"
          style={{ ...iSt, resize: "none", overflow: "hidden", lineHeight: 1.6 }}
          onChange={e => { resizeNotas(e.target); setField("notas", e.target.value); }}
          onFocus={e => resizeNotas(e.target)}
        />
      </Card>

      {/* ── Acciones ──────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
        <button
          type="button"
          onClick={() => openPrint(acta.id)}
          style={{ ...btnS, padding: "10px 20px", fontSize: 10 }}
        >
          ↓ Descargar PDF
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={onCancel} style={btnS}>Cancelar</button>
          <button
            type="button"
            onClick={() => onSave({ ...acta, actualizadoEn: new Date().toISOString() })}
            style={btnP}
          >
            {isEdit ? "Guardar cambios" : "Guardar Acta"}
          </button>
        </div>
      </div>
    </div>
  );
}
