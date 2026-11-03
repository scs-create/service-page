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

## 4. The /admin page locally

`/admin` asks for a username and password, as it does on the live site. Locally they come from a file called `.dev.vars` in this folder, which never leaves your PC (it is in `.gitignore`). Create it with Notepad, using any test values you like:

```
ADMIN_USER=your-test-name
ADMIN_PASSWORD=a-long-test-password
```

Without the file, `/admin` shows "locked", by design. Online, the real values are set as Worker secrets in the Cloudflare dashboard, never in a file.

## 5. Checks you can run

```
npm test
npm run check:site
```

`check:site` lists links to pages that later PRs will build, the old v1 words still to be rewritten, and the legal-wording review list. In a preview build these are reports. They only fail a production build.

## What to expect at this stage

- **Done:** the platform (PR 1) and design system B (PR 2): fonts, colours, header, footer, mobile bar, cookie banner and the tower mark.
- **Not yet:** links to Clients, Process, Partnership, Request a proposal, the 7 service-cluster pages, Our standards and the Accessibility statement go to the 404 page. Those pages come in PR 3 (services) and PR 4 (pages).
- **Not yet:** the forms show "not live yet" until PR 5. Analytics stays off locally.
