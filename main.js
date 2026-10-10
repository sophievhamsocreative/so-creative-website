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
