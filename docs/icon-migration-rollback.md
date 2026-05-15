# Icon Migration Rollback Reference

Migración realizada: emojis → Lucide React icons (2026-05-15)

## Categorías de Gasto

| Categoría | Emoji original | ID Lucide nuevo |
|---|---|---|
| Alimentación | 🍕 | `utensils` → `UtensilsCrossed` |
| Supermercado | 🛒 | `shopping-cart` → `ShoppingCart` |
| Vivienda / Alquiler | 🏠 | `home` → `Home` |
| Transporte | 🚌 | `bus` → `Bus` |
| Salud | 💊 | `pill` → `Pill` |
| Entretenimiento | 🎮 | `clapperboard` → `Clapperboard` |
| Ropa y belleza | 👗 | `shirt` → `Shirt` |
| Educación | 📚 | `book` → `BookOpen` |
| Tecnología | 📱 | `smartphone` → `Smartphone` |
| Mascotas | 🐾 | `paw` → `PawPrint` |
| Servicios (luz, gas, etc.) | 🔧 | `wrench` → `Wrench` |
| Suscripciones | 📺 | `monitor` → `Monitor` |
| Viajes | ✈️ | `plane` → `Plane` |
| Cafeterías / Restaurantes | ☕ | `coffee` → `Coffee` |
| Regalos | 🎁 | `gift` → `Gift` |
| Otros gastos | 🌸 | `tag` → `Tag` |

## Categorías de Ingreso

| Categoría | Emoji original | ID Lucide nuevo |
|---|---|---|
| Salario | 💼 | `briefcase` → `Briefcase` |
| Freelance | 💻 | `laptop` → `Laptop` |
| Inversiones | 📈 | `trending-up` → `TrendingUp` |
| Ventas | 🛍️ | `shopping-bag` → `ShoppingBag` |
| Bonos / Aguinaldo | 🎉 | `party-popper` → `PartyPopper` |
| Alquileres cobrados | 🏘️ | `building` → `Building2` |
| Otros ingresos | 💰 | `wallet` → `Wallet` |

## Metas de Ahorro

| Ícono | Emoji original | ID Lucide nuevo |
|---|---|---|
| Alcancía | 🐷 | `piggy-bank` → `PiggyBank` |
| Casa | 🏠 | `home` → `Home` |
| Auto | 🚗 | `car` → `Car` |
| Viaje | ✈️ | `plane` → `Plane` |
| Laptop | 💻 | `laptop` → `Laptop` |
| Joya | 💍 | `gem` → `Gem` |
| Bebé | 👶 | `baby` → `Baby` |
| Amor | 💕 | `heart` → `Heart` |
| Estrella | ⭐ | `star` → `Star` |
| Regalo | 🎁 | `gift` → `Gift` |

## Para hacer rollback

1. Revertir `lib/icons.ts` eliminando el `ICON_MAP` y los arrays.
2. Revertir `components/ui/empty-state.tsx`: cambiar `icon?: React.ReactNode` de vuelta a `icon?: string` y el div a `<div className="text-5xl animate-float select-none">{icon}</div>`.
3. Revertir `components/categories/category-card.tsx`: reemplazar el ICON_MAP lookup por `<span style={{ color: category.color }}>{category.icon}</span>`.
4. Revertir `components/savings/savings-goal-card.tsx`: restaurar el objeto `GOAL_ICONS` y `getGoalEmoji()`.
5. Revertir `components/categories/category-form.tsx`: restaurar el array `ICONS` de emojis y el input de texto libre.
6. Revertir `components/savings/savings-goal-form.tsx`: restaurar el array `ICONS` con emojis.
7. Revertir el seed (`prisma/seed.ts`) a los emojis originales y correr `npm run db:seed`.
8. Revertir todos los `EmptyState icon={<Icon />}` a `icon="emoji"` en pages y components.
