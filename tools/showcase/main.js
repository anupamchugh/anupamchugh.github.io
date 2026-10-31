// One authored moment: the lit panes brighten slowly once, after the page has loaded.
// The page is fully lit without this script, and under reduced motion the "dim" class is never added.
(function () {
  var root = document.documentElement;
  function brighten() { root.classList.remove("dim"); }
  if (document.readyState === "complete") {
    setTimeout(brighten, 120);
  } else {
    window.addEventListener("load", function () { setTimeout(brighten, 120); });
  }
  setTimeout(brighten, 2500); // never leave the wall dim if load stalls
})();

// On a phone the screen galleries and the Glint chart block start folded so the page stays short; without this script they are open.
(function () {
  if (!window.matchMedia || !matchMedia("(max-width: 880px)").matches) return;
  var g = document.querySelectorAll("details.p-gallery, details.fold");
  for (var i = 0; i < g.length; i++) g[i].removeAttribute("open");
})();

// Work with me: a dialog that builds a mailto: draft in the visitor's own mail app. The page sends nothing.
// Without this script the "Work with me" links are plain mailto: links.
(function () {
  var modal = document.getElementById("contact-modal");
  var form = document.getElementById("contact-form");
  if (!modal || !form) return;
  var status = document.getElementById("contact-status");
  var from = document.getElementById("contact-from");
  var opener = null;
  var root = document.documentElement;

  window.openContactModal = function (e) {
    if (e) e.preventDefault();
    opener = document.activeElement;
    modal.hidden = false;
    root.classList.add("modal-open");
    from.focus();
  };
  window.closeContactModal = function () {
    modal.hidden = true;
    root.classList.remove("modal-open");
    if (opener && opener.focus) opener.focus();
  };

  modal.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close")) window.closeContactModal();
  });
  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") { window.closeContactModal(); return; }
    if (e.key !== "Tab") return;
    var items = modal.querySelectorAll("a[href], button, input, textarea");
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var who = from.value.trim();
    var msg = document.getElementById("contact-msg").value.trim();
    var subject = encodeURIComponent("Work with me");
    var body = encodeURIComponent("From: " + who + "\n\n" + msg + "\n\nSent via anupamchugh.github.io");
    window.location.href = "mailto:anupamchugh@gmail.com?subject=" + subject + "&body=" + body;
    status.textContent = "Your email app should open with a draft. Nothing is sent until you choose to send it.";
  });

  var copy = document.getElementById("contact-copy");
  if (copy) copy.addEventListener("click", function () {
    var done = function () { status.textContent = "Address copied: anupamchugh@gmail.com"; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText("anupamchugh@gmail.com").then(done, function () { status.textContent = "Select the address above and copy it."; });
    else status.textContent = "Select the address above and copy it.";
  });
})();

// The floating "Work with me" pane steps aside while one of the page's own two is on screen.
(function () {
  var dock = document.querySelector(".dock");
  if (!dock || !("IntersectionObserver" in window)) return;
  var visible = new Map();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { visible.set(en.target, en.isIntersecting); });
    var any = false;
    visible.forEach(function (v) { if (v) any = true; });
    dock.classList.toggle("is-away", any);
  });
  document.querySelectorAll(".p-cta, .p-go").forEach(function (el) { io.observe(el); });
})();
