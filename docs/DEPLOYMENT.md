# Deploying the SCS website — step by step

Order matters. Do the steps in sequence. Anything marked **(you decide)** needs a client decision first.

## A. Test locally (once)
1. Unzip the project, open a terminal in it, run `npm install` (this also copies the pinned CMS files into `public/admin`).
2. `npm run dev` → open http://localhost:3000 and click through the site.
3. `npm run lint && npm run typecheck && npm test && npm run build` — all four must pass. (The build needs internet access for Google Fonts.)

## B. The code on GitHub
The repository is `scs-create/service-page` (branch `main`). Netlify is connected to it: **every push to `main` deploys production**; other branches and pull requests get preview deploys (which show the client placeholders and the portal prototype).
1. Never force-push `main`. Make small commits; revert with `git revert` if needed.
2. `.gitignore` excludes `node_modules`, `.next`, `*.tsbuildinfo` and the generated `public/admin/*.js` (recreated on every build).
3. The **CI** workflow (`.github/workflows/ci.yml`) runs lint, typecheck, tests, build and `npm audit` on every push. Check the Actions tab is green.

## C. Create the Netlify site
1. Netlify → **Add new project → Import an existing project → GitHub** → choose the repository.
2. Settings are read from `netlify.toml` (build `npm run build`, Node 22, Next.js runtime). Click **Deploy**.
3. When it finishes you get a `*.netlify.app` address. Open it and confirm the site loads.

