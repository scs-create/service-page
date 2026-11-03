# Testing the v2 build on your own PC

The v2 site runs on **Cloudflare Workers**. You can run the same thing locally: `wrangler dev` is Cloudflare's own local runtime, so headers, redirects, the 404 page and the `/admin` password gate behave as they will online. Nothing here touches the live site or Netlify.

## 1. One-time setup

1. Install **Node.js 22 LTS** from https://nodejs.org (use the Windows installer and accept the defaults).
2. Unzip this folder to a **short path**, for example `C:\scs-v2`. Windows has a 260-character path limit, and a deep folder (Downloads inside OneDrive, for example) can make the local server fail to start.
3. Open **PowerShell** in that folder (in File Explorer, click the address bar, type `powershell`, press Enter) and run:

   ```
   npm ci
   ```

   This installs the exact versions from `package-lock.json`. It takes a few minutes the first time.

## 2. Look at the site (the build is already included)

The zip includes a ready-made preview build in `out/`, so you can start straight away:

```
npx wrangler dev
```

Open **http://localhost:8787** in your browser. Press `Ctrl+C` in PowerShell to stop it.

To check the mobile layout, open your browser's developer tools (`F12`) and switch on the device toolbar (`Ctrl+Shift+M`).

## 3. Rebuild after changing something

```
npm run build
npx wrangler dev
```

The build needs an internet connection once, to download and self-host the two fonts. To see exactly what a preview deploy shows (placeholders and the portal prototype switched on), set the preview flags first:

```
$env:NEXT_PUBLIC_SITE_ENV="preview"; $env:NEXT_PUBLIC_SHOW_CLIENT_PLACEHOLDERS="true"; $env:NEXT_PUBLIC_ENABLE_PORTAL_PROTOTYPE="true"; npm run build
```

## 4. Local settings: forms and /admin

Local settings live in a file called `.dev.vars` in this folder, which never leaves your PC (it is in `.gitignore`). Create it with Notepad:

```
TURNSTILE_SECRET=1x0000000000000000000000000000000AA
ADMIN_USER=your-test-name
ADMIN_PASSWORD=a-long-test-password
```

- The `TURNSTILE_SECRET` above is Cloudflare's published test key, which always passes. Use it only on your PC. The real secret goes into the Worker settings in the Cloudflare dashboard (owner checklist step 6).
- `/admin` asks for the username and password you put here. Without them it shows "locked", by design.

Before the first form test, create the local database once:

```
npx wrangler d1 migrations apply DB --local
```

Forms then work end to end on your PC: you get a reference number and the "What happens next" panel, and the submission is saved in the local database. No email is sent locally, because the Resend key is only set online. To see what was saved:

```
npx wrangler d1 execute DB --local --command "SELECT ref, form, created_at FROM submissions"
```

## 5. Checks you can run

```
npm test
npm run check:site
```

`check:site` lists links to pages that later PRs will build, the old v1 words still to be rewritten, and the legal-wording review list. In a preview build these are reports. They only fail a production build.

## What to expect at this stage

- **Done:** platform (PR 1), design system B (PR 2), the 66 services (PR 3), the pages (PR 4) and the forms (PR 5).
- **Still to come:** content migration and policy updates (PR 6), the CMS behind Cloudflare Access and the submissions view (PR 7), analytics and SEO (PR 8), QA (PR 9).
