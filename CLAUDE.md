# Sakura Finance — CLAUDE.md

## Stack principal
- Next.js 16 (App Router) · TypeScript · Tailwind CSS v4
- Prisma v7 + PostgreSQL (Supabase)
- Auth.js v5 (next-auth@beta) con Credentials + PrismaAdapter
- React Hook Form + Zod · Recharts · Lucide React

## Comandos importantes
```bash
npm run dev          # Dev server en :3000
npm run build        # Build de producción
npm run typecheck    # Verifica tipos sin compilar
npm run lint         # ESLint
npm run db:generate  # Genera Prisma client
npm run db:migrate   # Crea y aplica migración
npm run db:push      # Push schema sin migración (dev rápido)
npm run db:seed      # Categorías predeterminadas
npm run db:studio    # Prisma Studio en browser
```

## Variables de entorno requeridas
Copiar `.env.example` a `.env.local` y completar:
- `DATABASE_URL` — Supabase pooler URL (puerto 6543)
- `DIRECT_URL` — Supabase direct URL (puerto 5432)
- `AUTH_SECRET` — openssl rand -base64 32

## Arquitectura
```
app/
  (auth)/          → Login, register (sin sidebar)
  (dashboard)/     → Todas las rutas protegidas con sidebar
    layout.tsx     → requireAuth() + SidebarProvider
    dashboard/     → Dashboard principal
    transactions/  → CRUD movimientos
    categories/    → Gestión categorías
    savings/       → Metas de ahorro
  api/auth/        → Auth.js v5 handlers
actions/           → Server Actions (auth, transactions, categories, savings)
components/
  ui/              → Botones, cards, inputs, dialogs, badges, etc.
  layout/          → Sidebar, SidebarProvider, PageHeader, ThemeToggle
  dashboard/       → BalanceCard, StatsCards, charts, RecentTransactions
  transactions/    → TransactionForm, TransactionItem, TransactionList, Filters
  savings/         → SavingsGoalCard, SavingsGoalForm
  categories/      → CategoryCard, CategoryForm
lib/               → prisma.ts, session.ts, utils.ts, validations.ts
types/             → TypeScript types compartidos
prisma/            → schema.prisma, seed.ts
proxy.ts           → Auth optimistic check (Next.js 16 = proxy.ts, NOT middleware.ts)
```

## Reglas de arquitectura
1. **Server Actions** para todas las mutaciones (no Route Handlers de mutación).
2. **Server Components** por defecto. Solo `"use client"` cuando hay interactividad.
3. **requireAuth()** en server components protegidos — nunca asumir que proxy basta.
4. **Prisma** solo desde Server Actions y Server Components. Nunca desde cliente.
5. El `(dashboard)/layout.tsx` llama a `requireAuth()` — es la frontera de auth.

## Convenciones de nombres
- Archivos: `kebab-case.tsx`
- Componentes: `PascalCase`
- Server Actions: `camelCase` exportadas desde `actions/*.ts`
- Tipos: `PascalCase` en `types/index.ts`
- Variables CSS: `--text`, `--surface`, `--primary` (ver `globals.css`)

## Cómo validar cambios
```bash
npm run typecheck   # Primero tipos
npm run lint        # Luego ESLint
npm run build       # Si va a producción
```

## REGLA VISUAL — NO ROMPER
El diseño es **kawaii / sakura / cute**. Cualquier cambio de UI debe:
- Mantener la paleta rosada pastel (sakura-* y petal-*).
- Usar bordes redondeados (rounded-xl, rounded-2xl, rounded-full).
- Respetar las variables CSS de `globals.css` (`--text`, `--surface`, `--border`, etc.).
- Funcionar en modo claro y oscuro.
- Ser mobile-first.
- NO introducir colores agresivos, bordes angulares, ni estilos corporativos genéricos.

## Gotchas conocidos (Next.js 16 + Prisma v7)
- Middleware → `proxy.ts` (NOT `middleware.ts`)
- Auth.js v5: `session({ session, token }) { session.user.id = token.sub }`
- Prisma v7: NI `url` NI `directUrl` van en `schema.prisma` — ambos están prohibidos
- Prisma v7 runtime: PrismaClient necesita un driver adapter → usamos `PrismaNeon` de `@prisma/adapter-neon`
  ```ts
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
  new PrismaClient({ adapter })
  ```
- Prisma v7 CLI: `env()` de `prisma/config` no carga `.env` automáticamente → `prisma.config.ts` usa `dotenv` manualmente
- Zod v4: `.issues[0]` no `.errors[0]`
- `searchParams` en pages es `Promise<{...}>` — hacer `await searchParams`
- Tailwind v4: config en CSS (`@theme {}` en globals.css), no `tailwind.config.ts`
