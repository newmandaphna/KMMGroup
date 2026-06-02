# Wiring website leads into TaxDome

Each division is a **separate TaxDome account**, so this is set up once per account
(Klein Muskat, Klein Mirsky, Klein Real Estate). There are two paths, start with
Path A; add Path B later if you want website inquiries auto-created in TaxDome too.

> You do **not** need to share TaxDome passwords with anyone to do this. Sign-up
> form URLs are public, and Zapier connects to TaxDome through its own secure login.

---

## Path A, TaxDome's built-in client sign-up form (recommended)

This is the native new-client path. TaxDome captures the lead, tags it, and a
pipeline runs your onboarding automatically.

**1. Turn on / customize the sign-up form**
- In each TaxDome account: **Settings ▸ Client signup**.
- Add the custom questions you want (service needed, individual vs. business, etc.).
- Copy the **public sign-up link**. You'll paste these three links into the website
  (the "New clients, get started" cards on `contact.html` and the "Become a client"
  buttons on each division page).

**2. Create an onboarding pipeline**
- **Settings ▸ Pipelines ▸ add pipeline** (e.g., "New Client Onboarding").
- Add stages: e.g., *New lead → Consult booked → Engagement letter → Onboarded*.

**3. Auto-tag and trigger from the sign-up**
- Enable "start jobs / trigger automations based on client sign-up answers" so a new
  sign-up drops into the pipeline automatically.
- Use **account tags** as the trigger: e.g., a new sign-up gets the **`Lead`** tag,
  which fires a conditional automation (welcome message + intake organizer). When they
  pay/engage, an **Update account tags** automation swaps `Lead` → **`New client`**,
  which triggers the engagement letter. (Tags driving automations is exactly the
  "trigger from a tag" mechanism.)

**Result:** website visitor clicks "Become a client" → fills the TaxDome sign-up →
lands in the pipeline, tagged, with onboarding automations running. Nothing manual.

---

## Path B, Keep the on-site form, push into TaxDome via Zapier

Use this if you want the branded contact form on the website to also create the lead
in TaxDome automatically.

- Confirm your **TaxDome plan includes Zapier/API** access.
- In Zapier: **Trigger** = new form submission (Formspree / Jotform / Google Forms , 
  whatever the contact form posts to). **Action** = TaxDome **"Create contact/account."**
- Map the form fields → TaxDome fields (name, email, phone, plus `division`,
  `client_status`, `client_type`, `referral`, already on our form).
- Because each division is its own account, **route by the `division` field**: either
  one Zap per division (with a filter) or a single Zap using paths.
- Optionally add the **`Website lead`** tag on creation so the same pipeline automation
  from Path A fires.

---

## What to send back to wire the website side
1. Which path (A, B, or both).
2. For Path A: the **three sign-up URLs** (one per division) to drop into the site.
3. For Path B: confirmation your plan supports Zapier (then you connect each account).

Sources: TaxDome Help, client sign-up → pipelines, tags in pipelines, update-account-tags
automation, and the Zapier integration actions.
