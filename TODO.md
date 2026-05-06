# PSYConnect MVP v1.1 — TODO

> Lista de tareas pendientes antes del piloto público y después de él.

---

## 🔴 Antes del piloto público (obligatorio)

### Legal y privacidad
- [ ] Revisar y aprobar textos de Política de Privacidad (`/legal/privacidad`)
- [ ] Revisar y aprobar Condiciones del Servicio (`/legal/terminos`)
- [ ] Validar el protocolo de crisis con asesoría especializada
- [ ] Confirmar cumplimiento con RGPD y LOPDGDD
- [ ] Revisar el tratamiento de datos sensibles (motivo de consulta)
- [ ] Definir política de retención y borrado de datos
- [ ] Adaptar recursos de emergencia por país si se expande internacionalmente

### Seguridad
- [ ] Cambiar `ADMIN_PASSWORD` por una contraseña segura antes de producción
- [ ] Rotar `AUTH_SECRET` con `openssl rand -base64 32`
- [ ] Revisar headers de seguridad (CSP, HSTS, X-Frame-Options)
- [ ] Limitar intentos de login en `/admin/login`
- [ ] Revisar rate limiting en API routes (especialmente `/api/patients`)
- [ ] Asegurar que `DATABASE_URL` no esté en logs de Vercel

### Producto
- [ ] Revisar todos los textos del funnel con una persona ajena al proyecto
- [ ] Probar el funnel completo end-to-end en móvil
- [ ] Probar escenario de crisis: verificar que no crea paciente estándar
- [ ] Probar escenario de menor de edad: verificar flujo correcto
- [ ] Probar el panel `/admin` con datos reales
- [ ] Verificar que "match perfecto", "cura garantizada" y "diagnóstico" no aparecen en ningún texto
- [ ] Página `/gracias` probada con email real

### Infraestructura
- [ ] Configurar dominio propio (DNS, SSL)
- [ ] Configurar base de datos en producción con backups
- [ ] Configurar email real con Resend + dominio verificado
- [ ] Configurar variables de entorno en Vercel
- [ ] Ejecutar migraciones en base de datos de producción
- [ ] Activar PostHog o GA4 con claves reales

### Supply (red de psicólogos)
- [ ] Validar perfil de cada psicólogo inicial
- [ ] Confirmar disponibilidad real para el piloto
- [ ] Acordar condición de cobro por primera sesión realizada
- [ ] Briefing a los psicólogos sobre el proceso PSYConnect

### Calidad
- [ ] Revisar emails de confirmación con cuenta de prueba
- [ ] Definir plantilla de seguimiento a los 3 días
- [ ] Definir plantilla de seguimiento de segunda sesión (10–20 días)
- [ ] Definir proceso de feedback breve para paciente y psicólogo

---

## 🟡 Después del piloto (backlog v2)

### Matching
- [ ] Mejorar el scoring con datos reales del piloto
- [ ] Añadir sugerencias automáticas de candidatos (semi-automático)
- [ ] Soporte para rematch: nuevo funnel express
- [ ] Hard filter por idioma funcional en el panel

### Comunicaciones
- [ ] Automatizar email de confirmación al paciente (ya hay estructura)
- [ ] Automatizar notificación interna al equipo
- [ ] Automatizar seguimiento a los 3 días si no hay respuesta
- [ ] Automatizar recordatorio de segunda sesión

### Panel interno
- [ ] Filtros avanzados en listado de pacientes
- [ ] Búsqueda por nombre/email funcional
- [ ] Exportar datos a CSV
- [ ] Log de cambios de estado por paciente
- [ ] Asignación de casos a miembros del equipo

### Dashboard y métricas
- [ ] Gráficos de embudo temporales
- [ ] Comparativa semanal
- [ ] No-match rate por motivo (presupuesto, ubicación, especialidad)
- [ ] Tiempo medio de respuesta (funnel → recomendación)

### Psicólogos
- [ ] Panel básico para que el psicólogo confirme disponibilidad
- [ ] Historial de derivaciones por psicólogo
- [ ] Sistema de valoración de calidad de matching

### Monetización
- [ ] Registro de cobros al psicólogo
- [ ] Sistema de créditos interno (sin checkout)
- [ ] Checkout real con Stripe (v2+)

### Técnico
- [ ] Tests end-to-end con Playwright
- [ ] Tests unitarios del motor de matching
- [ ] Configurar Sentry para errores en producción
- [ ] Configurar alertas de downtime
- [ ] Revisar performance de queries Prisma con muchos datos

---

## ✅ Lo que ya está listo en v1.1

- [x] Landing pública con hero, cómo funciona, confianza, FAQ y CTA
- [x] Funnel de orientación (12 pantallas con crisis y menor de edad)
- [x] Creación de paciente en base de datos al completar con consentimiento
- [x] Protocolo de crisis y menor de edad
- [x] Página /gracias con qué pasa ahora
- [x] Landing para psicólogos (/profesionales)
- [x] Páginas legales placeholder
- [x] Página de emergencia con recursos de crisis
- [x] Panel /admin protegido con autenticación
- [x] Dashboard interno con KPIs y pacientes recientes
- [x] Listado de pacientes con filtros por estado
- [x] Ficha de paciente con respuestas del funnel
- [x] Cambio de estado y notas internas
- [x] Creación manual de matchings desde la ficha del paciente
- [x] Listado y creación de psicólogos
- [x] Ficha y edición de psicólogo
- [x] Listado y detalle de matchings
- [x] Gestión de sesiones (primera y segunda sesión)
- [x] Dashboard de métricas con continuity rate
- [x] Registro de eventos internos (MetricEvent)
- [x] Motor de matching con hard filters y scoring de 100 puntos
- [x] Estructura de emails con Resend (placeholder si no hay clave)
- [x] Analytics placeholder (PostHog/GA4)
- [x] Schema Prisma completo
- [x] Seed con datos de prueba
- [x] .env.example documentado
- [x] README completo
- [x] .gitignore correcto
