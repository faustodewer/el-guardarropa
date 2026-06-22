# FASE 2: Monetización - Guía de Setup

## ✅ Completado (Código)

- ✓ Integración API Lemon Squeezy (`src/lib/lemonSqueezy.ts`)
- ✓ Modal de precios (`src/components/PricingModal.tsx`)
- ✓ Página de precios (`src/pages/Pricing.tsx`)
- ✓ Sistema de suscripciones (`src/lib/subscriptions.ts`)
- ✓ Freemium logic (25 prendas límite en Dashboard)
- ✓ Base de datos schema (`supabase-schema-fase2.sql`)

## 🔧 Pasos de Configuración Manual

### 1. Crear Cuenta en Lemon Squeezy

1. Ve a https://www.lemonsqueezy.com/
2. Regístrate con tu email
3. Verifica el email
4. Completa el setup inicial

### 2. Crear Store y Producto

1. En el dashboard de Lemon Squeezy:
   - Ve a "Products"
   - Click en "New Product"
   - Nombre: "El Guardarropa Premium"
   - Descripción: "Acceso ilimitado a prendas, combinaciones y más"
   - Precio: €4.99 (mensual)
   - Guarda el producto

2. Nota el **Product ID** (ej: 12345)

3. Ve a "Variants" y crea una variante:
   - Nombre: "Monthly Subscription"
   - Guarda y nota el **Variant ID** (ej: 67890)

4. Ve a "Settings" > "Stores"
   - Nota tu **Store ID** (ej: 11111)

### 3. Obtener API Key

1. Ve a Settings > API Tokens
2. Click "Create API Token"
3. Dale un nombre: "El Guardarropa"
4. Copia el token (es la única vez que verás el full token)

### 4. Configurar Webhook

1. Ve a Settings > Webhooks
2. Click "New Webhook"
3. URL: `https://tu-dominio.netlify.app/.netlify/functions/lemon-webhook`
4. Eventos: Selecciona todos los eventos de órdenes
5. Copia el "Webhook Secret"

### 5. Variables de Entorno

Agrega a `.env.local`:

```
VITE_LEMON_SQUEEZY_API_KEY=sk_live_xxxxxxxxxxxxx
VITE_LEMON_STORE_ID=11111
VITE_LEMON_PRODUCT_VARIANT_ID=67890
VITE_LEMON_SQUEEZY_WEBHOOK_SECRET=whsk_xxxxxxxxxxxxx
```

Agrega a Netlify (via CLI o Dashboard):

```bash
netlify env:set VITE_LEMON_SQUEEZY_API_KEY "sk_live_..."
netlify env:set VITE_LEMON_STORE_ID "11111"
netlify env:set VITE_LEMON_PRODUCT_VARIANT_ID "67890"
netlify env:set VITE_LEMON_SQUEEZY_WEBHOOK_SECRET "whsk_..."
```

### 6. Setup de Base de Datos

1. Abre Supabase Dashboard
2. SQL Editor > New Query
3. Copia y pega el contenido de `supabase-schema-fase2.sql`
4. Ejecuta la query
5. Verifica que las tablas `subscriptions` y `payment_webhooks` fueron creadas

### 7. Crear Función Serverless (Netlify)

Crea el archivo `netlify/functions/lemon-webhook.ts`:

```typescript
import { verifyWebhookSignature } from '../../src/lib/lemonSqueezy'
import { createOrUpdateSubscription } from '../../src/lib/subscriptions'

export default async (req, context) => {
  if (req.method !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  const body = await req.text()
  const signature = req.headers.get('x-signature') || ''

  const isValid = await verifyWebhookSignature(body, signature)
  if (!isValid) {
    return { statusCode: 401, body: 'Invalid signature' }
  }

  const payload = JSON.parse(body)
  const event = payload.meta?.event_name

  if (event === 'order_created' || event === 'order_refunded') {
    const order = payload.data
    const userId = order.custom?.user_id
    const orderId = order.id

    if (userId) {
      const isPaid = order.status === 'paid'
      await createOrUpdateSubscription(
        userId,
        'premium',
        isPaid ? 'active' : 'cancelled',
        orderId
      )
    }
  }

  return { statusCode: 200, body: 'Webhook processed' }
}
```

## 🧪 Testing

### Test sin API Key configurada:
1. Abre la app en http://localhost:3000
2. Inicia sesión
3. Agrega 25 prendas
4. Intenta agregar la 26ª → Verás el modal de precios
5. Click "Actualizar a Premium" → Mostrará error (API key no configurada)

### Test con API Key:
1. Una vez configuradas las variables
2. Click en "Actualizar a Premium" → Te redirige a Lemon Squeezy
3. Completa el pago (usar tarjeta de test de Lemon Squeezy)
4. Webhook actualiza la suscripción en Supabase
5. Usuario accede a prendas ilimitadas

## 📋 Checklist Final

- [ ] Cuenta Lemon Squeezy creada
- [ ] Producto y variante creados
- [ ] API Key obtenida
- [ ] Webhook configurado
- [ ] Variables de entorno en .env.local
- [ ] Variables en Netlify
- [ ] Schema SQL ejecutado en Supabase
- [ ] Función serverless creada (próximo paso)
- [ ] App compilada y pusheada a GitHub
- [ ] Deployment en Netlify completado
- [ ] Test de pago realizado

## 🚀 Próximos Pasos

1. ~~Crear función serverless para webhooks~~
2. Implementar actualización de límite de prendas basado en suscripción
3. Crear panel de suscripción del usuario
4. Implementar cancelación de suscripción
5. Agregar manejo de fallos de pago

---

**Nota**: Los precios y detalles pueden ajustarse en Lemon Squeezy sin tocar código.
