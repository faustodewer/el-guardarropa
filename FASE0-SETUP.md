# FASE 0: Setup Instructions

## ✅ Lo que está listo

- [x] Proyecto React 18 + Vite inicializado
- [x] Variables de entorno configuradas (.env.local)
- [x] Componente GDPR banner
- [x] Páginas Privacy + Terms
- [x] Estructura de carpetas
- [x] Netlify config

## 📋 Qué falta: Supabase Database

### Paso 1: Ir a Supabase Dashboard

1. Abre: https://app.supabase.com
2. Login con tu cuenta
3. Selecciona el proyecto

### Paso 2: Ejecutar SQL Script

En Supabase:
1. Ve a **SQL Editor** (lado izquierdo)
2. Click en **"New Query"**
3. Copia TODO el contenido de: `supabase-schema.sql`
4. Pega en el editor
5. Click **"Run"** (botón verde)
6. Espera a que termine (sin errores ✅)

### Paso 3: Crear Storage Bucket

En Supabase:
1. Ve a **Storage** (lado izquierdo)
2. Click **"Create new bucket"**
3. Nombre: `garments`
4. Marca **"Public bucket"**
5. Click **"Create bucket"**

## ✅ Verificación Local

```bash
cd "C:\Users\faust\Desktop\Proyecto app ropa"
npm run dev
```

Debe abrir http://localhost:3000 y ver:
- Página blanca con "El Guardarropa" en el centro
- Banner GDPR en la parte inferior
- Links "Privacidad" y "Términos" funcionando

## 🚀 Siguientes pasos FASE 0

- [ ] Setup Posthog analytics
- [ ] Deploy a Netlify
- [ ] Testing: verificar carga <2s

## 📞 Si hay errores

Si ves errores en la consola del navegador:
1. Abre DevTools (F12)
2. Ve a **Console**
3. Lee el error
4. Contacta con más detalles

## 💾 Database Schema Created

Tablas creadas:
- `wardrobes` — Colecciones de prendas
- `garments` — Prendas individuales
- `outfits` — Combinaciones
- `user_settings` — Preferencias de usuario

Con RLS policies para seguridad.
