(function () {
  "use strict";

  const CONTACT_EMAIL = "hello@burnlow.in";
  const SPRINT_FEE = 85000;
  const MIN_SENSIBLE_SPEND = 300000;

  // Mobile navigation
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Savings calculator
  const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
  const spendEl = document.getElementById("spend");
  const pctEl = document.getElementById("pct");
  const pctOut = document.getElementById("pct-out");
  const rMonth = document.getElementById("r-month");
  const rYear = document.getElementById("r-year");
  const rRoi = document.getElementById("r-roi");
  const rVerdict = document.getElementById("r-verdict");

  function updateCalc() {
    const spend = Math.max(0, Number(spendEl.value) || 0);
    const pct = Number(pctEl.value) / 100;
    const monthly = spend * pct;
    const yearly = monthly * 12;
    const roi = yearly / SPRINT_FEE;

    pctOut.textContent = Math.round(pct * 100) + "%";
    rMonth.textContent = inr.format(monthly);
    rYear.textContent = inr.format(yearly);
    rRoi.textContent = roi.toFixed(1) + "×";

    rVerdict.classList.remove("warn");
    if (spend === 0) {
      rVerdict.textContent = "Enter your monthly spend to see an estimate.";
    } else if (spend < MIN_SENSIBLE_SPEND || roi < 3) {
      rVerdict.textContent = "A sprint may not pay back yet. Start with Databricks' built-in budgets and cost dashboards.";
      rVerdict.classList.add("warn");
    } else {
      rVerdict.textContent = "A sprint is likely to pay back comfortably.";
    }
  }

  if (spendEl && pctEl) {
    spendEl.addEventListener("input", updateCalc);
    pctEl.addEventListener("input", updateCalc);
    updateCalc();
  }

  // Contact form: compose an email instead of posting to a server
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();

      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        note.textContent = "Please add your name and a valid work email.";
        note.classList.add("error");
        return;
      }
      note.classList.remove("error");
      note.textContent = "Opening your email app…";

      const company = String(data.get("company") || "").trim();
      const subject = "Fit call request" + (company ? " · " + company : "");
      const body = [
        "Name: " + name,
        "Email: " + email,
        "Company: " + (company || "-"),
        "Monthly Databricks spend: " + data.get("spend"),
        "",
        String(data.get("message") || "").trim(),
      ].join("\n");

      window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
