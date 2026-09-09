/* ============================================================
   KMM TAX GROUP  |  department directory (single source of truth)

   Every practice of the firm runs its own practice-management
   account (TaxDome for some, a separate portal for others). This
   file is the one place to wire those endpoints. The site reads it
   at load time and lights up "Client Login", "Become a client", and
   "Message a department" links wherever they appear.

   To connect a practice:
     portal   : client login URL (TaxDome or other portal)
     signup   : TaxDome "Client signup" public form URL
     message  : URL new inquiries should go to (e.g. a TaxDome
                contact form). Leave blank to route to the site's
                own contact form with the practice preselected.
     schedule : booking page URL (TaxDome scheduling, Calendly, etc.).
                Leave blank and "Schedule a consultation" shows a
                request-a-time form routed to the practice instead.
     pay      : invoice payment URL. Leave blank to fall back to the
                portal login.
     formEndpoint : optional per-practice form endpoint (Formspree
                or any endpoint that accepts a POST). Leave blank to
                use the shared endpoint below.
     email / phone : optional; shown on the contact page when set.

   Visitors pick a practice once (Client Hub, scheduling, message a
   department, or the contact form) and the site remembers it, so
   every login, signup, schedule, message, and payment link on the
   site points at that practice's own account.
   ============================================================ */
window.KMM = window.KMM || {};

window.KMM.config = {
  /* Firm-wide contact details. Each appears in the header, footer, and
     contact page as soon as it is filled in; blank fields stay hidden. */
  firm: {
    phone: "",        /* e.g. "(212) 555-0100" */
    email: "",        /* e.g. "info@kmmcpagroup.com" */
    address: "",      /* one line, or use \n for a line break */
    hours: "",        /* e.g. "Monday to Friday, 9am to 5pm" */
    linkedin: "",     /* company page URL; the footer icon appears when set */
    heroImage: "",    /* e.g. "assets/photos/office.jpg"; replaces the quick-access panel in the home hero */
    heroImageAlt: ""  /* short description of that photograph */
  },
  /* Shared contact-form endpoint (create a form at formspree.io and paste its URL). */
  formEndpoint: "",
  /* Newsletter signup endpoint (Formspree, Mailchimp, etc.). Blank = confirmation only. */
  newsletterEndpoint: "",
  /* Careers inbox shown on the Careers page. */
  careersEmail: "",
  /* Client quotes for the home page. Each needs the client's written permission.
     { quote: "...", name: "Jane Doe", role: "Owner, Example Bakery" } */
  testimonials: [],
  /* Photographs. Each slot is hidden until a file is set. Paths are relative to the site root.
     { src: "assets/photos/office.jpg", alt: "The partners in the Brooklyn office", caption: "" } */
  photos: {
    about: { src: "", alt: "", caption: "" },
    "klein-muskat": { src: "", alt: "", caption: "" },
    "klein-mirsky": { src: "", alt: "", caption: "" },
    "klein-realestate": { src: "", alt: "", caption: "" }
  },
  /* Live chat widget (Intercom, Crisp, Tidio, HubSpot). Paste the provider's script URL, or the whole
     snippet as inline code. Loaded on every page when set. */
  chat: { scriptUrl: "", inline: "" }
};

window.KMM.departments = [
  {
    id: "klein-muskat",
    name: "Klein Muskat",
    short: "Personal, Trusts & Estates",
    accent: "muskat",
    page: "/klein-muskat",
    description: "Individual income tax, fiduciary returns for trusts and estates, estate and gift tax, and succession planning.",
    portal: "https://kleintaxgroup.taxdome.com/",
    signup: "",
    schedule: "",
    pay: "",
    message: "",
    formEndpoint: "",
    email: "",
    phone: ""
  },
  {
    id: "klein-mirsky",
    name: "Klein Mirsky",
    short: "Business Tax & Bookkeeping",
    accent: "mirsky",
    page: "/klein-mirsky",
    description: "Business returns, year-round bookkeeping, payroll and sales tax, financial statements, and entity advisory.",
    portal: "https://www.kleinmirsky.com/login",
    signup: "",
    schedule: "",
    pay: "",
    message: "",
    formEndpoint: "",
    email: "",
    phone: ""
  },
  {
    id: "klein-realestate",
    name: "Klein Real Estate",
    short: "Real Estate Tax",
    accent: "realestate",
    page: "/klein-realestate",
    description: "Entity and partnership returns, 1031 exchanges, cost segregation, depreciation strategy, and investor reporting.",
    portal: "",
    signup: "",
    schedule: "",
    pay: "",
    message: "",
    formEndpoint: "",
    email: "",
    phone: ""
  },
  {
    id: "general",
    name: "General inquiry",
    short: "Not sure which practice",
    accent: "",
    page: "/contact",
    description: "Tell us about your situation and we will route it to the right practice.",
    portal: "",
    signup: "",
    schedule: "",
    pay: "",
    message: "",
    formEndpoint: "",
    email: "",
    phone: ""
  }
];
