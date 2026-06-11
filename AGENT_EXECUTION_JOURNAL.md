# Agent Execution Journal

This file is the working handoff log for AI agents between commits and between chats. Update it whenever work is started, paused, completed, or verified.

## How To Use

- Read this file before making changes.
- Add a new checkpoint near the top when you start or finish meaningful work.
- Keep entries short, factual, and tied to files, routes, commands, and commit hashes.
- Mark each initiative as `Planned`, `In Progress`, `Done`, or `Blocked`.
- Do not store secrets, passwords, API keys, client private data, or full lead payloads here.
- If a chat is interrupted, the next agent should be able to answer: what was intended, what changed, what was tested, and what remains.

## Current State

Last verified commit: `14511c4` (`Add agent execution journal`)

Production processes:

- `casaurum-web` runs the site on port `4888` via PM2.
- `casaurum-lead-bot` runs Telegram notifications via PM2.

Main verification command:

```bash
npm run smoke
```

## Active Initiatives

### Partner Program And Partner CRM

Status: `Done / Needs next UX phase`

Implemented:

- Public partner application page in 4 languages:
  - `/partners`
  - `/es/programa-partners`
  - `/fr/programme-partenaires`
  - `/ru/partnerskaya-programma`
- Header partner login link in 4 languages:
  - EN: `Partner Login`
  - ES: `Acceso Partners`
  - FR: `Acces Partenaire`
  - RU: `Вход партнера`
- Partner application API: `POST /api/partner-application`.
- Partner applications are saved as `prospect` partners in SQLite.
- New partner applications trigger Telegram notification from the web process and can also be picked up by the bot scanner.
- CRM mini app has `Partners` tab with prospect/active/rejected visibility, approval/rejection, partner cards, and partner portal link.
- Lead cards can link an active partner to a lead/deal.

Important files:

- `server.mjs`
- `crm-db.mjs`
- `bot.mjs`
- `scripts/smoke.mjs`

Verified:

- `npm run smoke`
- Production HTML checked for partner routes and header login.
- End-to-end partner application notification was tested; temporary test records were deleted.

Remaining:

- Build distinct partner/designer/builder portal UI after login. Current `/crm-app` login supports roles, but non-admin role-specific dashboards are not yet separated.
- Decide whether header partner login should go to `/crm-app` permanently or to a branded `/partner-login` alias that redirects/loads the same auth.

### Web CRM Login And Admin Access

Status: `Done / Needs role-based UI split`

Implemented:

- `/crm-app` now supports browser login with username/password and HttpOnly session cookie.
- Telegram Mini App auth remains supported via Telegram `initData`.
- Web users and sessions are stored in SQLite:
  - `web_users`
  - `web_sessions`
- First owner is loaded from `CRM_ADMIN_USER` / `CRM_ADMIN_PASS`; fallback is `SEO_DASHBOARD_USER` / `SEO_DASHBOARD_PASS`.
- CRM `Access` tab can create web users with roles:
  - `owner`
  - `admin`
  - `designer`
  - `builder`
  - `partner`
- Hidden admin entrance on Privacy Policy is in the Contact paragraph: `contact CAS AURUM`, styled visually like normal text.

Verified:

- Login API returns a session cookie.
- `/api/crm-app/leads` works with the session cookie.
- `npm run smoke`

Remaining:

- Enforce role-based route/view restrictions beyond owner/admin.
- Add password reset/change flow if needed.
- Add partner self-service login UX when non-admin partner accounts become active.

### Technical Planner Digital Snapshot

Status: `Done / Needs product UX iteration`

Implemented:

- SQLite storage for planner project snapshots and versions.
- Planner project restore by `project` and `token`.
- Planner save flow creates versions.
- Planner submissions can link project snapshot to lead/deal.

Important routes:

- `/technical-millwork-planner`
- `/api/planner-projects`

Remaining:

- Improve visible project history in partner/client portal.
- Add file/PDF export management inside CRM if needed.

### SEO / Programmatic Pages

Status: `In Progress`

Implemented:

- `SEO_FREE_ACTION_PLAN.md` added.
- `src/lib/seo/casaurum/seoPages.js` has expanded SEO page work.
- Smoke covers sitemap gates and noindex behavior.

Verified:

- `npm run smoke`

Remaining:

- Continue planned SEO content and indexing review from `SEO_FREE_ACTION_PLAN.md`.
- Keep all public-facing pages in EN/ES/FR/RU unless a page is intentionally internal/noindex.

## Checkpoints

### 2026-06-11 UTC - Agent Execution Journal Added

Commit: `14511c4`

Done:

- Added `AGENT_EXECUTION_JOURNAL.md` as the cross-chat execution journal for AI agents.
- Added README pointer so future agents read the journal before changing code.
- Captured current partner CRM, web login, planner snapshot, and SEO initiative states.

Verified:

- Journal reviewed for current project state and no secrets.

### 2026-06-11 UTC - Partner Login Header Added

Commit: `eee2ef3`

Done:

- Added header `Partner Login` link to `/crm-app`.
- Localized header login label in EN/ES/FR/RU.
- Added smoke checks for EN and RU header login.
- Restarted `casaurum-web`.
- Pushed to `origin/main`.

Verified:

- `npm run smoke`
- Production `/` contains `Partner Login`.
- Production `/ru/premium-stenovye-paneli` contains `Вход партнера`.

### 2026-06-11 UTC - Partner CRM, Web Admin Login, Localized Partner Pages

Commit: `dc25d66`

Done:

- Added partner CRM data model, partner application flow, Telegram notification, partner approval/rejection, partner portal links, and CRM partner tab.
- Added web login for `/crm-app` with SQLite sessions and web users.
- Added roles for future partner/designer/builder dashboards.
- Added public partner pages in EN/ES/FR/RU.
- Added hidden Privacy Policy admin entrance in the Contact paragraph.
- Added smoke coverage for partner routes and stealth admin link.

Verified:

- `npm run smoke`
- Production partner routes returned `200` and contained partner form.
- Login API worked with session cookie.

### 2026-06-10 UTC - Planner Digital Snapshot

Commit: included in `dc25d66`

Done:

- Added planner project snapshot/version storage.
- Added planner save/restore by token.
- Linked planner projects to CRM leads/deals.

Verified:

- Syntax checks.
- Smoke tests.
- Manual API save/read test during implementation.

## Next Suggested Work

1. Split `/crm-app` after login by role:
   - `owner/admin`: full CRM.
   - `partner/designer/builder`: private portal with only their projects, discount level, progress, approvals, deadlines, files, comments.
2. Add an explicit `/partner-login` route or keep `/crm-app` as the single login.
3. Add partner account invitation flow after approving partner application.
4. Continue SEO plan from `SEO_FREE_ACTION_PLAN.md`, maintaining EN/ES/FR/RU parity.
