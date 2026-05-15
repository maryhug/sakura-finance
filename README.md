# 🌸 Sakura Finance

Una app de control de finanzas personales: linda, útil y fácil de usar.

> **Estética:** Kawaii rosada pastel, inspirada en el universo cute/sakura — sin assets con copyright.

---

## ¿Qué hace?

- 💰 **Balance total** — cuánto tenés en todo momento
- 📈 **Ingresos y gastos del mes** — con tasa de ahorro
- 📊 **Gráficos** — evolución mensual y gastos por categoría
- 📋 **CRUD de movimientos** — crear, editar, eliminar, filtrar por tipo/categoría/mes
- 🏷️ **Categorías** — predeterminadas + las tuyas propias
- 🐷 **Metas de ahorro** — con progreso visual, fechas límite e íconos

---

## Stack

| Tecnología | Versión | Rol |
|-----------|---------|-----|
| Next.js | 16 (App Router) | Framework full-stack |
| TypeScript | 5 | Tipado estático |
| Tailwind CSS | 4 | Estilos (config en CSS) |
| Prisma | 7 | ORM + migraciones |
| PostgreSQL | — | Base de datos (vía Supabase) |
| Auth.js | v5 (beta) | Autenticación con Credentials |
| React Hook Form | 7 | Formularios |
| Zod | 4 | Validación de esquemas |
| Recharts | 3 | Gráficos |
| Lucide React | — | Íconos |

---

## Instalación local

### 1. Clonar y entrar

```bash
git clone <url-del-repo>
cd sakura-finance
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Editar `.env.local`:

```env
# Base de datos Supabase
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Secret para JWT — generar con: openssl rand -base64 32
AUTH_SECRET="tu-secret-aqui"
AUTH_URL="http://localhost:3000"
```

### 3. Base de datos

```bash
npm run db:generate   # Genera el Prisma Client
npm run db:migrate    # Crea las tablas (primera vez)
npm run db:seed       # Carga categorías predeterminadas
```

### 4. Correr en local

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

---

## Configurar Supabase

1. Ir a [supabase.com](https://supabase.com) → Crear nuevo proyecto
2. En el panel: **Settings → Database → Connection String**
3. Copiar dos URLs:
   - **Session mode (puerto 6543)** → `DATABASE_URL` (con `?pgbouncer=true`)
   - **Direct connection (puerto 5432)** → `DIRECT_URL`
4. Ejecutar `npm run db:migrate` para crear las tablas

> **Por qué dos URLs?** Supabase usa PgBouncer (puerto 6543) para serverless. Prisma necesita la conexión directa (5432) solo para migraciones.

---

## Migraciones Prisma

```bash
npm run db:migrate    # Crea migración y aplica (desarrollo)
npm run db:push       # Push schema sin historial (prototipado rápido)
npm run db:studio     # Prisma Studio en browser
```

---

## Seed — Categorías predeterminadas

El seed crea 16 categorías de gasto y 7 de ingreso disponibles para todos los usuarios.

```bash
npm run db:seed
```

Categorías incluidas: Alimentación, Supermercado, Vivienda, Transporte, Salud, Entretenimiento, Ropa, Educación, Tecnología, Mascotas, y más.

---

## Estructura del proyecto

```
sakura-finance/
├── app/
│   ├── (auth)/               # Login y registro (sin sidebar)
│   ├── (dashboard)/          # Rutas protegidas (con sidebar)
│   │   ├── layout.tsx        # requireAuth + SidebarProvider
│   │   ├── dashboard/        # Dashboard principal
│   │   ├── transactions/     # Movimientos
│   │   ├── categories/       # Categorías
│   │   └── savings/          # Metas de ahorro
│   ├── api/auth/             # Auth.js v5 route handler
│   ├── globals.css           # Tema Sakura (Tailwind v4)
│   └── layout.tsx            # Root layout
├── actions/                  # Server Actions
├── components/               # Componentes React
│   ├── ui/                   # Primitivos (Button, Card, Input, Dialog...)
│   ├── layout/               # Sidebar, PageHeader, ThemeToggle
│   ├── dashboard/            # Charts, BalanceCard, StatsCards
│   ├── transactions/         # Forms, list, item, filters
│   ├── savings/              # GoalCard, GoalForm
│   └── categories/           # CategoryCard, CategoryForm
├── lib/                      # Utilidades (prisma, session, validations)
├── types/                    # TypeScript types
├── prisma/
│   ├── schema.prisma         # Modelo de datos
│   └── seed.ts               # Categorías por defecto
├── proxy.ts                  # Auth proxy (Next.js 16)
├── auth.ts                   # NextAuth config
└── .env.example
```

---

## Despliegue en Vercel

1. Push a GitHub

2. Importar en [vercel.com](https://vercel.com) → Import Project

3. **Environment Variables:**
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `AUTH_SECRET`
   - `AUTH_URL` (ej: `https://sakura-finance.vercel.app`)

4. Deploy

5. Después del primer deploy:
   ```bash
   npx prisma migrate deploy   # Aplica migraciones en producción
   npm run db:seed             # Carga categorías (una sola vez)
   ```

---

## Decisiones técnicas

### Auth.js v5 + Credentials + JWT
Credentials provider requiere `strategy: "jwt"`. Sin OAuth externo para simplificar el MVP. Las contraseñas se hashean con bcryptjs (12 rounds).

### proxy.ts en lugar de middleware.ts
Next.js 16 renombró `middleware.ts` → `proxy.ts`. El proxy hace un **optimistic check** verificando si existe la cookie JWT. La autorización real ocurre en `requireAuth()` dentro de cada Server Component.

### Server Actions para mutaciones
Forma canónica en App Router. Type-safe, sin Route Handlers intermedios, lógica junto al componente.

### Tailwind v4 — CSS config
La paleta y tokens están en `globals.css` (`@theme {}`). Sin `tailwind.config.ts`.

---

## Limitaciones actuales

- Sin Google/GitHub OAuth (fácil de agregar con Auth.js providers)
- Sin paginación en transacciones (a escala, agregar cursor-based)
- Sin notificaciones de presupuesto
- Sin export a CSV
- Sin multi-moneda (hardcoded ARS)
- Sin tests

## Mejoras futuras

- [ ] OAuth (Google/GitHub)
- [ ] Paginación
- [ ] Presupuestos por categoría con alertas
- [ ] Export CSV/Excel
- [ ] Multi-moneda
- [ ] Perfil de usuario
- [ ] Reportes anuales
- [ ] PWA / offline

---

*Hecho con 🌸 y mucho cariño.*
