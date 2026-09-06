/* ============================================================
   KMM TAX GROUP  |  department directory (single source of truth)

   Every division of the firm runs its own practice-management
   account (TaxDome for some, a separate portal for others). This
   file is the one place to wire those endpoints. The site reads it
   at load time and lights up "Client Login", "Become a client", and
   "Message a department" links wherever they appear.

   To connect a division:
     portal   : client login URL (TaxDome or other portal)
     signup   : TaxDome "Client signup" public form URL
     message  : URL new inquiries should go to (e.g. a TaxDome
                contact form). Leave blank to route to the site's
                own contact form with the division preselected.
     formEndpoint : optional per-division form endpoint (Formspree
                or any endpoint that accepts a POST). Leave blank to
                use the shared endpoint below.
     email / phone : optional; shown on the contact page when set.
   ============================================================ */
window.KMM = window.KMM || {};

window.KMM.config = {
  /* Firm-wide contact details. Each appears in the header, footer, and
     contact page as soon as it is filled in; blank fields stay hidden. */
  firm: {
    phone: "",        /* e.g. "(212) 555-0100" */
    email: "",        /* e.g. "info@kmmtaxgroup.com" */
    address: "",      /* one line, or use \n for a line break */
    hours: "",        /* e.g. "Monday to Friday, 9am to 5pm" */
    linkedin: ""      /* company page URL; the footer icon appears when set */
  },
  /* Shared contact-form endpoint (create a form at formspree.io and paste its URL). */
  formEndpoint: "",
  /* Newsletter signup endpoint (Formspree, Mailchimp, etc.). Blank = confirmation only. */
  newsletterEndpoint: "",
  /* Careers inbox shown on the Careers page. */
  careersEmail: ""
};

window.KMM.departments = [
  {
    id: "klein-muskat",
    name: "Klein Muskat",
    short: "Personal, Trusts & Estates",
    accent: "muskat",
    page: "klein-muskat.html",
    description: "Individual income tax, fiduciary returns for trusts and estates, estate and gift tax, and succession planning.",
    portal: "https://kleintaxgroup.taxdome.com/",
    signup: "",
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
    page: "klein-mirsky.html",
    description: "Business returns, year-round bookkeeping, payroll and sales tax, financial statements, and entity advisory.",
    portal: "https://www.kleinmirsky.com/login",
    signup: "",
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
    page: "klein-realestate.html",
    description: "Entity and partnership returns, 1031 exchanges, cost segregation, depreciation strategy, and investor reporting.",
    portal: "",
    signup: "",
    message: "",
    formEndpoint: "",
    email: "",
    phone: ""
  },
  {
    id: "general",
    name: "General inquiry",
    short: "Not sure which division",
    accent: "",
    page: "contact.html",
    description: "Tell us about your situation and we will route it to the right practice.",
    portal: "",
    signup: "",
    message: "",
    formEndpoint: "",
    email: "",
    phone: ""
  }
];
