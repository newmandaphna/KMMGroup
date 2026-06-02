# KMM Tax Group — launch checklist

Work top to bottom. Anything in the site shown as `[ ... ]` is a placeholder waiting
on you — search the project for `[` to find them all.

## 1. Content to fill in
- [ ] **Phone, email, office address, hours** — appear in every footer and on `contact.html`.
- [ ] **Team** — real names, titles, credentials (CPA / EA), and headshots in `about.html`. *(Biggest trust signal on the site.)*
- [ ] **Testimonials** — replace the three placeholder quotes in `index.html`.
- [ ] **Stat figures** — replace or remove the example numbers in `index.html`.
- [ ] **FAQ fee answer** — fill the "How are your fees structured?" answer in `index.html` (then it can be added to the FAQ schema).
- [ ] **Founding year / firm story** — finish the story paragraph in `about.html`.

## 2. Make the contact form actually send
- [ ] Create a free form at [formspree.io](https://formspree.io) and replace `REPLACE_WITH_FORM_ID` in `contact.html`. Until then the form shows an on-screen confirmation but emails nothing.

## 3. New-client → TaxDome flow
- [ ] Follow **TAXDOME-SETUP.md**. Add the three division **sign-up URLs** to the "New clients — get started" cards on `contact.html` (and repoint the division "Become a client" buttons if you want them to go straight to each sign-up).
- [ ] Add the **Klein Real Estate portal URL** once that account is live (nav dropdown + `klein-realestate.html` + contact portal card).

## 4. Domain & SEO
- [ ] Point the real domain everywhere `www.kmmtaxgroup.com` appears: each page's `canonical` + Open Graph tags, `sitemap.xml`, and `robots.txt`.
- [ ] After deploy, submit `sitemap.xml` in **Google Search Console**.
- [ ] **Google Business Profile** — claim/verify it; keep name, address, phone identical to the site. This is the single biggest local-SEO lever, and it feeds the review stars people look for. Pipe real Google reviews into the testimonials section.

## 5. Analytics
- [ ] Add your **GA4 Measurement ID** (`G-XXXXXXXXXX`) in `assets/app.js` — see the `GA_ID` line near the top. It stays off until you paste an ID. (Or swap in privacy-friendly Plausible.)
- [ ] If you add analytics, update the cookies/analytics line in `privacy.html` and consider a simple consent banner.

## 6. Brand assets
- [ ] **Optimized share image** — `assets/kmm-logo.png` works as the Open Graph image but is ~2 MB. Export a 1200×630 version (under ~200 KB) for faster, cleaner social cards.
- [ ] **apple-touch-icon** — add a 180×180 PNG (`assets/apple-touch-icon.png`) and link it in each page `<head>` for iOS home-screen bookmarks. The SVG favicon already covers browsers.

## 7. Legal
- [ ] Have an attorney review `privacy.html` (privacy policy + disclaimer) before publishing.

## 8. Deploy (Replit)
- [ ] Import the repo → **Static** deployment → public directory = repo root (`.`). No build command.
- [ ] Confirm the host serves `404.html` for unknown URLs (most static hosts do automatically).

## Already done in the build
Multi-page structure · shared CSS/JS · per-page SEO meta + Open Graph + JSON-LD
(`AccountingService`, `BlogPosting`, `FAQPage`) · sitemap + robots · scroll animations ·
trust bar, stats, testimonials, team, FAQ, process, CTA sections · per-division client
logins · Formspree-ready form with intake fields · 404 page · Insights article template ·
year-end checklist lead magnet.
