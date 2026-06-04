# CAS AURUM Website

Production-oriented multilingual website for `casaurum.com`.

CAS AURUM is positioned as a luxury architectural interiors brand for custom wall panels, bespoke furniture, premium architectural millwork and custom interior elements across the United States, Canada and Mexico.

## Stack

- Zero-build Node.js HTTP server
- Data-driven multilingual routes
- Programmatic SEO generator for approved premium landing pages
- Server-rendered HTML
- Localized metadata, canonical URLs and hreflang
- JSON-LD schema
- Lead form API with encrypted local SQLite CRM storage and optional SMTP delivery through `nodemailer`
- Telegram lead bot for CRM creation, status buttons and follow-up reminders

## Run

```bash
npm install
npm run start
```

Smoke test:

```bash
npm run smoke
```

Production example:

```bash
NODE_ENV=production PORT=4888 NEXT_PUBLIC_SITE_URL=https://casaurum.com SITE_HOST=casaurum.com npm run start
```

## Environment

Copy `.env.example` and configure local secrets. Leads are written to an encrypted local SQLite database at `data/casaurum-crm.sqlite`. If the database write fails, submissions fall back to `leads/leads.ndjson`. SMTP email delivery is optional.

Important variables:

- `CONTACT_TO_EMAIL`
- `CRM_DB_PATH`
- `LEADS_ENCRYPTION_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `BOT_POLL_INTERVAL_MS`
- `BOT_REMINDER_AFTER_MINUTES`
- `BOT_ESCALATE_AFTER_HOURS`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_GTM_ID`
- `CAPTCHA_SECRET`

## Pages

English root and x-default:

- `/`
- `/luxury-wall-panels`
- `/custom-furniture`
- `/architectural-millwork`
- `/interior-design-solutions`
- `/collections`
- `/for-designers-builders`
- `/projects`
- `/about`
- `/contact`
- `/request-consultation`
- `/request-measurement`
- `/usa`
- `/canada`
- `/mexico`

Spanish, French and Russian versions live under `/es`, `/fr` and `/ru` with localized slugs.

## Programmatic SEO Generator

`server.mjs` includes a Fixly-style generator that creates SSR landing pages from structured data:

- vertical
- service
- intent
- object type
- material
- country/state/province/metro/city/neighborhood
- language
- slug
- canonical URL
- hreflang alternates
- title/meta/H1/body/FAQ/CTA
- image and video metadata
- schema data
- lead form type
- quality score
- indexing status

Indexing statuses:

- `draft`
- `needs_review`
- `noindex`
- `indexable`
- `approved`

Only generated pages with `indexingStatus: "approved"`, a passing quality score and no quality-gate issues are included in `/sitemap.xml`. Generated pages that are useful for review but not approved render as `noindex,follow`.

Internal SEO QA:

- `/seo-index`
- shows generated page count, indexable count, review/noindex count, score and quality issues
- renders `noindex,nofollow` and is not included in the sitemap

The generator now produces a broad premium SEO matrix across core verticals, Georgia, Atlanta, Georgia suburbs, major US luxury markets, Canada and Mexico. Approved launch routes include:

- `/kitchens`
- `/luxury-interiors`
- `/custom-wall-panels`
- `/custom-kitchen-cabinets`
- `/kitchen-remodeling-coordination`
- `/kitchen-cabinet-refacing`
- `/cabinet-refinishing`
- `/cabinet-restoration`
- `/custom-closets`
- `/built-in-furniture`
- `/custom-vanities`
- `/hospitality-interiors`
- `/restaurant-interiors`
- `/office-interiors`
- `/developer-interior-packages`
- `/georgia/luxury-custom-kitchens`
- `/georgia/custom-kitchen-cabinets`
- `/georgia/luxury-wall-panels`
- `/georgia/custom-furniture`
- `/georgia/architectural-millwork`
- `/georgia/custom-closets`
- `/georgia/kitchen-cabinet-refacing`
- `/georgia/cabinet-refinishing`
- `/georgia/cabinet-restoration`
- `/georgia/hospitality-interiors`
- `/georgia/restaurant-interiors`
- `/georgia/atlanta/custom-kitchen-cabinets`
- `/georgia/atlanta/luxury-custom-kitchens`
- `/georgia/atlanta/kitchen-cabinet-refacing`
- `/georgia/atlanta/cabinet-refinishing`
- `/georgia/atlanta/cabinet-restoration`
- `/georgia/atlanta/luxury-wall-panels`
- `/georgia/atlanta/custom-wall-panels`
- `/georgia/atlanta/custom-closets`
- `/georgia/atlanta/architectural-millwork`
- `/miami/luxury-custom-kitchens`
- `/miami/luxury-wall-panels`
- `/new-york/luxury-custom-furniture`
- `/los-angeles/architectural-millwork`
- `/dallas/custom-kitchen-cabinets`
- `/austin/kitchen-remodeling-coordination`

