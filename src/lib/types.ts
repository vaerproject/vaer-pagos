// ─── BRAND COLORS ────────────────────────────────────────────
export const C = {
  abismo:  "#02111B",
  acero:   "#2F4858",
  cemento: "#5B5750",
  niebla:  "#CFD2CD",
  blanco:  "#FBFBFB",
  fondo:   "#EDECEA",
  vencido: "#7A3030",
  ok:      "#2E5E3E",
  warning: "#7A5C20",
} as const;

export const OBRA_COLORS: Record<string, string> = {
  "OB-IM":  "#2F4858",
  "OB-JMR": "#5B5750",
  "OB-DA":  "#3B5248",
  "OB-HR":  "#6B4C3B",
  "OB-FE":  "#3B4A6B",
};

// ─── TYPES ───────────────────────────────────────────────────
export type Moneda  = "ARS" | "USD";
export type EstadoPago  = "Pendiente" | "Pagado" | "Vencido";
export type EstadoObra  = "En curso" | "Pausada" | "Finalizada" | "Por iniciar";

export interface Obra {
  id:          string;
  codigo:      string;
  nombre:      string;
  responsable: string;
  estado:      EstadoObra;
  ubicacion:   string;
  fechaInicio: string;
  presupuesto: number | null;
}

export interface Proveedor {
  id:       string;
  nombre:   string;
  obraIds:  string[];
  cuit:     string;
  cbu:      string;
  telefono: string;
  email:    string;
}

export interface Pago {
  id:           string;
  obraId:       string;
  proveedorId:  string | null;
  categoria:    string;
  concepto:     string;
  montoTotal:   number;
  moneda:       Moneda;
  tipoCambio:   number | null;
  nCuotas:      number;
  cuotaActual:  number;
  montoCuota:   number;
  fechaLimite:  string;
  estado:       EstadoPago;
  fechaPagoReal: string | null;
  obs:          string;
  comentario:   string;
}

export interface GastoFijo {
  id:         string;
  concepto:   string;
  categoria:  string;
  moneda:     Moneda;
  monto:      number;
  dia:        number;
  activo:     boolean;
  comentario: string;
}

export interface PagoFijo {
  gastoId:   string;
  anio:      number;
  mes:       number;
  pagado:    boolean;
  fechaPago: string | null;
}

export interface GastoPuntual {
  id:         string;
  fecha:      string;
  concepto:   string;
  categoria:  string;
  moneda:     Moneda;
  monto:      number;
  comentario: string;
}

// ─── ACTAS ───────────────────────────────────────────────────
export interface ActaItem {
  id:   string;
  text: string;
  done: boolean;
}

export interface Acta {
  id:            string;
  obra:          string;
  fecha:         string;
  items:         ActaItem[];
  notas:         string;
  creadoEn:      string;
  actualizadoEn: string;
}

// ─── CONSTANTS ───────────────────────────────────────────────
export const CATEGORIAS    = ["Materiales", "Mano de obra", "Subcontrato", "Equipamiento", "Honorarios", "Otro"] as const;
export const ESTADOS_OBRA  = ["En curso", "Pausada", "Finalizada", "Por iniciar"] as const;
export const CAT_GASTOS    = ["Alquiler", "Servicios", "Sueldos", "Insumos de oficina", "Suscripciones", "Otro"] as const;
export const MESES_NOMBRES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"] as const;
export const MESES_CORTOS  = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"] as const;
export const TODAY_STR     = new Date().toISOString().slice(0, 10);
export const TODAY         = new Date(TODAY_STR);
