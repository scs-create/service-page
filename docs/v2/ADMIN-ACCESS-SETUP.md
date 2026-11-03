# Admin access: the exact settings (owner checklist steps 10–12)

This page holds the settings for `07-OWNER-SETUP-CHECKLIST.md` steps 10 to 12. Do them in the Cloudflare and GitHub
dashboards. **Never paste a secret into a chat.** Values marked *secret* go only into Cloudflare's secret store.

Where to put Worker values: Cloudflare dashboard → **Workers & Pages** → **scs-website** → **Settings** →
**Variables and Secrets** → **Add**. Choose **Secret** for the secret ones and **Text** for the others.

## Step 10: who may open /admin

List the Google Workspace addresses that may open the CMS and the submissions view, for example
`sales@stephencorporateservices-scs.com` and your own. You can send this list in chat, because addresses are not
secret.

## Step 11: Cloudflare Access in front of /admin

1. Cloudflare dashboard → **Zero Trust**. If asked, choose a team name, for example `scs`. Your team domain is then
   `scs.cloudflareaccess.com`.
2. **Settings → Authentication → Login methods → Add new → Google** (follow the on-screen steps).
3. **Access → Applications → Add an application → Self-hosted**:
   - Application name: `SCS admin`
   - Session duration: `8 hours`
   - Public hostname: domain `stephencorporateservices-scs.com`, path `admin`. Add a second hostname with path
     `admin/*`.
   - Identity providers: **Google** only
4. Add a **policy**: name `SCS staff`, action **Allow**, include **Emails**, then add the addresses from step 10.
5. Save. On the application's **Overview** tab, copy the **Application Audience (AUD) Tag**.
6. In the Worker's Variables and Secrets, add:
   - `ACCESS_TEAM_DOMAIN` (Text): your team domain, for example `scs.cloudflareaccess.com`
   - `ACCESS_AUD` (Text): the AUD tag from step 5

Once both are set, the Worker checks Cloudflare's signed token on every `/admin` request and the old username and
password gate switches off. Until then, the password gate stays on.

## Step 12: GitHub sign-in for the CMS

1. GitHub → the **scs-create** organisation → **Settings → Developer settings → OAuth Apps → New OAuth App**:
   - Application name: `SCS website CMS`
   - Homepage URL: `https://stephencorporateservices-scs.com`
   - Authorization callback URL: `https://stephencorporateservices-scs.com/api/callback`
2. Click **Generate a new client secret**.
3. In the Worker's Variables and Secrets, add:
   - `GITHUB_CLIENT_ID` (Secret): the Client ID
   - `GITHUB_CLIENT_SECRET` (Secret): the client secret

CMS sign-in works on the real domain after cutover, because GitHub allows one callback address per OAuth app.

## One more secret: file links in the submissions view

`FILE_LINK_SECRET` (Secret) signs the 15-minute download links for CVs and briefs. Use any long random value, for
example a 40-character password from your password manager. Nobody needs to remember it.
