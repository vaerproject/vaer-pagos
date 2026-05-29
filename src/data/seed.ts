import type { Obra, Proveedor, Pago, GastoFijo, PagoFijo, GastoPuntual } from "@/lib/types";

export const SEED_OBRAS: Obra[] = [
  { id:"OB-IM",  codigo:"IM",  nombre:"IM – Remodelación Integral de Vivienda",       responsable:"IM",  estado:"En curso",    ubicacion:"", fechaInicio:"2025-03-01", presupuesto:null },
  { id:"OB-JMR", codigo:"JMR", nombre:"JMR – Reconstrucción Integral de Vivienda",    responsable:"JMR", estado:"En curso",    ubicacion:"", fechaInicio:"2025-06-15", presupuesto:null },
  { id:"OB-DA",  codigo:"DA",  nombre:"DA – Vivienda Construcción Llave en Mano",     responsable:"DA",  estado:"En curso",    ubicacion:"", fechaInicio:"2025-09-01", presupuesto:284400000 },
  { id:"OB-HR",  codigo:"HR",  nombre:"HR – Ampliación de Vivienda",                  responsable:"HR",  estado:"En curso",    ubicacion:"", fechaInicio:"2024-11-10", presupuesto:null },
  { id:"OB-FE",  codigo:"FE",  nombre:"FE – Interiorismo Consultorios Odontológicos", responsable:"FE",  estado:"Por iniciar", ubicacion:"", fechaInicio:"2026-06-01", presupuesto:null },
];

export const SEED_PROVEEDORES: Proveedor[] = [
  { id:"PROV-01", nombre:"Aceros SA",                   obraIds:["OB-IM"],  cuit:"30-12345678-9", cbu:"alias: aceros.sa",       telefono:"011-4444-1111", email:"ventas@acerosasa.com" },
  { id:"PROV-02", nombre:"Hormigones del Sur",           obraIds:["OB-JMR"], cuit:"30-23456789-0", cbu:"alias: hormigones.sur",  telefono:"011-4444-2222", email:"admin@hormigonessur.com" },
  { id:"PROV-03", nombre:"Cerámicas López",              obraIds:["OB-JMR"], cuit:"20-34567890-1", cbu:"alias: ceramicas.lopez", telefono:"011-4444-3333", email:"lopez@ceramicas.com" },
  { id:"PROV-04", nombre:"Instalaciones Eléctricas MR",  obraIds:["OB-IM"],  cuit:"20-45678901-2", cbu:"alias: electr.mr",       telefono:"011-4444-4444", email:"mr@electricas.com" },
  { id:"PROV-05", nombre:"Plomería Total",               obraIds:["OB-JMR"], cuit:"30-56789012-3", cbu:"alias: plomeria.total",  telefono:"011-4444-5555", email:"info@plomeriatotal.com" },
];

