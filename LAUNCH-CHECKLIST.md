# KMM Tax Group launch checklist

Work top to bottom. Anything on the site shown as `[ ... ]` is a placeholder waiting on you. Search the project for `[ ` to find them all.

Nothing on the public site shows a placeholder. Missing details are hidden until you fill them in, so the site is safe to publish as is.

## 1. Content to fill in
- [ ] **Phone, email, office address, hours, LinkedIn**: `KMM.config.firm` at the top of `assets/departments.js`. Each value appears in the header, footer, and contact page the moment it is set.
- [ ] **Leadership**: `about.html` has a leadership section switched off inside an HTML comment (search for `LEADERSHIP`). Add real names, titles, credentials, and photographs, then remove the comment wrapper. The single biggest trust signal on an accounting site.
- [ ] **Founding story**: add a paragraph where the comment in `about.html` marks the spot.
- [ ] **Fees answer**: add the "How are your fees structured?" question to the FAQ on `contact.html` when there is a plain answer.
- [ ] **Careers inbox**: `careersEmail` in `assets/departments.js` makes the "Email a resume" button appear. To post a role, uncomment the roles block in `careers.html`.

## 2. Wire the practices (assets/departments.js)
- [ ] **Klein Real Estate portal URL** (`portal`). The nav, home quick access, practice page, and contact page all light up from this one field.
- [ ] **Sign-up URLs** for each practice (`signup`) from TaxDome Settings > Client signup. See `TAXDOME-SETUP.md`.
- [ ] **Inquiry endpoint**: create a form at formspree.io (or one per practice) and set `formEndpoint`. Until then the form confirms on screen and sends nothing.
- [ ] **Booking pages** (`schedule`) per practice, from TaxDome scheduling or Calendly. Until set, "Schedule a consultation" shows a request-a-time form that posts to the practice's form endpoint.
- [ ] Optional: `pay` URLs if invoices are paid somewhere other than the portal.
- [ ] Optional: per-practice `message` URLs so "Message a department" goes straight to that practice's TaxDome inbox.
- [ ] Optional: `newsletterEndpoint` for the footer signup.

## 3. Domain and SEO
- [ ] Replace `www.kmmtaxgroup.com` in every page head (canonical and Open Graph), `sitemap.xml`, and `robots.txt`.
- [ ] Submit `sitemap.xml` in Google Search Console after deploy.
- [ ] Claim and verify the **Google Business Profile**; keep name, address, phone identical to the site.

## 4. Analytics
- [ ] Add a GA4 Measurement ID in `assets/app.js` (`GA_ID`). Then update the analytics line in `privacy.html`.

## 5. Legal
- [ ] Have an attorney review `privacy.html` before publishing.

## 6. Deploy (Replit)
- [ ] Static deployment, public directory = repo root. No build command.
- [ ] Confirm unknown URLs serve `404.html`.

## Already built
Client Hub and scheduling page with a remembered practice selector that drives every login, sign-up, schedule, message, and payment link · Mega-menu navigation with per-practice service links · client-login dropdown per practice · home quick-access panel · practice finder (three questions) · federal tax calendar computed each year with weekend/holiday rollover and .ics export · upcoming-deadlines widget · industries page · services index with scroll-spy · insights with topic filter · message-a-department routing · contact form with practice preselect · year-end checklist lead magnet · careers page · per-page SEO meta, Open Graph, JSON-LD (AccountingService, BlogPosting, FAQPage) · sitemap and robots · 404 · print styles.
