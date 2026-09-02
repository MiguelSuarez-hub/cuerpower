# CuerPower

Aplicación web para hacer seguimiento personal de peso, IMC (BMI) y porcentaje de grasa corporal a lo largo del tiempo.

## Fase 1 (MVP)

- Registro e inicio de sesión de usuarios
- Perfil de usuario (edad, altura)
- Registro manual de mediciones (peso, %grasa corporal y fecha) con cálculo automático de IMC
- Dashboard con gráficos de progreso en el tiempo

## Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Estilos:** Tailwind CSS
- **Autenticación:** Auth.js (NextAuth) con proveedor de credenciales
- **Base de datos:** PostgreSQL (Neon en producción, Docker local en desarrollo)
- **ORM:** Prisma
- **Validación:** Zod + react-hook-form
- **Gráficos:** Recharts
- **Hosting:** Vercel
- **Monitoreo:** Sentry

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                 | Descripción                           |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Servidor de desarrollo                |
| `npm run build`        | Build de producción                   |
| `npm run start`        | Servidor de producción                |
| `npm run lint`         | Linter (ESLint)                       |
| `npm run format`       | Formatea el código con Prettier       |
| `npm run format:check` | Verifica formato sin escribir cambios |

## Estructura del proyecto

```
src/
├── app/            # Rutas (App Router)
├── components/     # Componentes de UI
├── lib/            # Configuración (auth, db, validaciones)
└── server/         # Server Actions / mutaciones
prisma/
├── schema.prisma
└── migrations/
```
