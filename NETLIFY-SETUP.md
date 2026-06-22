# Conectar Netlify

## Manual rápido (si lo prefieres hacer tú)

1. Abre: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Conecta tu cuenta GitHub
4. Selecciona: `faustodewer/el-guardarropa`
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **"Deploy site"**
7. Espera 2-3 minutos

## Variables de entorno (después de crear el sitio)

1. Ve a **Settings** → **Build & deploy** → **Environment**
2. Click **"Edit variables"**
3. Agrega:
   ```
   VITE_SUPABASE_URL=https://vxxzncjicdwtnicgwcbq.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_4kdkGbZrf0rweRjn1LatUg_O-F06Rlc
   VITE_APP_ENV=production
   ```
4. Click **"Save"**

## Listo

Cada push a GitHub → auto-deploy a Netlify