export const SEED_PAGOS: Pago[] = [
  { id:"P-001", obraId:"OB-IM",  proveedorId:"PROV-01", categoria:"Materiales",   concepto:"Hierro ø12 – Pedido #301",     montoTotal:450000, moneda:"ARS", tipoCambio:null, nCuotas:2, cuotaActual:1, montoCuota:225000, fechaLimite:"2026-05-16", estado:"Pendiente", fechaPagoReal:null, obs:"", comentario:"Confirmar entrega antes de pagar" },
  { id:"P-002", obraId:"OB-IM",  proveedorId:"PROV-04", categoria:"Subcontrato",  concepto:"Tableros eléctricos",          montoTotal:320000, moneda:"ARS", tipoCambio:null, nCuotas:2, cuotaActual:1, montoCuota:160000, fechaLimite:"2026-05-20", estado:"Pendiente", fechaPagoReal:null, obs:"", comentario:"" },
  { id:"P-003", obraId:"OB-IM",  proveedorId:"PROV-01", categoria:"Materiales",   concepto:"Cañería estructural",          montoTotal:1800,   moneda:"USD", tipoCambio:1210, nCuotas:1, cuotaActual:1, montoCuota:1800,   fechaLimite:"2026-05-19", estado:"Pendiente", fechaPagoReal:null, obs:"", comentario:"Pago en efectivo USD" },
  { id:"P-004", obraId:"OB-JMR", proveedorId:"PROV-02", categoria:"Mano de obra", concepto:"Hormigón H25 – Losa 3er piso",montoTotal:820000, moneda:"ARS", tipoCambio:null, nCuotas:1, cuotaActual:1, montoCuota:820000, fechaLimite:"2026-05-15", estado:"Vencido",   fechaPagoReal:null, obs:"", comentario:"Llamar a Martínez" },
  { id:"P-005", obraId:"OB-JMR", proveedorId:"PROV-03", categoria:"Materiales",   concepto:"Porcelanato baños",            montoTotal:185000, moneda:"ARS", tipoCambio:null, nCuotas:2, cuotaActual:1, montoCuota:92500,  fechaLimite:"2026-04-30", estado:"Pagado",    fechaPagoReal:"2026-04-30", obs:"", comentario:"" },
  { id:"P-006", obraId:"OB-JMR", proveedorId:"PROV-05", categoria:"Subcontrato",  concepto:"Red cloacal bloque B",        montoTotal:280000, moneda:"ARS", tipoCambio:null, nCuotas:2, cuotaActual:1, montoCuota:140000, fechaLimite:"2026-05-05", estado:"Vencido",   fechaPagoReal:null, obs:"", comentario:"Sin respuesta del proveedor" },
  { id:"P-007", obraId:"OB-DA",  proveedorId:null,       categoria:"Mano de obra", concepto:"Mampostería planta baja",     montoTotal:560000, moneda:"ARS", tipoCambio:null, nCuotas:2, cuotaActual:1, montoCuota:280000, fechaLimite:"2026-05-22", estado:"Pendiente", fechaPagoReal:null, obs:"", comentario:"" },
  { id:"P-008", obraId:"OB-HR",  proveedorId:null,       categoria:"Equipamiento", concepto:"Sanitarios y grifería",       montoTotal:2200,   moneda:"USD", tipoCambio:1200, nCuotas:1, cuotaActual:1, montoCuota:2200,   fechaLimite:"2026-05-18", estado:"Pendiente", fechaPagoReal:null, obs:"", comentario:"Cotización pedida a 3 proveedores" },
  { id:"P-009", obraId:"OB-HR",  proveedorId:null,       categoria:"Subcontrato",  concepto:"Cubierta liviana duplex",     montoTotal:620000, moneda:"ARS", tipoCambio:null, nCuotas:2, cuotaActual:1, montoCuota:310000, fechaLimite:"2026-05-21", estado:"Pendiente", fechaPagoReal:null, obs:"", comentario:"" },
  { id:"P-010", obraId:"OB-FE",  proveedorId:null,       categoria:"Honorarios",   concepto:"Proyecto ejecutivo planos",  montoTotal:350000, moneda:"ARS", tipoCambio:null, nCuotas:2, cuotaActual:1, montoCuota:175000, fechaLimite:"2026-05-28", estado:"Pendiente", fechaPagoReal:null, obs:"", comentario:"Aguardar planos finales" },
  { id:"P-011", obraId:"OB-FE",  proveedorId:null,       categoria:"Honorarios",   concepto:"Estudio de suelos",          montoTotal:120000, moneda:"ARS", tipoCambio:null, nCuotas:1, cuotaActual:1, montoCuota:120000, fechaLimite:"2026-05-30", estado:"Pendiente", fechaPagoReal:null, obs:"", comentario:"" },
];

export const SEED_GASTOS_FIJOS: GastoFijo[] = [
  { id:"GF-01", concepto:"Alquiler oficina",      categoria:"Alquiler",      moneda:"ARS", monto:280000, dia:1,  activo:true, comentario:"" },
  { id:"GF-02", concepto:"Sueldo administrativa", categoria:"Sueldos",       moneda:"ARS", monto:350000, dia:5,  activo:true, comentario:"" },
  { id:"GF-03", concepto:"Internet + telefonía",  categoria:"Servicios",     moneda:"ARS", monto:18000,  dia:10, activo:true, comentario:"" },
  { id:"GF-04", concepto:"Adobe Creative Cloud",  categoria:"Suscripciones", moneda:"USD", monto:55,     dia:15, activo:true, comentario:"" },
  { id:"GF-05", concepto:"Google Workspace",      categoria:"Suscripciones", moneda:"USD", monto:12,     dia:15, activo:true, comentario:"" },
  { id:"GF-06", concepto:"Luz y gas oficina",     categoria:"Servicios",     moneda:"ARS", monto:22000,  dia:20, activo:true, comentario:"" },
];

