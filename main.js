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

// Handgeschreven "rewrite" (pen-animatie)
// De pennenstreken stonden in een SVG-masker; Safari (iPhone) ververst bewegende
// maskers niet, waardoor het woord rommelig verscheen. Nu tekenen we de streken
// zelf zichtbaar en knippen ze bij met een vaste clipPath in de vorm van de
// letters. Dat werkt in alle browsers. Na afloop komen de echte letters terug,
// zodat het eindbeeld altijd scherp is.
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  document.querySelectorAll('svg.pen').forEach(function (svg, n) {
    var letters = svg.querySelector('g[mask]');
    var streken = svg.querySelector('.pen-streken');
    var defs = svg.querySelector('defs');
    if (!letters || !streken || !defs) return;

    var clip = document.createElementNS(NS, 'clipPath');
    clip.setAttribute('id', 'pen-clip-' + n);
    clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
    letters.querySelectorAll('path').forEach(function (p) { clip.appendChild(p.cloneNode(true)); });
    defs.appendChild(clip);

    var lijnen = streken.querySelectorAll('path');
    lijnen.forEach(function (p) {
      var l = p.getTotalLength ? p.getTotalLength() : 0;
      if (!l) return;
      p.removeAttribute('pathLength');
      p.style.strokeDasharray = l + ' ' + l;
      p.style.strokeDashoffset = l;
    });
    streken.setAttribute('stroke', 'currentColor');
    streken.setAttribute('clip-path', 'url(#pen-clip-' + n + ')');
    svg.appendChild(streken);              // uit het masker, gewoon zichtbaar
    letters.removeAttribute('mask');
    letters.style.opacity = '0';

    function klaar() {
      letters.style.opacity = '';
      streken.style.display = 'none';
    }
    var nog = lijnen.length;
    lijnen.forEach(function (p) {
      p.addEventListener('animationend', function () { if (--nog <= 0) klaar(); });
    });
    setTimeout(klaar, 8000); // vangnet
  });
})();
