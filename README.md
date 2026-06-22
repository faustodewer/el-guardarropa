# El Guardarropa 👗

**Old Money Wardrobe App** — MVP → SaaS en 6 semanas.

## 🚀 Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (Auth, DB, Storage, Realtime)
- **IA**: Replicate (remove.bg) + Claude Vision API
- **Payments**: Lemon Squeezy
- **Analytics**: Posthog
- **Mobile**: Capacitor (React → iOS/Android)
- **Hosting**: Netlify + Supabase Storage CDN

## 📁 Estructura

```
src/
├── components/        # Componentes reutilizables
├── pages/            # Vistas principales
├── lib/
│   └── supabase.ts   # Cliente Supabase
├── App.tsx           # Componente raíz
├── main.tsx          # Entry point
├── index.css         # Estilos globales
└── App.css           # Estilos App
```

## 🔧 Configuración Local

### 1. Variables de entorno

```bash
cp .env.local.example .env.local
```

Completa con tus credenciales:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar dev

```bash
npm run dev
```

Abre http://localhost:3000

## 🏗️ Fases (6 semanas)

- **FASE 0**: Supabase Storage + GDPR + Analytics
- **FASE 1**: IA Entry (foto → prendas automáticas)
- **FASE 2**: Monetización (freemium + Lemon Squeezy)
- **FASE 3**: Hábito (notificaciones + rachas + calendario)
- **FASE 4**: Distribución (PWA + iOS/Android)
- **FASE 5**: Growth (SEO + ASO + referrals)

## 📦 Build & Deploy

```bash
npm run build      # Genera dist/
npm run preview    # Prueba el build localmente
```

Conecta a Netlify:
1. Push a GitHub
2. Conecta repo en Netlify
3. Variables de entorno en Netlify → Settings → Build & deploy
4. Deploy automático en cada push

## 📝 Legal

- [ ] Privacy Policy (footer)
- [ ] Terms of Service (footer)
- [ ] GDPR consent banner
- [ ] Data retention policy

## 🔐 Seguridad

- ✅ Never hardcode secrets
- ✅ Use `.env.local` (gitignored)
- ✅ Add env vars to Netlify dashboard
- ✅ Supabase RLS policies for data access

## 📞 Support

Email: faustojavierpuentesperezl@gmail.com
