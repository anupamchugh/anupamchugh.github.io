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