Needs-review examples such as `/georgia/atlanta/buckhead/custom-closets`, `/chicago/luxury-custom-furniture` and `/canada/toronto/luxury-custom-kitchens` are available for QA but intentionally excluded from the sitemap until approved.

## Forms

Forms submit to:

```text
POST /api/lead
```

The backend validates required fields, checks a honeypot, applies simple IP rate limiting, captures source URL, UTM parameters, referrer, user agent and timestamp, then writes the lead to the local encrypted CRM database. Sensitive payloads are encrypted with `LEADS_ENCRYPTION_KEY`; email/phone matching uses hashes. The database file is kept on the server with restrictive permissions.

Local CRM database:

```text
/var/www/casaurum.com/data/casaurum-crm.sqlite
```

Telegram bot flow:

- read local leads where `status = 'new'`
- send contact/project details to Telegram
- update the lead to `status = 'notified'`
- create/update encrypted CRM contacts, deals, activities and notifications

## Telegram CRM Bot

The bot lives in [bot.mjs](/var/www/casaurum.com/bot.mjs).

It does four jobs:

- polls the local encrypted SQLite CRM database for new leads
- sends Telegram lead cards with inline buttons
- creates/updates CRM tables from a lead
- reminds you if a client has not been contacted

The CRM schema is created automatically by [crm-db.mjs](/var/www/casaurum.com/crm-db.mjs) on first run. The Supabase SQL files are now historical/reference artifacts only.

Telegram buttons:

- `Связался`: marks lead/deal as contacted and closes the notification
- `Напомнить`: creates a follow-up activity
- `Создать CRM`: creates or updates `contacts`, `deals` and `activities`
- `Заметка`: lets you reply with a note that is saved into `activities`
- `Не подходит`: marks lead/deal as not fit

Run locally:

```bash
TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... LEADS_ENCRYPTION_KEY=... npm run bot
```

Run with PM2 after env values are filled in `ecosystem.config.cjs`:

```bash
pm2 start ecosystem.config.cjs --only casaurum-lead-bot --update-env
```

To get `TELEGRAM_CHAT_ID`, message the bot once, then run:

```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getUpdates"
```

Use the `message.chat.id` value.

Programmatic forms also include hidden routing metadata:

- `pageId`
- `vertical`
- `service`
- `intent`
- `objectType`
- `material`
- `country`
- `state`
- `province`
- `metro`
- `city`
- `neighborhood`
- `zipCode`
- `leadType`
- `utmSource`
- `utmMedium`
- `utmCampaign`
- `utmTerm`
- `utmContent`

## SEO

Implemented:

- Unique titles and descriptions per language/page family
- Canonical URLs
- hreflang for `en`, `es`, `fr`, `ru` and `x-default`
- `/sitemap.xml`
- `/robots.txt`
- Organization, ProfessionalService, WebSite, WebPage, Service, BreadcrumbList, FAQPage, ImageObject and VideoObject JSON-LD
- Semantic HTML and accessible forms
- Soft browser-language detection on first visit only, skipped for known crawlers
- Generated page quality gate and sitemap approval gate

## Media

Current visual assets use curated remote editorial interior photography as placeholders. Replace them with original CAS AURUM photography, licensed imagery or generated concept visuals before final brand launch. Do not present generated concept visuals as completed projects.
