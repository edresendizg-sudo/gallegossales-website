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

  /* ---- Lead / warranty forms (AJAX submit + graceful fallback) ----
     Any <form class="lead-form"> is enhanced (contact, warranty
     registration, warranty claims). Posts to its own `action`
     (Web3Forms). A per-form success line can be set via data-success.
     Status is shown in the form's own .form-status element; file
     uploads are supported. */
  var forms = document.querySelectorAll("form.lead-form");
  Array.prototype.forEach.call(forms, function (form) {
    var status = form.querySelector(".form-status");
    var successMsg = form.getAttribute("data-success") ||
      "Thank you — your submission has been received. We'll be in touch shortly.";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var endpoint = form.getAttribute("action") || "";
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
              status.textContent = successMsg;
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
  });
})();
