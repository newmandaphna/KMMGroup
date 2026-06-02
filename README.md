# KMM Tax Group

Marketing website for **KMM Tax Group**, a multi-division tax firm with three divisions:

- **Klein Muskat** — personal income tax, trusts, and estates
- **Klein Mirsky** — business tax and year-round bookkeeping
- **Klein Real Estate** — tax for investors, partnerships, and property entities

It's a **static multi-page site** — plain HTML, one shared CSS file, and one shared JS file. No build step, no framework, no dependencies to install.

## Structure

```
KMMGroup/
├── index.html              Home (hero, divisions, stats, testimonials, FAQ)
├── klein-muskat.html       Division — Personal, Trusts & Estates
├── klein-mirsky.html       Division — Business Tax & Bookkeeping
├── klein-realestate.html   Division — Real Estate Taxes
├── about.html              Firm story, "how we work," team
├── insights.html           Articles / resources (SEO engine)
├── contact.html            Contact form + client portals
├── privacy.html            Privacy policy & disclaimer (template)
├── robots.txt              Crawl directives
├── sitemap.xml             Sitemap for search engines
└── assets/
    ├── styles.css          Shared styles (design system + components)
    ├── app.js              Shared behavior (menu, reveals, counters, FAQ, form)
    └── kmm-logo.png         Logo (also used as the social-share / Open Graph image)
```

## Viewing the site

Open `index.html` in any modern browser. Because pages link to each other with relative paths and the form posts to an external service, everything works as plain files — no server needed for a quick look. (For the cleanest local experience you can serve the folder, e.g. `npx serve`, but it isn't required.)

## Before launch — fill these in

The site uses bracketed `[ ... ]` placeholders wherever real content is needed. Search the project for `[` to find them all. Key items:

- **Contact details** — phone, email, office address, hours (in every footer + `contact.html`).
- **Domain** — replace `www.kmmtaxgroup.com` in each page's `canonical`/Open Graph tags, in `sitemap.xml`, and in `robots.txt`.
- **Contact form** — create a free form at [formspree.io](https://formspree.io) and replace `REPLACE_WITH_FORM_ID` in `contact.html`. Until then the form shows an on-screen confirmation but does not send.
- **Team** — add real people (name, title, credential, headshot) in `about.html`. This is the biggest trust signal on the site.
- **Testimonials** — replace the placeholder quotes in `index.html`.
- **Stats** — replace or remove the example figures in `index.html`.
- **Klein Real Estate portal** — add the login URL once the TaxDome account is live (in the nav dropdown and on `klein-realestate.html`).
- **Privacy & disclaimer** — have an attorney review `privacy.html` before publishing.

Client portals already wired: Klein Muskat → `kleintaxgroup.taxdome.com`, Klein Mirsky → `kleinmirsky.com/login`.

## Deploying with Replit

Import this repo into Replit and create a **Static** Deployment with the **public directory** set to the repo root (`.`). No build command is needed. After deploying, point the canonical/sitemap/robots URLs at the live domain and submit the sitemap in Google Search Console.
