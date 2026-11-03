# Editing the website (staff guide)

You edit the site in the CMS at **https://stephencorporateservices-scs.com/admin**. It works on the live domain
after cutover. Every change you publish rebuilds the site, and it's live a few minutes later.

## Signing in

1. Open `/admin`. Cloudflare asks you to sign in with your **Google Workspace** account. Only the addresses the owner
   approved can get in.
2. Click **Login with GitHub**. You need a GitHub account that has been given write access to
   `scs-create/service-page`. Ask the owner if it hasn't.

## Drafts, review and publishing

The CMS keeps your work as a draft until you publish it:

1. Make your change and click **Save**. It becomes a draft that only staff can see.
2. In **Workflow**, move the card to **In review**, then **Ready**, when someone has checked it.
3. Click **Publish**. The site rebuilds; check the page a few minutes later.

If something goes wrong after publishing, tell the developer. Each published change can be undone, and the
previous version of the site can be restored in one click (`docs/DEPLOYMENT.md` §5).

## What you can edit

| In the CMS | What it changes |
| --- | --- |
| **Corporate School (Blog)** | Guides and articles |
| **Services (v2 page copy)** | The 66 service pages: who it's for, why it matters (exactly 3), what you receive, what you provide, what it doesn't include |
| **Service areas (v2 introductions)** | The introduction on each of the 7 area pages |
| **Portfolio Case Studies**, **FAQs**, **Industries**, **Verification documents** and the others | Those pages |

Not in the CMS:
- **Legal pages** (Privacy, Cookie, Terms). They change only through the developer, from lawyer-approved text.
- Business details: name, phone, address and RC number.
- Page layouts.

## Writing a guide

- **Publish Date** is also the go-live date. A date in the future keeps the guide hidden; the daily rebuild publishes
  it on that day.
- **Key takeaways**: 3 to 5 short sentences. They show at the top of the guide.
- **Official sources**: link the official page (CAC, NRS, NDPC, a .gov.ng site), with the date you checked it.
- **Last reviewed**: change it whenever you re-check the facts.
- **Related services** and **Free tool link** fill the "How SCS can help" box.

## House rules (the build checks most of these)

- Always write the full name **Stephen Corporate Services - SCS Ltd** the first time on a page.
- Phone **+234 812 813 8222**. Response time, word for word: **"We respond within 24 hours."**
- **No fees, prices or delivery timelines** anywhere, not even "from ₦…" or "in 3 days". Official fees change, so
  guides link to the official source instead.
- Never invent testimonials, client names, figures or dates. Use only what the company can show.
- Don't use these words: unlock, empower, seamless, leverage, cutting-edge, robust, holistic, journey, elevate, or
  "in today's fast-paced world". The build stops on them.
- SCS isn't a law firm. Keep the existing wording about legal work exactly as it is. If a sentence would describe
  legal advice or representation, ask the owner first.
- Write plainly: short sentences, the reader's own words, one idea per paragraph.
- Images: upload in the CMS (they go to `/images/uploads`). Add alt text that says what the image shows. Never
  upload signatures, ID documents or anything a client hasn't agreed to publish.