## D. Connect your domain `stephencorporateservices-scs.com`
1. Netlify → **Domain management → Add a domain** → enter the domain → make the **apex** (no `www`) the **primary** domain, and let `www` redirect to it (the site's canonical URL, sitemap and social tags use the apex).
2. **Do NOT hand your DNS to Netlify unless you recreate every Google Workspace record** (MX, SPF, DKIM, DMARC) — otherwise email stops. DNS stays at **Cloudflare**. Add only two records, both **DNS only (grey cloud)**, and touch nothing else:
   - `A` · name `@` · value `75.2.60.5` (Netlify's load balancer) · TTL Auto
   - `CNAME` · name `www` · value `<your-site-name>.netlify.app` · TTL Auto
   Remove any existing `A`/`AAAA`/`CNAME` for `@` or `www` that points elsewhere (for example a parking page), but never an `MX` or `TXT` record. If Netlify's Domain management screen shows different values, use Netlify's. Keep the grey cloud: an orange-cloud proxy stops Netlify issuing the HTTPS certificate.
3. Back in Netlify click **Verify DNS**, wait for the HTTPS certificate to provision, then enable **Force HTTPS**.
4. Send and receive a test email on one alias to confirm email is unaffected.

## E. Environment variables (Site configuration → Environment variables)
Defaults are built in, but set this one so it is visible in Netlify: `NEXT_PUBLIC_BOOKING_URL` = `https://cal.com/support-stephen-corporate-services-scs/30min`. Optional: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_POSTHOG_KEY` (only to point at a different PostHog project; the live key is built in).
**Never** add `NEXT_PUBLIC_SHOW_CLIENT_PLACEHOLDERS` or `NEXT_PUBLIC_ENABLE_PORTAL_PROTOTYPE` to production — `netlify.toml` already sets them for preview deploys only.

## F. Forms (two forms: `enquiry`, `career-application`)
1. Netlify → **Forms** → **Enable form detection** → trigger a new deploy.
2. After the deploy, the Forms tab should list `enquiry` and `career-application`. If not, redeploy with *Clear cache and deploy site*.
3. **Forms → Settings & usage → Form notifications → Add notification → Email**: `enquiry` → `sales@stephencorporateservices-scs.com`; `career-application` → `contact@stephencorporateservices-scs.com`.
4. Check spam filtering is on (Forms → Settings) and look at your plan's submission limit under billing.
5. Submit one real test of each: the Contact consultation form, the assessment (send your result), checklist, structure chooser, Find My Service, compliance reminders, training request, newsletter, and a Career application **with a PDF CV**. Confirm each appears with the right `request_type`.

## G. CMS login (GitHub backend; Git Gateway/Identity are deprecated and no longer used)
1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**. Homepage URL: `https://stephencorporateservices-scs.com`. Authorization callback URL: `https://api.netlify.com/auth/done`. Register, copy the **Client ID**, click **Generate a new client secret** and copy it.
2. Netlify → **Site configuration → Access & security → OAuth** (older UI: *Access control → OAuth*) → **Install provider → GitHub** → paste Client ID and Secret. (Menu labels vary slightly between Netlify UI versions.)
3. `public/admin/config.yml` already points at `scs-create/service-page` (branch `main`). Change it only if the repository moves.
4. **Admin password:** Netlify → **Site configuration → Environment variables → Add a variable** → `ADMIN_USER` (a username of your choice) and `ADMIN_PASSWORD` (a long, unique password, 16+ characters, from a password manager). Tick **Contains secret values**, scope **All scopes**, same value for every deploy context. Then **Deploys → Trigger deploy**. Share them only with editors. To change the password, edit the variable and redeploy.
5. Open `https://stephencorporateservices-scs.com/admin` → enter that username and password → **Login with GitHub**. Every editor needs a GitHub account added to the repository as a collaborator with **write** access.
6. Editors work in the *Editorial workflow*: Draft → In review → Ready → **Publish** (publishing merges the change; Netlify rebuilds).

## H. Analytics (PostHog Cloud EU)
1. PostHog → the project whose key starts `phc_virz…` (EU Cloud, https://eu.posthog.com).
2. **Settings → Project → IP data capture:** turn on **Discard client IP data**.
3. **Settings → data retention:** set **12 months** (what the Privacy Notice promises).
4. Leave **session replay** and **surveys** off (the site disables them too).
5. Check it works: open the live site in a private window → **Accept analytics** → click a few buttons → PostHog → **Activity → Live events** shows `$pageview`, `cta_clicked` and so on within a minute. Decline in another private window: nothing appears.
6. Suggested insights: funnel `$pageview` (/) → `service_page_viewed` → `form_started` (consultation) → `form_submitted`; trend of `cta_clicked` broken down by `cta_name`; `form_submitted` broken down by UTM source / referring domain.
7. In Netlify → Environment variables, delete the old analytics domain variable if it exists (it is no longer read), and cancel the previous analytics account.
8. Analytics only counts visitors who press **Accept analytics**; never those who decline or send Do Not Track / Global Privacy Control.

## I. Scheduled blog posts
1. Netlify → **Site configuration → Build & deploy → Build hooks → Add build hook** ("Daily scheduled posts") → copy the URL.
2. GitHub → repository **Settings → Secrets and variables → Actions → New repository secret**: name `NETLIFY_BUILD_HOOK_URL`, value = that URL.
3. A post whose `date` is in the future stays hidden until the first daily rebuild on/after that date.

## J. Google Workspace and search engines
1. Confirm in Google Admin that `contact@`, `info@`, `sales@`, `accounts@` exist as aliases of a real mailbox. `admin@` is internal only. Optional but recommended: add a `privacy@` alias, then change `EMAILS.privacy` in `src/lib/site.ts`.
2. Google Search Console → add the domain property (DNS TXT verification) → submit `https://stephencorporateservices-scs.com/sitemap.xml`. Import the property into Bing Webmaster Tools.

## K. Still to supply **(you decide / supply)**
Already decided (16 October 2026): address, positioning, metrics, primary email, WhatsApp, Cal.com link, leadership photos, Corporate School articles, legal effective dates. Still open:
- Upload verification documents (watermark them first) via the CMS; real consented testimonials; signature programmes; SCA description; Partnership terms; IP permissions (see `docs/CLIENT_PLACEHOLDERS.md`). Leadership bios only if the founders want them.
- **Legal pages:** final versions are live (18 October 2026). Counsel to glance at the two website-specific sections listed in `docs/legal-open-items.md`.

## L. After launch — checks
1. Browser DevTools → Network: press **Decline** on the banner and confirm no `/ingest` request and no `ph_*` cookie or storage; press **Accept analytics** and confirm `/ingest` requests start.
2. Run a cookie scan (DevTools → Application → Cookies / storage, or a free scanner), then replace `[to be confirmed by a live-site scan]` in `src/content/legal/cookies.json`.
3. Run Lighthouse (Chrome DevTools) on Home, a service page and Contact; check headers at securityheaders.com.
4. Visit `/academy` (should redirect to `/corporate-college`), a wrong URL (branded 404), and `/portal` (must be 404 in production).
5. Ongoing: delete unsuccessful job applications from Netlify Forms within 6 months; keep dependencies current (`npm audit --omit=dev`).
