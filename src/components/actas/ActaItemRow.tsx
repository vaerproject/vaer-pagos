"use client";
import React, { useRef, useEffect } from "react";
import { C } from "@/lib/types";
import type { ActaItem } from "@/lib/types";
import { btnP, btnS } from "@/components/ui/primitives";

interface Props {
  item:     ActaItem;
  index:    number;
  onChange: (id: string, text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ActaItemRow({ item, index, onChange, onToggle, onDelete }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  useEffect(() => {
    if (ref.current) resize(ref.current);
  }, [item.text]);

  const taStyle: React.CSSProperties = {
    flex: 1,
    padding: "7px 10px",
    border: `1px solid ${C.niebla}`,
    borderRadius: 2,
    fontSize: 13,
    fontFamily: "inherit",
    color: item.done ? C.cemento : C.abismo,
    background: item.done ? "#F5F4F2" : "#fff",
    resize: "none",
    overflow: "hidden",
    outline: "none",
    textDecoration: item.done ? "line-through" : "none",
    boxSizing: "border-box",
    lineHeight: 1.5,
    transition: "color 0.15s, background 0.15s",
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: `1px solid rgba(207,210,205,0.35)` }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: item.done ? C.niebla : C.cemento, minWidth: 24, paddingTop: 9, letterSpacing: "0.04em", fontFamily: "inherit" }}>
        {String(index + 1).padStart(2, "0")}
      </span>

      <textarea
        ref={ref}
        value={item.text}
        rows={1}
        placeholder="Describir el tema o pendiente…"
        style={taStyle}
        onChange={e => { resize(e.target); onChange(item.id, e.target.value); }}
        onFocus={e => resize(e.target)}
      />

      <button
        type="button"
        title={item.done ? "Marcar como pendiente" : "Marcar como resuelto"}
        onClick={() => onToggle(item.id)}
        style={{
          ...btnP,
          padding: "6px 12px",
          fontSize: 11,
          marginTop: 2,
          background: item.done ? C.ok : "transparent",
          color: item.done ? C.blanco : C.cemento,
          border: `1px solid ${item.done ? C.ok : C.niebla}`,
          minWidth: 36,
          transition: "all 0.15s",
        }}
      >
        {item.done ? "✓" : "○"}
      </button>

      <button
        type="button"
        title="Eliminar ítem"
        onClick={() => onDelete(item.id)}
        style={{ ...btnS, padding: "6px 10px", fontSize: 12, marginTop: 2, color: C.cemento, lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
}
