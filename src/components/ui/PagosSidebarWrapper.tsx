"use client";
import { Sidebar } from "@/components/ui/Sidebar";
import { usePagos } from "@/context/PagosContext";

export function PagosSidebarWrapper() {
  const { obras } = usePagos();
  return <Sidebar obras={obras} />;
}
