// So Creative Management — gedeelde scripts voor alle pagina's

// Mobiel menu openen/sluiten
(function () {
  var menu = document.getElementById('mobiel-menu');
  if (!menu) return;
  var knoppen = document.querySelectorAll('[data-menu-toggle]');

  function zet(open) {
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    knoppen.forEach(function (k) { k.setAttribute('aria-expanded', open); });
  }

  knoppen.forEach(function (k) {
    k.addEventListener('click', function () { zet(!menu.classList.contains('open')); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') zet(false); });
})();

// Jaartal in de footer automatisch bijwerken
document.querySelectorAll('[data-jaar]').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Nieuwe pagina altijd bovenaan openen (behalve bij een link naar een #anker)
(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  function naarBoven() {
    if (location.hash && document.getElementById(location.hash.slice(1))) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
  naarBoven();
  window.addEventListener('pageshow', naarBoven);
})();

// Op telefoons (touch): fotorij en logobalken zelf kunnen swipen, en daarna weer vanzelf verder lopen
window.addEventListener('load', function () {
  if (!window.matchMedia('(hover: none)').matches) return;
  var stil = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var paren = [];
  document.querySelectorAll('.feed').forEach(function (b) { var r = b.querySelector('.feed-rij'); if (r) paren.push([b, r, 30]); });
  document.querySelectorAll('.merken').forEach(function (b) { var r = b.querySelector('.marquee'); if (r) paren.push([b, r, 25]); });
  paren.forEach(function (p) {
    var bak = p[0], rij = p[1], snelheid = p[2];
    bak.classList.add('swipe');
    var pos = 0, wacht = 0, aanraken = false, vorige = null;
    bak.addEventListener('touchstart', function () { aanraken = true; }, { passive: true });
    bak.addEventListener('touchend', function () { aanraken = false; wacht = 2500; }, { passive: true });
    bak.addEventListener('scroll', function () { if (aanraken || wacht > 0) pos = bak.scrollLeft; }, { passive: true });
    function stap(t) {
      var dt = vorige === null ? 0 : Math.min(t - vorige, 100); vorige = t;
      var helft = rij.scrollWidth / 2;
      if (wacht > 0) wacht -= dt;
      if (!aanraken && wacht <= 0 && !stil && !bak.classList.contains('gepauzeerd')) {
        pos += snelheid * dt / 1000;
        bak.scrollLeft = pos;
      }
      // eindeloos rondlopen: de inhoud staat er twee keer in
      if (helft > 0 && !aanraken) {
        if (bak.scrollLeft >= helft) { bak.scrollLeft -= helft; pos = bak.scrollLeft; }
        else if (bak.scrollLeft <= 0 && wacht > 0) { bak.scrollLeft += helft; pos = bak.scrollLeft; }
      }
      requestAnimationFrame(stap);
    }
    requestAnimationFrame(stap);
  });
});
