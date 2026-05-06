# PSYConnect MVP v1.1

> **Matching primero. Continuidad después. Marketplace al inicio. Plataforma a medio plazo.**

PSYConnect es una plataforma de orientación y matching psicológico que ayuda a personas que quieren empezar terapia a encontrar un psicólogo adecuado de forma gratuita, y ayuda a los profesionales a recibir pacientes mejor filtrados.

PSYConnect **no vende leads brutos**: ofrece pacientes mejor orientados, filtrados y con mayor probabilidad de continuidad terapéutica.

---

## Stack técnico

| Capa | Herramienta |
|------|-------------|
| Framework | Next.js 14 + TypeScript + App Router |
| UI | Tailwind CSS |
| Base de datos | Postgres (Supabase, Neon o Vercel Postgres) |
| ORM | Prisma |
| Auth | NextAuth.js v5 (Credentials) |
| Deploy | Vercel |
| Repositorio | GitHub |
| Email | Resend (placeholder si no hay clave) |
| Analítica | PostHog + GA4 (placeholder) |

---

## Rutas públicas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing pública para pacientes |
| `/funnel` | Funnel de orientación (11 pasos) |
| `/gracias` | Confirmación tras completar el funnel |
| `/profesionales` | Landing para psicólogos |
| `/legal/privacidad` | Política de privacidad (placeholder) |
| `/legal/terminos` | Condiciones del servicio (placeholder) |
| `/legal/emergencia` | Recursos de emergencia y crisis |

## Rutas privadas (`/admin`)

| Ruta | Descripción |
|------|-------------|
| `/admin` | Dashboard con métricas |
| `/admin/pacientes` | Listado y filtro de pacientes |
| `/admin/pacientes/[id]` | Ficha de paciente + cambio de estado + matching |
| `/admin/psicologos` | Listado + formulario de creación |
| `/admin/psicologos/[id]` | Editar datos del psicólogo |
| `/admin/matchings` | Listado de matchings |
| `/admin/matchings/[id]` | Ficha de matching + actualizar estado + sesión |
| `/admin/sesiones` | Seguimiento de sesiones |
| `/admin/metricas` | Dashboard de métricas y eventos |

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/psyconnect-mvp.git
cd psyconnect-mvp
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:

- `DATABASE_URL` — cadena de conexión a tu base de datos Postgres
- `AUTH_SECRET` — secreto para NextAuth (`openssl rand -base64 32`)
- `ADMIN_EMAILS` — emails autorizados a entrar en `/admin`
- `ADMIN_PASSWORD` — contraseña del panel admin
- `RESEND_API_KEY` — clave de Resend (opcional, emails se loguean si no está)

### 4. Ejecutar migraciones

```bash
npx prisma migrate dev --name init
```

O si prefieres sin historial de migraciones (solo desarrollo):

```bash
npx prisma db push
```

### 5. Generar cliente de Prisma

```bash
npx prisma generate
```

### 6. Seedear datos de prueba (opcional)

```bash
npm run db:seed
```

Crea 3 psicólogos ficticios, 2 pacientes y 1 matching de prueba.

### 7. Arrancar en desarrollo

```bash
npm run dev
```

La app estará en [http://localhost:3000](http://localhost:3000).

---

## Cómo acceder a `/admin`

1. Ve a [http://localhost:3000/admin](http://localhost:3000/admin)
2. Introduce el email configurado en `ADMIN_EMAILS`
3. Introduce la contraseña configurada en `ADMIN_PASSWORD`

> ⚠️ Cambia `ADMIN_PASSWORD` antes de desplegar en producción.

---

## Deploy en Vercel

### Opción A: desde la CLI de Vercel

```bash
npm install -g vercel
vercel login
vercel
```

### Opción B: desde el dashboard de Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa el repositorio `psyconnect-mvp` de GitHub
3. En **Environment Variables**, añade todas las variables de `.env.example`
4. Despliega

### Configurar base de datos en Vercel

**Opción recomendada: Neon (Postgres serverless gratuito)**

1. Ve a [neon.tech](https://neon.tech) y crea un proyecto
2. Copia la cadena de conexión
3. Añade `DATABASE_URL` y `DIRECT_URL` en las variables de entorno de Vercel
4. Ejecuta las migraciones:

```bash
DATABASE_URL="tu-cadena-de-neon" npx prisma migrate deploy
```

**Alternativa: Supabase**

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. En Project Settings > Database, copia la cadena de conexión
3. Añade las variables en Vercel

**Alternativa: Vercel Postgres**

1. En el dashboard de Vercel, ve a Storage > Create Database
2. Las variables se configuran automáticamente

---

## Comandos útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Prisma
npm run db:generate    # Regenerar cliente
npm run db:push        # Aplicar schema sin migraciones (dev)
npm run db:migrate     # Crear y aplicar migración
npm run db:seed        # Seedear datos de prueba
npm run db:studio      # Abrir Prisma Studio (UI de base de datos)
```

---

## Modelo de datos

- **Patient** — pacientes con respuestas del funnel y estado operativo
- **Psychologist** — red de psicólogos con especialidades, disponibilidad y tarifa
- **Matching** — relación entre paciente y psicólogo con score y estado
- **Session** — seguimiento de primera y segunda sesión por matching
- **MetricEvent** — registro de eventos internos del producto
- **AdminUser** — usuarios del panel interno (placeholder)

---

## Qué NO incluye esta versión

- Marketplace público de psicólogos
- Login de pacientes
- Dashboard para psicólogos
- Pagos integrados ni wallet
- Videollamadas propias
- Agenda sincronizada
- App móvil
- IA clínica o diagnóstico automático
- Chat terapéutico

---

## Próximos pasos

Ver [TODO.md](./TODO.md) para el checklist completo antes del lanzamiento.

---

## Aviso legal

PSYConnect no es un servicio de urgencias. No realiza diagnósticos clínicos. No sustituye la atención psicológica profesional. Los textos legales de esta versión son **placeholders** y deben ser revisados por asesoría legal antes del lanzamiento público.
