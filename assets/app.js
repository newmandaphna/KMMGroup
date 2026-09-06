/* ============================================================
   KMM TAX GROUP  |  shared behavior
   Progressive enhancement: every page works without JS. This
   layer adds navigation, the deadline engine, the division
   finder, department routing, and form handling.
   ============================================================ */
(function () {
  "use strict";

  var KMM = window.KMM || {};
  var DEPTS = KMM.departments || [];
  var CONFIG = KMM.config || {};

  function dept(id) {
    for (var i = 0; i < DEPTS.length; i++) if (DEPTS[i].id === id) return DEPTS[i];
    return null;
  }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function isConfigured(url) { return !!url && url.indexOf("REPLACE_WITH") === -1; }

  /* ---------- Analytics (off until an ID is added) ---------- */
  (function () {
    var GA_ID = ""; // paste a GA4 Measurement ID here, e.g. "G-XXXXXXXXXX"
    if (!GA_ID) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  })();

  /* ---------- Navigation: mega menu, dropdowns, mobile ---------- */
  (function () {
    var nav = qs("#navMain");
    var toggle = qs("#menuToggle");
    if (!nav) return;
    var items = qsa("li.has-menu", nav);
    var hoverable = window.matchMedia && window.matchMedia("(hover: hover) and (min-width: 901px)").matches;

    function closeAll(except) {
      items.forEach(function (li) {
        if (li !== except && li.classList.contains("open")) {
          li.classList.remove("open");
          var b = qs("button", li);
          if (b) b.setAttribute("aria-expanded", "false");
        }
      });
    }
    items.forEach(function (li) {
      var btn = qs(":scope > button", li);
      if (!btn) return;
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        // On hover-capable screens the menu is already open by the time a click lands, so a click keeps it open.
        var open = hoverable ? true : !li.classList.contains("open");
        closeAll(li);
        li.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      if (hoverable) {
        var timer;
        li.addEventListener("mouseenter", function () {
          clearTimeout(timer);
          closeAll(li);
          li.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        });
        li.addEventListener("mouseleave", function () {
          timer = setTimeout(function () {
            li.classList.remove("open");
            btn.setAttribute("aria-expanded", "false");
          }, 120);
        });
      }
      li.addEventListener("focusout", function (e) {
        if (!li.contains(e.relatedTarget)) {
          li.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
        }
      });
    });
    document.addEventListener("click", function (e) { if (!nav.contains(e.target)) closeAll(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeAll(); if (toggle && nav.classList.contains("open")) { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); } }
    });
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      });
    }
    // Active state by current path
    var here = location.pathname.split("/").pop() || "index.html";
    qsa("a[href]", nav).forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#" || /^https?:/i.test(href)) return;
      if (href.split("/").pop().split("?")[0] === here) a.classList.add("active");
    });
  })();

  /* ---------- Department link enhancement ----------
     <a data-dept="klein-realestate" data-dept-link="portal">
     If the directory has a URL for that link type, the anchor is
     wired to it (and un-disabled). Otherwise it is left as authored. */
  (function () {
    qsa("[data-dept][data-dept-link]").forEach(function (a) {
      var d = dept(a.getAttribute("data-dept"));
      var type = a.getAttribute("data-dept-link");
      if (!d) return;
      var url = d[type];
      if (isConfigured(url)) {
        a.setAttribute("href", url);
        a.classList.remove("is-disabled");
        a.removeAttribute("aria-disabled");
        if (/^https?:/i.test(url)) { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener noreferrer"); }
        var pending = a.getAttribute("data-pending-text");
        if (pending) { var t = qs("[data-label]", a); if (t) t.textContent = a.getAttribute("data-ready-text") || t.textContent; }
      }
    });
    // Optional email/phone reveals on the contact page
    qsa("[data-dept-contact]").forEach(function (el) {
      var d = dept(el.getAttribute("data-dept-contact"));
      if (!d) return;
      var parts = [];
      if (d.phone) parts.push('<a href="tel:' + d.phone.replace(/[^\d+]/g, "") + '">' + d.phone + "</a>");
      if (d.email) parts.push('<a href="mailto:' + d.email + '">' + d.email + "</a>");
      if (parts.length) { el.innerHTML = parts.join(" &middot; "); el.hidden = false; }
    });
  })();

  /* ---------- Firm details (from departments.js) ----------
     <span data-firm="phone"></span> inside an optional [data-firm-row]
     wrapper. Filled when the value is set; the row stays hidden otherwise. */
  (function () {
    var F = CONFIG.firm || {};
    var any = false;
    qsa("[data-firm]").forEach(function (el) {
      var key = el.getAttribute("data-firm");
      var val = String(key === "careersEmail" ? (CONFIG.careersEmail || "") : (F[key] || "")).trim();
      var row = el.closest("[data-firm-row]") || el;
      if (!val) { row.hidden = true; return; }
      row.hidden = false;
      if (["phone", "email", "address", "hours"].indexOf(key) !== -1) any = true;
      var a = el.tagName === "A" ? el : (row.tagName === "A" ? row : null);
      if (key === "phone") { el.textContent = val; if (a) a.setAttribute("href", "tel:" + val.replace(/[^\d+]/g, "")); }
      else if (key === "email") { el.textContent = val; if (a) a.setAttribute("href", "mailto:" + val); }
      else if (key === "careersEmail") { if (a) a.setAttribute("href", "mailto:" + val); }
      else if (key === "linkedin") { if (a) a.setAttribute("href", val); }
      else { el.innerHTML = esc(val).replace(/\n/g, "<br>"); }
    });
    qsa("[data-firm-section]").forEach(function (el) { el.hidden = !any; });
  })();

  /* ---------- Message a department (routing) ----------
     Routes an inquiry to the division's own inbox when one is
     configured in departments.js; otherwise to the site contact
     form with the division preselected. */
  (function () {
    qsa("form[data-dept-router]").forEach(function (form) {
      var select = qs("select", form);
      var desc = qs(".dept-desc", form);
      if (!select) return;
      function update() {
        var d = dept(select.value);
        if (desc) desc.textContent = d ? d.description : "";
      }
      select.addEventListener("change", update);
      update();
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var d = dept(select.value);
        if (!d) { select.focus(); return; }
        if (isConfigured(d.message)) { window.open(d.message, "_blank", "noopener"); return; }
        location.href = "contact.html?division=" + encodeURIComponent(d.id) + "#inquiry";
      });
    });
  })();

  /* ---------- Contact form ---------- */
  (function () {
    var form = qs("#contactForm");
    if (!form) return;
    var params = new URLSearchParams(location.search);
    var pre = params.get("division");
    var sel = qs("#division", form);
    if (pre && sel) { sel.value = pre; if (sel.value !== pre) sel.value = ""; }
    var success = qs("#formSuccess");
    var error = qs("#formError");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = sel ? dept(sel.value) : null;
      var endpoint = (d && isConfigured(d.formEndpoint)) ? d.formEndpoint : (isConfigured(CONFIG.formEndpoint) ? CONFIG.formEndpoint : "");
      var done = function () { form.hidden = true; if (success) { success.classList.add("show"); success.scrollIntoView({ block: "center" }); } };
      if (!endpoint) { done(); return; } // endpoint not wired yet: confirm on screen
      var btn = qs("button[type=submit]", form);
      if (btn) { btn.disabled = true; btn.textContent = "Sending"; }
      if (error) error.classList.remove("show");
      fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (res) { if (!res.ok) throw new Error("bad status"); done(); })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = "Send inquiry"; }
          if (error) error.classList.add("show");
        });
    });
  })();

  /* ---------- Newsletter (footer) ---------- */
  (function () {
    qsa("form[data-newsletter]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = qs(".news-ok", form.parentNode);
        var finish = function () { form.hidden = true; if (ok) ok.classList.add("show"); };
        if (!isConfigured(CONFIG.newsletterEndpoint)) { finish(); return; }
        fetch(CONFIG.newsletterEndpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } }).then(finish).catch(finish);
      });
    });
  })();

  /* ---------- Lead-magnet gate (year-end checklist) ---------- */
  (function () {
    var gate = qs("#checklistGate"), content = qs("#checklistContent"), form = qs("#checklistForm");
    if (!gate || !content || !form) return;
    gate.hidden = false; content.hidden = true;
    var reveal = function () { gate.hidden = true; content.hidden = false; content.scrollIntoView({ block: "start" }); };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!isConfigured(CONFIG.formEndpoint)) { reveal(); return; }
      fetch(CONFIG.formEndpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } }).then(reveal).catch(reveal);
    });
  })();

  /* ---------- Insights filter ---------- */
  (function () {
    var bar = qs("[data-insight-filter]");
    if (!bar) return;
    var cards = qsa("[data-topic]");
    qsa(".chip", bar).forEach(function (chip) {
      chip.addEventListener("click", function () {
        qsa(".chip", bar).forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        var t = chip.getAttribute("data-filter");
        cards.forEach(function (c) { c.classList.toggle("is-hidden", t !== "all" && c.getAttribute("data-topic") !== t); });
      });
    });
  })();

  /* ---------- Services page scroll-spy ---------- */
  (function () {
    var links = qsa(".svc-nav a[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { links.forEach(function (a) { a.classList.remove("active"); }); var a = map[en.target.id]; if (a) a.classList.add("active"); }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  })();

  /* ============================================================
     DEADLINE ENGINE
     Federal filing calendar for calendar-year taxpayers. Dates that
     land on a weekend or federal holiday roll to the next business
     day, as the IRS does. Always confirm with your division; state
     and local deadlines differ.
     ============================================================ */
  var RULES = [
    { m: 1, d: 15, what: "Q4 estimated tax payment", detail: "Final estimated payment for the prior tax year (Form 1040-ES).", tags: ["personal", "business", "realestate"], prior: true },
    { m: 1, d: 31, what: "W-2s and 1099-NECs due", detail: "Furnish to recipients and file with the SSA/IRS. Other 1099s due to recipients.", tags: ["business", "payroll"] },
    { m: 1, d: 31, what: "Q4 payroll returns (Form 941)", detail: "Quarterly federal payroll tax return for October to December.", tags: ["payroll"] },
    { m: 3, d: 15, what: "S corporation and partnership returns", detail: "Forms 1120-S and 1065 due, or file Form 7004 for a six-month extension. K-1s to owners.", tags: ["business", "realestate"] },
    { m: 3, d: 15, what: "S corporation election deadline", detail: "Form 2553 due for the election to take effect this tax year.", tags: ["business"] },
    { m: 4, d: 15, what: "Individual returns and Q1 estimate", detail: "Form 1040 due (or Form 4868 extension). First-quarter estimated payment. Last day for prior-year IRA and HSA contributions.", tags: ["personal"] },
    { m: 4, d: 15, what: "Trust, estate, and C corporation returns", detail: "Forms 1041 and 1120 due, or extension request. Gift tax return (Form 709) also due.", tags: ["personal", "business", "trusts"] },
    { m: 4, d: 15, what: "FBAR (FinCEN 114)", detail: "Report foreign accounts over $10,000. Automatic extension to October 15.", tags: ["personal"] },
    { m: 4, d: 30, what: "Q1 payroll returns (Form 941)", detail: "Quarterly federal payroll tax return for January to March.", tags: ["payroll"] },
    { m: 5, d: 15, what: "Nonprofit information returns", detail: "Form 990 series due for calendar-year exempt organizations.", tags: ["business"] },
    { m: 6, d: 15, what: "Q2 estimated tax payment", detail: "Second-quarter estimated payment (Form 1040-ES). Also the due date for citizens living abroad.", tags: ["personal", "business", "realestate"] },
    { m: 7, d: 31, what: "Q2 payroll returns (Form 941)", detail: "Quarterly federal payroll tax return for April to June.", tags: ["payroll"] },
    { m: 9, d: 15, what: "Q3 estimated tax payment", detail: "Third-quarter estimated payment (Form 1040-ES).", tags: ["personal", "business", "realestate"] },
    { m: 9, d: 15, what: "Extended S corporation and partnership returns", detail: "Final deadline for Forms 1120-S and 1065 on extension.", tags: ["business", "realestate"] },
    { m: 9, d: 30, what: "Extended trust and estate returns", detail: "Final deadline for Form 1041 on extension.", tags: ["trusts", "personal"] },
    { m: 10, d: 15, what: "Extended individual and C corporation returns", detail: "Final deadline for Forms 1040 and 1120 on extension. FBAR extended deadline.", tags: ["personal", "business"] },
    { m: 10, d: 31, what: "Q3 payroll returns (Form 941)", detail: "Quarterly federal payroll tax return for July to September.", tags: ["payroll"] },
    { m: 11, d: 15, what: "Extended nonprofit returns", detail: "Final deadline for Form 990 on extension.", tags: ["business"] },
    { m: 12, d: 31, what: "Year-end planning cutoff", detail: "Last day for most current-year moves: charitable gifts, RMDs, 401(k) deferrals, tax-loss harvesting, and equipment placed in service.", tags: ["personal", "business", "realestate"], fixed: true }
  ];
  var TAG_LABEL = { personal: "Personal", business: "Business", realestate: "Real estate", trusts: "Trusts & estates", payroll: "Payroll" };

  function nthWeekday(y, m, weekday, n) { var d = new Date(y, m, 1); var add = (weekday - d.getDay() + 7) % 7; d.setDate(1 + add + (n - 1) * 7); return d; }
  function lastWeekday(y, m, weekday) { var d = new Date(y, m + 1, 0); var sub = (d.getDay() - weekday + 7) % 7; d.setDate(d.getDate() - sub); return d; }
  function observed(y, m, d) { var dt = new Date(y, m, d); if (dt.getDay() === 6) dt.setDate(dt.getDate() - 1); if (dt.getDay() === 0) dt.setDate(dt.getDate() + 1); return dt; }
  function holidays(y) {
    return [observed(y, 0, 1), nthWeekday(y, 0, 1, 3), nthWeekday(y, 1, 1, 3), lastWeekday(y, 4, 1), observed(y, 5, 19), observed(y, 6, 4),
      nthWeekday(y, 8, 1, 1), nthWeekday(y, 9, 1, 2), observed(y, 10, 11), nthWeekday(y, 10, 4, 4), observed(y, 11, 25),
      observed(y, 3, 16) /* DC Emancipation Day, which moves April 15 filings */
    ].map(function (d) { return d.toDateString(); });
  }
  function roll(date) {
    var hol = holidays(date.getFullYear());
    while (date.getDay() === 0 || date.getDay() === 6 || hol.indexOf(date.toDateString()) !== -1) date.setDate(date.getDate() + 1);
    return date;
  }
  function deadlinesFor(year) {
    return RULES.map(function (r) {
      var d = new Date(year, r.m - 1, r.d);
      if (!r.fixed) d = roll(d);
      return { date: d, what: r.what, detail: r.detail, tags: r.tags, year: year };
    });
  }
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function today() { var t = new Date(); t.setHours(0, 0, 0, 0); return t; }
  function daysUntil(d) { return Math.round((d - today()) / 86400000); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* Home page widget: next N deadlines */
  (function () {
    var list = qs("[data-upcoming-deadlines]");
    if (!list) return;
    var n = parseInt(list.getAttribute("data-upcoming-deadlines"), 10) || 4;
    var t = today(), y = t.getFullYear();
    var all = deadlinesFor(y).concat(deadlinesFor(y + 1)).filter(function (x) { return x.date >= t; });
    all.sort(function (a, b) { return a.date - b.date; });
    list.innerHTML = all.slice(0, n).map(function (x) {
      var du = daysUntil(x.date);
      var when = du === 0 ? "Today" : du === 1 ? "Tomorrow" : "In " + du + " days";
      return '<li><div class="dl-date"><b>' + MON[x.date.getMonth()] + " " + x.date.getDate() + "</b><small>" + x.date.getFullYear() + "</small></div>" +
        '<div class="dl-what"><strong>' + esc(x.what) + "</strong><span>" + esc(x.detail) + "</span></div>" +
        '<span class="dl-in' + (du <= 14 ? " soon" : "") + '">' + when + "</span></li>";
    }).join("");
  })();

  /* Full calendar page */
  (function () {
    var root = qs("[data-tax-calendar]");
    if (!root) return;
    var t = today(), y = t.getFullYear();
    var filters = qs("[data-cal-filters]");
    var yearLabel = qsa("[data-cal-year]");
    yearLabel.forEach(function (el) { el.textContent = y + " and " + (y + 1); });
    var active = "all";
    function render() {
      var items = deadlinesFor(y).concat(deadlinesFor(y + 1)).filter(function (x) { return active === "all" || x.tags.indexOf(active) !== -1; });
      // only show from the start of the current year through next year
      var byMonth = {};
      items.forEach(function (x) { var k = x.date.getFullYear() + "-" + x.date.getMonth(); (byMonth[k] = byMonth[k] || []).push(x); });
      var keys = Object.keys(byMonth).sort(function (a, b) { var pa = a.split("-"), pb = b.split("-"); return (pa[0] - pb[0]) || (pa[1] - pb[1]); });
      var html = "";
      var lastYear = null;
      keys.forEach(function (k) {
        var p = k.split("-"), yy = +p[0], mm = +p[1];
        if (yy !== lastYear) { html += '<h2 class="cal-year">' + yy + "</h2>"; lastYear = yy; }
        html += '<div class="cal-month"><h3>' + MONTHS[mm] + "</h3><ul>";
        byMonth[k].sort(function (a, b) { return a.date - b.date; }).forEach(function (x) {
          var past = x.date < t;
          html += '<li class="' + (past ? "past" : "") + '"><span class="c-date">' + MON[mm] + " " + x.date.getDate() + "</span>" +
            '<div class="c-what"><strong>' + esc(x.what) + "</strong><span>" + esc(x.detail) + "</span></div>" +
            '<span class="c-tag">' + x.tags.map(function (tg) { return TAG_LABEL[tg]; }).slice(0, 2).join(" / ") + "</span></li>";
        });
        html += "</ul></div>";
      });
      root.innerHTML = html;
    }
    if (filters) {
      qsa(".chip", filters).forEach(function (chip) {
        chip.addEventListener("click", function () {
          qsa(".chip", filters).forEach(function (c) { c.classList.remove("active"); });
          chip.classList.add("active");
          active = chip.getAttribute("data-filter");
          render();
        });
      });
    }
    render();
    // .ics export of upcoming deadlines
    var ics = qs("[data-ics]");
    if (ics) {
      ics.addEventListener("click", function () {
        var items = deadlinesFor(y).concat(deadlinesFor(y + 1)).filter(function (x) { return x.date >= t; });
        var pad = function (n) { return (n < 10 ? "0" : "") + n; };
        var fmt = function (d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()); };
        var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//KMM Tax Group//Tax Calendar//EN", "CALSCALE:GREGORIAN"];
        items.forEach(function (x, i) {
          var end = new Date(x.date); end.setDate(end.getDate() + 1);
          lines.push("BEGIN:VEVENT", "UID:kmm-" + fmt(x.date) + "-" + i + "@kmmtaxgroup", "DTSTAMP:" + fmt(t) + "T000000Z",
            "DTSTART;VALUE=DATE:" + fmt(x.date), "DTEND;VALUE=DATE:" + fmt(end),
            "SUMMARY:" + x.what.replace(/,/g, "\\,"), "DESCRIPTION:" + x.detail.replace(/,/g, "\\,") + " (KMM Tax Group tax calendar)", "END:VEVENT");
        });
        lines.push("END:VCALENDAR");
        var blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a"); a.href = url; a.download = "kmm-tax-calendar.ics"; document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 500);
      });
    }
  })();

  /* ============================================================
     DIVISION FINDER  (three questions, one recommendation)
     ============================================================ */
  (function () {
    var root = qs("[data-finder]");
    if (!root) return;
    var questions = qsa(".finder-q", root);
    var result = qs(".finder-result", root);
    var progress = qsa(".finder-progress i", root);
    var scores, step;
    var OUT = {
      "klein-muskat": { tag: "Recommended practice", title: "Klein Muskat", body: "Personal income tax, trusts, and estates. This practice handles individual and family returns, fiduciary filings, and the tax side of transferring wealth.", page: "klein-muskat.html" },
      "klein-mirsky": { tag: "Recommended practice", title: "Klein Mirsky", body: "Business tax and year-round bookkeeping. This practice keeps the books current and files business returns, payroll, and sales tax for owner-operated companies.", page: "klein-mirsky.html" },
      "klein-realestate": { tag: "Recommended practice", title: "Klein Real Estate", body: "Tax for investors, partnerships, and property entities: depreciation strategy, exchanges, cost segregation, and investor reporting.", page: "klein-realestate.html" },
      "multi": { tag: "More than one practice", title: "Coordinated service", body: "Your situation spans more than one practice. Start with a general inquiry and we will bring in the right specialists from each division.", page: "contact.html?division=general" }
    };
    function reset() {
      scores = { "klein-muskat": 0, "klein-mirsky": 0, "klein-realestate": 0 };
      step = 0;
      show();
    }
    function show() {
      questions.forEach(function (q, i) { q.classList.toggle("active", i === step); });
      result.classList.remove("active");
      progress.forEach(function (p, i) { p.classList.toggle("done", i < step); });
    }
    function finish() {
      var keys = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; });
      var top = keys[0], second = keys[1];
      var pick = (scores[top] > 0 && scores[second] >= scores[top] - 1 && scores[second] > 0) ? "multi" : top;
      var o = OUT[pick];
      qs(".fr-tag", result).textContent = o.tag;
      qs("h3", result).textContent = o.title;
      qs("p", result).textContent = o.body;
      qs(".fr-primary", result).setAttribute("href", o.page);
      var deptId = pick === "multi" ? "general" : pick;
      qs(".fr-contact", result).setAttribute("href", "contact.html?division=" + deptId + "#inquiry");
      questions.forEach(function (q) { q.classList.remove("active"); });
      progress.forEach(function (p) { p.classList.add("done"); });
      result.classList.add("active");
    }
    qsa(".finder-opts button", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var w = btn.getAttribute("data-weights") || "";
        w.split(",").forEach(function (pair) {
          var kv = pair.split(":"); if (kv.length === 2 && scores[kv[0]] !== undefined) scores[kv[0]] += parseFloat(kv[1]) || 0;
        });
        step++;
        if (step >= questions.length) finish(); else show();
      });
    });
    qsa(".finder-back", root).forEach(function (b) { b.addEventListener("click", reset); });
    reset();
  })();

  /* ---------- Footer year ---------- */
  (function () { var y = qs("#year"); if (y) y.textContent = new Date().getFullYear(); })();
})();
