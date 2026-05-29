import { PagosProvider } from "@/context/PagosContext";
import { PagosSidebarWrapper } from "@/components/ui/PagosSidebarWrapper";
import { C } from "@/lib/types";

export default function PagosLayout({ children }: { children: React.ReactNode }) {
  return (
    <PagosProvider>
      <div style={{ display: "flex", minHeight: "100vh", background: C.fondo, fontFamily: "'Archivo','Helvetica Neue',sans-serif" }}>
        <PagosSidebarWrapper />
        <main style={{ marginLeft: 224, flex: 1, padding: "36px 44px", minHeight: "100vh" }}>
          {children}
        </main>
      </div>
    </PagosProvider>
  );
}
