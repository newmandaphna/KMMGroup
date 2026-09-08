# KMM CPA Group

Marketing website for **KMM CPA Group**, an accounting firm with three practices, each its own company:

- **Klein Muskat**, personal income tax, trusts, and estates
- **Klein Mirsky**, business tax and year-round bookkeeping
- **Klein Real Estate**, tax for investors, partnerships, and property entities

It is a **static multi-page site**: plain HTML, one shared stylesheet, two small scripts. No build step, no framework, nothing to install.

## Structure

```
KMMGroup/
├── index.html                  Home: hero + quick access, practices, industries, deadlines, insights, practice finder, message a department
├── services.html               Every service across the firm, grouped by practice (mega-menu links land here)
├── industries.html             Industries served, with the practice that handles each
├── klein-muskat.html           Practice page
├── klein-mirsky.html           Practice page
├── klein-realestate.html       Practice page
├── insights.html               Articles and resources, filterable by topic
├── insights-*.html             Individual articles (copy one to add more)
├── year-end-tax-checklist.html Printable checklist (email-gated lead magnet)
├── tax-calendar.html           Federal deadlines computed for this year and next, .ics export
├── about.html                  Firm story, practices, process, leadership
├── careers.html                Careers page (openings block is commented out until needed)
├── schedule.html               Schedule a consultation: pick a practice, then its booking calendar or a request-a-time form
├── login.html                  Client login: pick a practice from a dropdown, continue to that practice's own TaxDome login page
├── portal.html                 Client Hub: pick a practice once; login, upload, pay, message, schedule, sign-up all point at it
├── contact.html                Inquiry form, practice cards, message a department, FAQ
├── privacy.html                Privacy policy and disclaimer (template)
├── 404.html                    Not-found page
├── robots.txt / sitemap.xml
└── assets/
    ├── styles.css              Design system and every component
    ├── departments.js          ONE place to wire each practice's portal, signup, and inbox
    ├── app.js                  Navigation, deadline engine, practice finder, routing, forms
    └── kmm-logo.png, og-image.jpg, apple-touch-icon.png
```

## How the department routing works

Every practice runs its own practice-management account (TaxDome for some, a separate portal for others). `assets/departments.js` is the single directory of those endpoints. Each entry has:

| Field | What it does when set |
|---|---|
| `portal` | "Client Login" links for that practice point here (nav, home quick access, practice page, contact page). Leave blank and the link shows "Portal coming soon". |
| `signup` | "Become a client" buttons for that practice go straight to the TaxDome client-signup form. Blank = they open the site inquiry form with the practice preselected. |
| `message` | "Message a department" sends the visitor here (for example a TaxDome contact form for that practice). Blank = the site contact form with the practice preselected. |
| `schedule` | Booking page URL (TaxDome scheduling, Calendly, or similar). When set, `schedule.html` embeds it for that practice and every "Schedule a consultation" button opens it. Blank = a request-a-time form routed to the practice. |
| `pay` | Invoice payment URL. Blank = falls back to the portal login. |
| `formEndpoint` | Inquiries for that practice POST to this endpoint (a per-practice Formspree form, a Zapier webhook, or any endpoint). Blank = the shared endpoint in `KMM.config.formEndpoint`. |
| `email`, `phone` | Shown on the practice card on the contact page and in the practice page sidebar when set. |

**Practice memory.** A visitor picks a practice once (on the Client Hub, the scheduling page, the department selector, or the contact form) and the site remembers it in the browser. Every element marked `data-firm-action="portal|signup|schedule|message|pay"` then points at that practice's own account, so the whole site behaves as if it belonged to the practice the visitor chose. A `?division=klein-mirsky` query on any URL sets it too, which lets each practice hand out links that pre-select themselves.

`KMM.config` at the top of the same file holds the firm-wide contact details (phone, email, address, hours, LinkedIn), the shared form endpoint, the newsletter endpoint, and the careers inbox. Contact details render into the header, footer, and contact page as soon as they are set and stay hidden until then. Until a form endpoint is set, forms show an on-screen confirmation and send nothing.

See `TAXDOME-SETUP.md` for how to get the signup URLs and pipelines from each TaxDome account.

## How the inquiry form will send (not wired yet)

Every form on the site (contact, schedule request, newsletter, checklist) posts its fields with `fetch` and `Accept: application/json` to an endpoint from `assets/departments.js`: the chosen practice's `formEndpoint` when set, otherwise `KMM.config.formEndpoint`. Until an endpoint is set, forms confirm on screen and send nothing.

Planned wiring, in order:

1. Create four forms at formspree.io: one per practice and one for General inquiry. Set each form's notification address to that practice's inbox. Formspree uses the visitor's `email` field as the reply-to.
2. Paste the four endpoint URLs into `assets/departments.js`: each practice's `formEndpoint`, and the General one into `KMM.config.formEndpoint`.
3. Site side (small): add a hidden `_subject` built from the practice and the visitor's name, a `form` field (`contact` or `schedule`) so the two forms are distinguishable in the inbox, a `_gotcha` honeypot against spam, and the page URL. The on-screen success and error states already exist.
4. Submit one test per practice and confirm each inbox receives it.

Later options: a Zapier or Make webhook that creates the lead in TaxDome, or pointing `message` and `signup` at TaxDome's own forms through the fields that already exist for that.

## Viewing the site

Run `python3 serve.py 5000` and open http://localhost:5000/. The pages are plain files, but links use clean URLs (`/services`, `/klein-mirsky`, `/` for home), so a server that maps `/services` to `services.html` is needed. `serve.py` does that, serves `404.html` with a real 404 status for unknown paths, and is what the Replit preview runs.

## Design

The look is "Evergreen editorial": a dark green header and page head on every page, Cormorant Garamond for headlines, numerals, and dates, Inter for everything else, brass for actions on green and green for actions on white. Both typefaces are served from `assets/fonts`. The stylesheet is layered in dated revisions; the last block (Revision 4) is the current look and overrides what came before it.

## URLs

Every page is reachable at its file name without the extension: `/services`, `/services/`, and `/services.html` all serve the same page, and the canonical URL in the page head is the clean form. In production the Replit static deployment does this through the `[[deployment.rewrites]]` rules at the end of `.replit`, which the page build regenerates from the page list. Asset paths are root-relative (`/assets/...`) so the trailing-slash form works too. Keep in-site links in the clean form (`href="/contact?division=klein-mirsky#inquiry"`); the `page` field in `assets/departments.js` uses the same form.

## Before launch

Nothing on the public site shows placeholder text; details that are not filled in yet are simply hidden. The list of what to fill in is in `LAUNCH-CHECKLIST.md`.

## Deploying with Replit

The repo includes a `.replit` configured for a **Static** deployment with the public directory set to the repo root. No build command. After deploying, point the canonical, sitemap, and robots URLs at the live domain and submit `sitemap.xml` in Google Search Console.
