# VAER — Sistema de Pagos

Next.js 14 + TypeScript. Deploy con Vercel con un click.

## Estructura

```
src/
  app/
    pagos/             → Dashboard, tabla, calendario, proveedores, obras, gastos
    informe-inversion/ → Curva de inversión por obra (ej: /informe-inversion/DA)
  components/
    brand/             → VaerWordmark, IsoMark (SVG)
    ui/                → Sidebar, Card, Modal, Chip, primitives
  lib/
    types.ts           → Interfaces TypeScript + constantes de marca
    utils.ts           → Formateo, fechas, colores
  data/
    seed.ts            → Datos iniciales (obras, pagos, proveedores, gastos, curva DA)
```

## Cómo correr en local

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy a Vercel

```bash
npx vercel
# O conectar el repo en vercel.com → Import Project
```

## TODO / próximos pasos con Claude Code

- [ ] Conectar a base de datos (Vercel KV, Supabase, o PlanetScale)
- [ ] Agregar autenticación (NextAuth o Clerk)
- [ ] Generar PDFs del informe de inversión
- [ ] Curvas de inversión para todas las obras (no solo DA)
- [ ] Notificaciones por email cuando un pago vence
- [ ] Exportar pagos a Excel

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/pagos` | Tabla completa de pagos |
| `/pagos/dashboard` | Dashboard semanal + KPIs |
| `/pagos/calendario` | Vencimientos ordenados |
| `/pagos/proveedores` | Directorio de proveedores |
| `/pagos/obras` | Catálogo de obras |
| `/pagos/gastos` | Gastos de oficina fijos + puntuales |
| `/informe-inversion/DA` | Informe de inversión Obra DA |
# vaer-pagos
