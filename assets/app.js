/* ============================================================
   KMM TAX GROUP, shared behavior for the multi-page site.
   Progressive enhancement: every page works without JS; this
   layer adds the menu, dropdown, reveals, counters, and form.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Analytics (off until you add an ID) ---------- */
  (function () {
    var GA_ID = ""; // <-- paste your GA4 Measurement ID here, e.g. "G-XXXXXXXXXX"
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

  /* ---------- Mobile menu ---------- */
  var navLinks = document.getElementById("navLinks");
  var toggle = document.getElementById("menuToggle");
  if (toggle && navLinks) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Active nav state (by current path) ---------- */
  (function setActiveNav() {
    if (!navLinks) return;
    var here = location.pathname.split("/").pop() || "index.html";
    var links = navLinks.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      if (!href || href.charAt(0) === "#" || /^https?:/i.test(href)) continue;
      var target = href.split("/").pop();
      if (target === here) links[i].classList.add("active");
    }
  })();

  /* ---------- Client-login dropdown ---------- */
  (function () {
    var dd = document.querySelector(".has-dropdown");
    if (!dd) return;
    var trigger = dd.querySelector(".dropdown-trigger");
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = dd.classList.toggle("open");
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (dd.classList.contains("open") && !dd.contains(e.target)) {
        dd.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  })();

  /* ---------- Scroll reveal ---------- */
  (function () {
    var reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      for (var i = 0; i < reveals.length; i++) reveals[i].classList.add("is-visible");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    for (var j = 0; j < reveals.length; j++) io.observe(reveals[j]);
  })();

  /* ---------- Animated counters ---------- */
  (function () {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length || !("IntersectionObserver" in window)) {
      // fallback: show final value immediately
      counters.forEach && counters.forEach(function (c) { c.textContent = c.getAttribute("data-count"); });
      return;
    }
    var run = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
      var dur = 1400, start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals);
      };
      requestAnimationFrame(step);
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    for (var i = 0; i < counters.length; i++) io.observe(counters[i]);
  })();

  /* ---------- FAQ accordion ---------- */
  (function () {
    var items = document.querySelectorAll(".faq-item");
    for (var i = 0; i < items.length; i++) {
      (function (item) {
        var q = item.querySelector(".faq-q");
        var a = item.querySelector(".faq-a");
        if (!q || !a) return;
        q.setAttribute("aria-expanded", "false");
        q.addEventListener("click", function () {
          var isOpen = item.classList.toggle("open");
          q.setAttribute("aria-expanded", isOpen ? "true" : "false");
          a.style.maxHeight = isOpen ? a.scrollHeight + "px" : null;
        });
      })(items[i]);
    }
  })();

  /* ---------- Contact form ---------- */
  (function () {
    var form = document.getElementById("contactForm");
    if (!form) return;

    // Preselect a division from ?division=... (set by "Contact <division>" buttons)
    var params = new URLSearchParams(location.search);
    var pre = params.get("division");
    if (pre) {
      var sel = document.getElementById("division");
      if (sel) sel.value = pre;
    }

    var success = document.getElementById("formSuccess");
    form.addEventListener("submit", function (e) {
      var action = form.getAttribute("action") || "";
      // If a real endpoint isn't wired yet, confirm on-screen instead of a broken POST.
      var unconfigured = action === "" || action.indexOf("REPLACE_WITH_FORM_ID") !== -1;
      if (unconfigured) {
        e.preventDefault();
        form.style.display = "none";
        if (success) success.classList.add("show");
        return;
      }
      // Real Formspree endpoint: submit via fetch for an inline success state.
      e.preventDefault();
      var btn = form.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; btn.querySelector("span") && (btn.querySelector("span").textContent = "Sending…"); }
      fetch(action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (res) {
          if (res.ok) {
            form.style.display = "none";
            if (success) success.classList.add("show");
          } else {
            throw new Error("Submission failed");
          }
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.querySelector("span") && (btn.querySelector("span").textContent = "Send inquiry"); }
          alert("Sorry, something went wrong sending your message. Please call or email us directly.");
        });
    });
  })();

  /* ---------- Lead-magnet gate (year-end checklist) ---------- */
  (function () {
    var gate = document.getElementById("checklistGate");
    var content = document.getElementById("checklistContent");
    var form = document.getElementById("checklistForm");
    if (!gate || !content || !form) return;
    gate.hidden = false;
    content.hidden = true;
    var reveal = function () {
      gate.hidden = true;
      content.hidden = false;
      content.scrollIntoView({ block: "start" });
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var action = form.getAttribute("action") || "";
      if (action === "" || action.indexOf("REPLACE_WITH_FORM_ID") !== -1) { reveal(); return; }
      fetch(action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function () { reveal(); })
        .catch(function () { reveal(); });
    });
  })();

  /* ---------- Footer year ---------- */
  (function () {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  })();
})();
