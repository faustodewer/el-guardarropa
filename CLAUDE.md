# Claude Code Instructions for El Guardarropa

## Project Overview

**El Guardarropa** es una PWA de moda estilo "Old Money". MVP → SaaS en 6 semanas.

- **User**: Fausto (founder, no dev expert)
- **Goal**: Implementar FASE 0 → FASE 5 secuencialmente
- **Approach**: Work continuously until subscription limit is reached
- **Constraints**: Fase a fase, poco a poco

## Tech Stack

- React 18 + TypeScript + Vite
- Supabase (Auth, DB, Storage)
- Replicate API (IA image processing)
- Lemon Squeezy (payments)
- Netlify (hosting)

## How to Work With This Project

### Development

1. **Start dev server**: `npm run dev` (opens http://localhost:3000)
2. **Install packages**: `npm install <package>`
3. **Build**: `npm run build`
4. **Test**: Create .test.ts files and run tests

### Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Full page views
- `/src/lib` - Utility functions, API clients
- `.env.local` - Local environment variables (NEVER commit)
- `netlify.toml` - Netlify configuration

### Environment Variables

Always use `import.meta.env.VITE_*` for client-side vars:

```tsx
const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

### Supabase Integration

All database operations should go through `/src/lib/supabase.ts`:

```tsx
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase
  .from('table_name')
  .select('*')
```

### Netlify Deployment

- **Auto-deploy**: Push to GitHub → automatic build & deploy
- **Environment vars**: Add in Netlify dashboard (Build & deploy > Environment)
- **Preview deploys**: Automatic for pull requests
- **Redirects**: Configured in `netlify.toml`

### Phases (Sequential)

#### FASE 0: Foundations (Week 1)
- Migrate photos to Supabase Storage
- Add GDPR policy + terms footer
- Setup Posthog analytics
- Optimize DB indexes

#### FASE 1: IA Entry (Weeks 2-3)
- Integrate Replicate API
- Photo upload → auto-tag preview
- Multi-piece detection
- Manual fallback form

#### FASE 2: Monetization (Weeks 3-4)
- Freemium logic (25 free items)
- Lemon Squeezy integration
- Pricing page
- Upsell modal at limit

#### FASE 3: Habit (Weeks 4-5)
- Push notifications (08:00 AM daily)
- Visual calendar (outfit history)
- Streaks counter + badges
- Share looks (social links)

#### FASE 4: Distribution (Weeks 5-6)
- PWA optimization (Lighthouse >90)
- Capacitor setup (iOS + Android)
- App Store Connect submission
- Google Play submission

#### FASE 5: Growth (Week 6+)
- SEO (metatags, schema markup, blog)
- ASO (A/B screenshots, keywords)
- Content strategy (TikTok/Instagram)
- Referral program
- Analytics (LTV, CAC, retention)

## Rules & Preferences

- **No hardcoded secrets** — Use .env.local
- **TypeScript strict** — All files must be .ts or .tsx
- **Mobile-first** — Design for mobile, adapt to desktop
- **Accessibility** — WCAG 2.1 AA minimum
- **No external dependencies without approval** — Keep bundle small
- **Comments only for WHY** — Not for WHAT
- **Test critical flows** — Auth, payments, uploads

## Git Workflow

1. Work directly (no branches for small tasks)
2. Commit frequently with clear messages
3. Deploy to Netlify via GitHub push
4. Test in production-like environment

## Success Metrics

### FASE 0
- ✅ 100% images in Supabase Storage
- ✅ GDPR policy visible + terms
- ✅ Posthog tracking events firing
- ✅ Load time <2s

### FASE 1
- ✅ Photo upload → auto-tags in <5s
- ✅ 90%+ categorization accuracy
- ✅ <30 min to populate full wardrobe
- ✅ >70% completion rate

### FASE 2
- ✅ Freemium logic enforced
- ✅ Payment flow working (test €1)
- ✅ Upsell modal at limit
- ✅ Webhook delivery >99%

### FASE 3
- ✅ Notifications sent daily
- ✅ >40% notification open rate
- ✅ >50% of users complete streaks
- ✅ DAU +30%

### FASE 4
- ✅ Lighthouse score >90
- ✅ iOS/Android builds without errors
- ✅ <1 week app store review
- ✅ >4 star rating

### FASE 5
- ✅ 100+ beta testers
- ✅ D7 retention >50%
- ✅ NPS >40
- ✅ SEO/ASO live

## Troubleshooting

**Issue: Supabase connection fails**
- Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
- Ensure Supabase project is active
- Check browser console for CORS errors

**Issue: Build fails**
- Run `npm install` to ensure all deps are installed
- Check TypeScript errors: `npm run build`
- Clear node_modules and reinstall if needed

**Issue: Netlify deploy fails**
- Check build logs in Netlify dashboard
- Ensure environment variables are set
- Verify netlify.toml is correct

## Questions?

Ask Claude Code for:
- Architecture decisions
- Implementation patterns
- Component structure
- Performance optimizations
- Security best practices
