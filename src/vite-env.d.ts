/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_ENV: string
  readonly VITE_REPLICATE_API_KEY?: string
  readonly VITE_LEMON_SQUEEZY_API_KEY?: string
  readonly VITE_LEMON_STORE_ID?: string
  readonly VITE_LEMON_PRODUCT_VARIANT_ID?: string
  readonly VITE_LEMON_SQUEEZY_WEBHOOK_SECRET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
