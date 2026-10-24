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

// On a phone the screen galleries start folded so the page stays short; without this script they are open.
(function () {
  if (!window.matchMedia || !matchMedia("(max-width: 880px)").matches) return;
  var g = document.querySelectorAll("details.p-gallery");
  for (var i = 0; i < g.length; i++) g[i].removeAttribute("open");
})();
