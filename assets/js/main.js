/* ============================================================
   AFB Trade & Services Inc. — shared site script
   Vanilla JS, no dependencies.
   ------------------------------------------------------------ */
(function () {
  "use strict";

  /* ---------- 1. Mobile nav drawer ---------------------------- */
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");
  const body = document.body;

  window.toggleMobileNav = function () {
    if (!hamburger || !mobileNav) return;
    const open = mobileNav.classList.toggle("is-open");
    hamburger.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    body.style.overflow = open ? "hidden" : "";
  };

  if (hamburger) {
    hamburger.addEventListener("click", window.toggleMobileNav);
  }
  // Close mobile nav when a link is tapped
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        if (hamburger) hamburger.classList.remove("is-open");
        body.style.overflow = "";
      });
    });
  }

  /* ---------- 2. Sticky header state shift -------------------- */
  const header = document.querySelector(".site-header");
  const updateHeader = function () {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- 3. Scroll-reveal -------------------------------- */
  const revealTargets = document.querySelectorAll(".animate-on-scroll");
  if ("IntersectionObserver" in window && revealTargets.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });

    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 4. Destinations region filter ------------------- */
  const filterBar = document.querySelector(".filter-bar");
  const filterCards = document.querySelectorAll("[data-region]");
  if (filterBar && filterCards.length) {
    filterBar.addEventListener("click", function (e) {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      const region = btn.dataset.filter;

      filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });

      filterCards.forEach(function (card) {
        const matches = region === "all" || card.dataset.region === region;
        card.style.display = matches ? "" : "none";
      });
    });
  }

  /* ---------- 5. FAQ accordion -------------------------------- */
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      const item = q.closest(".faq-item");
      if (!item) return;
      const willOpen = !item.classList.contains("is-open");
      // close all
      item.parentElement.querySelectorAll(".faq-item").forEach(function (i) {
        i.classList.remove("is-open");
        const qi = i.querySelector(".faq-q");
        if (qi) qi.setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        item.classList.add("is-open");
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- 6. Animated counters (About stats) -------------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
    const animate = function (el) {
      const target = parseFloat(el.dataset.count) || 0;
      const duration = parseInt(el.dataset.duration, 10) || 1800;
      const decimals = parseInt(el.dataset.decimals, 10) || 0;
      const start = performance.now();
      const tick = function (now) {
        const p = Math.min((now - start) / duration, 1);
        const value = target * easeOut(p);
        el.textContent = value.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString(undefined, {
          minimumFractionDigits: decimals, maximumFractionDigits: decimals
        });
      };
      requestAnimationFrame(tick);
    };
    const countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          countIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    counters.forEach(function (c) { countIO.observe(c); });
  }

  /* ---------- 7. Smooth-scroll for in-page anchors ------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    const href = a.getAttribute("href");
    if (!href || href === "#" || href.length < 2) return;
    a.addEventListener("click", function (e) {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = (document.querySelector(".site-header")?.offsetHeight || 0) + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: "smooth" });
      // Update hash without jumping
      if (history.replaceState) history.replaceState(null, "", href);
    });
  });

  /* ---------- 8. Footer copyright year ------------------------ */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- 9. Newsletter form (placeholder handler) -------- */
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = newsletterForm.querySelector("input[type=email]");
      const btn = newsletterForm.querySelector("button");
      if (!input || !input.value) return;
      // Visual confirmation only — wire up a backend / Mailchimp later.
      if (btn) btn.textContent = "Subscribed ✓";
      input.value = "";
      setTimeout(function () { if (btn) btn.textContent = "Subscribe"; }, 3200);
    });
  }

  /* ---------- 10. Contact form (mailto fallback) -------------- */
  // The contact form submits via mailto: as set in HTML — this is a
  // soft fallback to validate inputs before triggering the mail client.
  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      if (!contactForm.checkValidity()) {
        e.preventDefault();
        contactForm.reportValidity();
      }
    });
  }

})();