export const SEED_PAGOS_FIJOS: PagoFijo[] = [
  { gastoId:"GF-01", anio:2026, mes:3, pagado:true,  fechaPago:"2026-04-01" },
  { gastoId:"GF-02", anio:2026, mes:3, pagado:true,  fechaPago:"2026-04-05" },
  { gastoId:"GF-03", anio:2026, mes:3, pagado:true,  fechaPago:"2026-04-10" },
  { gastoId:"GF-04", anio:2026, mes:3, pagado:true,  fechaPago:"2026-04-15" },
  { gastoId:"GF-05", anio:2026, mes:3, pagado:true,  fechaPago:"2026-04-15" },
  { gastoId:"GF-06", anio:2026, mes:3, pagado:true,  fechaPago:"2026-04-20" },
  { gastoId:"GF-01", anio:2026, mes:4, pagado:true,  fechaPago:"2026-05-01" },
  { gastoId:"GF-02", anio:2026, mes:4, pagado:false, fechaPago:null },
  { gastoId:"GF-03", anio:2026, mes:4, pagado:false, fechaPago:null },
  { gastoId:"GF-04", anio:2026, mes:4, pagado:false, fechaPago:null },
  { gastoId:"GF-05", anio:2026, mes:4, pagado:false, fechaPago:null },
  { gastoId:"GF-06", anio:2026, mes:4, pagado:false, fechaPago:null },
];

export const SEED_GASTOS_PUNTUALES: GastoPuntual[] = [
  { id:"GP-001", fecha:"2026-04-08", concepto:"Impresión planos",        categoria:"Insumos de oficina", moneda:"ARS", monto:8500,  comentario:"" },
  { id:"GP-002", fecha:"2026-04-22", concepto:"Reparación impresora",    categoria:"Insumos de oficina", moneda:"ARS", monto:15000, comentario:"" },
  { id:"GP-003", fecha:"2026-05-03", concepto:"Materiales presentación", categoria:"Insumos de oficina", moneda:"ARS", monto:6200,  comentario:"" },
];

// ─── DA Investment Curve (for Informe page) ───────────────────
export const DA_CURVA = [
  { mes:"Mes 1", total:17034,  mat:3234,  mo:13800, acum:5.99  },
  { mes:"Mes 2", total:38440,  mat:23408, mo:15032, acum:19.51 },
  { mes:"Mes 3", total:53609,  mat:37961, mo:15648, acum:38.36 },
  { mes:"Mes 4", total:45755,  mat:30107, mo:15648, acum:54.45 },
  { mes:"Mes 5", total:37285,  mat:22253, mo:15032, acum:67.56 },
  { mes:"Mes 6", total:29585,  mat:15785, mo:13800, acum:77.97 },
  { mes:"Mes 7", total:26274,  mat:12474, mo:13800, acum:87.21 },
  { mes:"Mes 8", total:20961,  mat:7161,  mo:13800, acum:94.58 },
  { mes:"Mes 9", total:15417,  mat:1617,  mo:13800, acum:100   },
];

export const DA_DONUT = [
  { label:"Obra Gruesa",    pct:40, ars:61600000, color:"#02111B" },
  { label:"Instalaciones",  pct:22, ars:33880000, color:"#2F4858" },
  { label:"Terminaciones",  pct:25, ars:38500000, color:"#5B5750" },
  { label:"Piscina",        pct:8,  ars:12320000, color:"#8E9189" },
  { label:"Imprevistos",    pct:5,  ars:7700000,  color:"#CFD2CD" },
];
