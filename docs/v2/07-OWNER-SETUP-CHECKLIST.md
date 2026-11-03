# Owner setup checklist (Stephen)

These are the things only you can do: accounts, keys and approvals. Do them in this order. The build can start after **Part A**; Parts B to E can be done while the build runs, and Claude will tell you when each is needed.

**Rule for keys:** never paste a secret key into a chat message. Put it directly into the place named below (GitHub secrets, Cloudflare or the Claude Code environment settings). Claude Code then uses it from there.

## Part A: start the build session (5 minutes)

- [ ] 1. Open Claude Code on the web (claude.ai/code) and start a session on the repository **scs-create/service-page**. Make sure the Claude GitHub app has access to the `scs-create` organisation, so the session can push branches and open pull requests.
- [ ] 2. Upload this build pack: attach the zip to the first message, or unzip it into the repo as `docs/v2/` on the `v2` branch.
- [ ] 3. Paste the prompt from `01-BUILD-PROMPT.md` as the first message.

## Part B: Cloudflare (needed for the first preview deploy)

- [ ] 4. **Account ID:** Cloudflare dashboard → Workers & Pages → copy the Account ID from the right-hand side.
- [ ] 5. **API token:** dashboard → your profile icon → My Profile → API Tokens → Create Token → Create Custom Token. Name it `scs-v2-ci`. Give it only these permissions:
  - Account: Workers Scripts (Edit), D1 (Edit), Workers R2 Storage (Edit), Account Settings (Read)
  - Zone (only `stephencorporateservices-scs.com`): Workers Routes (Edit), DNS (Edit). Add DNS (Edit) only on cutover day if you prefer.

  Copy the token once, then put it in GitHub → repo → Settings → Secrets and variables → Actions → New secret: `CLOUDFLARE_API_TOKEN`, plus `CLOUDFLARE_ACCOUNT_ID`. Add the same two values to the Claude Code environment's environment variables.
- [ ] 6. **Turnstile:** dashboard → Turnstile → Add widget. Name it `SCS forms`; domains `stephencorporateservices-scs.com` and the preview domain Claude reports; mode **Managed**. Then:
  - give the **site key** (public) to Claude in chat;
  - put the **secret key** in the Worker when Claude asks: Workers & Pages → the SCS Worker → Settings → Variables and Secrets → `TURNSTILE_SECRET`.

## Part C: email sending (needed before testing forms)

- [ ] 7. **Resend:** create an account, then Domains → Add domain → `send.stephencorporateservices-scs.com`. Resend shows a few DNS records. Add **only those records** in Cloudflare → DNS. Do not edit or delete any existing MX, SPF, DKIM or DMARC record (those run your Google Workspace email). Click Verify.
- [ ] 8. **Resend API key:** API Keys → Create → permission "Sending access", domain `send.stephencorporateservices-scs.com`. Put it in the Worker secrets as `RESEND_API_KEY`.
- [ ] 9. Confirm that the sender address `contact@stephencorporateservices-scs.com` is acceptable for visitor confirmations. Replies go to your Google Workspace inbox as normal.

## Part D: staff access and the CMS

- [ ] 10. **People who may view submissions:** send Claude the Google Workspace email addresses (for example sales@ and yours).
- [ ] 11. **Cloudflare Access:** dashboard → Zero Trust (create a team name if asked) → Settings → Authentication → add **Google** as a login method. Claude will give you the exact Access application settings for `/admin/*` to add, with the emails from step 10.
- [ ] 12. **GitHub OAuth App for the CMS:** GitHub → the `scs-create` organisation → Settings → Developer settings → OAuth Apps → New OAuth App.
  - Homepage `https://stephencorporateservices-scs.com`
  - Callback `https://stephencorporateservices-scs.com/api/callback`

  Generate a client secret. Put both values in the Worker secrets as `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

## Part E: approvals during the build (in pull requests)

- [ ] 13. Review the service copy PR (66 services: benefits, What you receive, What you provide, Does not include).
- [ ] 14. Review the Process, Partnership and audience page copy.
- [ ] 15. Review the updated Privacy, Cookie and Terms pages (Cloudflare, Resend, PostHog, 6-month retention).
- [ ] 16. Open the preview link on your phone and computer, then sign off the preview in writing in the PR ("Approved for cutover").

## Part F: launch day and after

- [ ] 17. Before cutover, screenshot or export the Cloudflare DNS page (Claude will also export it).
- [ ] 18. After cutover, add the site in **Google Search Console** (Domain property, verified by a DNS TXT record in Cloudflare) and **Bing Webmaster Tools**, then submit `https://stephencorporateservices-scs.com/sitemap.xml`.
- [ ] 19. After 7 stable days, delete the Netlify site.
- [ ] 20. After 30 days, ask Claude for the PostHog report against the v1 baseline.
