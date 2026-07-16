/* Gallegos Trailer Sales — light progressive enhancement, no dependencies. */
(function () {
  "use strict";

  /* ---- Mobile navigation toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Close menu when a link is tapped (mobile)
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Contact form (AJAX submit + graceful fallback) ----
     Works out of the box with Formspree. Set the form's `action`
     to your endpoint (see /contact/index.html). If no JS endpoint
     is configured, the form still submits normally. */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var endpoint = form.getAttribute("action") || "";
    var isConfigured = endpoint && endpoint.indexOf("YOUR_FORM_ID") === -1;

    form.addEventListener("submit", function (e) {
      if (!isConfigured) return; // let the browser handle it (or configure endpoint)
      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      var original = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      if (status) { status.className = "form-status"; status.textContent = ""; }

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            if (status) {
              status.className = "form-status ok";
              status.textContent = "Thank you — your message has been sent. We'll be in touch shortly.";
            }
          } else {
            throw new Error("Request failed");
          }
        })
        .catch(function () {
          if (status) {
            status.className = "form-status err";
            status.innerHTML = "Something went wrong. Please call us at " +
              '<a href="tel:+19563785818">956-378-5818</a> or message us on WhatsApp.';
          }
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = original; }
        });
    });
  }
})();
