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

// Fotorij en logobalken: zelf kunnen scrollen (telefoon: swipen; laptop: trackpad, shift+scrollwiel
// of slepen met de muis) en daarna weer vanzelf verder lopen
window.addEventListener('load', function () {
  var stil = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var paren = [];
  document.querySelectorAll('.feed').forEach(function (b) { var r = b.querySelector('.feed-rij'); if (r) paren.push([b, r, 30]); });
  document.querySelectorAll('.merken').forEach(function (b) { var r = b.querySelector('.marquee'); if (r) paren.push([b, r, 25]); });
  paren.forEach(function (p) {
    var bak = p[0], rij = p[1], snelheid = p[2];
    bak.classList.add('swipe');
    var pos = 0, wacht = 0, bezig = false, boven = false, vorige = null;
    // lengte van één ronde = waar de eerste kopie begint (de inhoud staat er meerdere keren in)
    function ronde() {
      var kids = rij.children, eerste = kids[0], i, k;
      function x(el) { if (getComputedStyle(el).display === 'contents') el = el.firstElementChild; return el ? el.offsetLeft - eerste.offsetLeft : 0; }
      for (i = 1; i < kids.length; i++) { k = kids[i]; if (k.getAttribute('aria-hidden') === 'true') return x(k); }
      for (i = 1; i < kids.length; i++) { k = kids[i]; if (k.getAttribute('alt') === '') return x(k); }
      return rij.scrollWidth / 2;
    }
    function los() { bezig = false; wacht = 2500; }
    // telefoon
    bak.addEventListener('touchstart', function () { bezig = true; }, { passive: true });
    bak.addEventListener('touchend', los, { passive: true });
    // laptop: muis erboven = pauze, trackpad/shift+scroll = zelf scrollen
    bak.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') boven = true; });
    bak.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { boven = false; if (!bezig) wacht = 1200; } });
    bak.addEventListener('wheel', function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) wacht = 2500; }, { passive: true });
    // laptop: slepen met de muis
    var sleepX = null, sleepStart = 0, gesleept = false;
    bak.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      sleepX = e.clientX; sleepStart = bak.scrollLeft; gesleept = false; bezig = true;
      bak.classList.add('sleept');
    });
    window.addEventListener('pointermove', function (e) {
      if (sleepX === null) return;
      var dx = e.clientX - sleepX;
      if (Math.abs(dx) > 4) gesleept = true;
      bak.scrollLeft = sleepStart - dx; pos = bak.scrollLeft;
    });
    window.addEventListener('pointerup', function () {
      if (sleepX === null) return;
      sleepX = null; bak.classList.remove('sleept'); los();
    });
    bak.addEventListener('click', function (e) { if (gesleept) { e.preventDefault(); e.stopPropagation(); gesleept = false; } }, true);
    bak.addEventListener('dragstart', function (e) { e.preventDefault(); });
    bak.addEventListener('scroll', function () { if (bezig || boven || wacht > 0) pos = bak.scrollLeft; }, { passive: true });
    function stap(t) {
      var dt = vorige === null ? 0 : Math.min(t - vorige, 100); vorige = t;
      var helft = ronde();
      if (wacht > 0 && !boven) wacht -= dt;
      if (!bezig && !boven && wacht <= 0 && !stil && !bak.classList.contains('gepauzeerd')) {
        pos += snelheid * dt / 1000;
        bak.scrollLeft = pos;
      }
      // eindeloos rondlopen
      if (helft > 0 && sleepX === null) {
        if (bak.scrollLeft >= helft) { bak.scrollLeft -= helft; pos = bak.scrollLeft; if (sleepX !== null) sleepStart -= helft; }
        else if (bak.scrollLeft <= 0 && (wacht > 0 || boven || bezig)) { bak.scrollLeft += helft; pos = bak.scrollLeft; }
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
// letters. Na afloop komen de echte letters terug, zodat het eindbeeld scherp is.
// Op iPhone/Safari bleef ook dat haperen; daar verschijnt het woord letter voor letter.
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  document.querySelectorAll('svg.pen').forEach(function (svg, n) {
    var letters = svg.querySelector('g[mask]');
    var streken = svg.querySelector('.pen-streken');
    var defs = svg.querySelector('defs');
    if (!letters || !streken || !defs) return;

    // iPhone/Safari: letter voor letter laten verschijnen (geen masker of clipPath nodig)
    var ua = navigator.userAgent;
    if (/AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|OPR|Android/.test(ua)) {
      letters.removeAttribute('mask');
      streken.parentNode.removeChild(streken);
      letters.querySelectorAll('path').forEach(function (p, i) {
        var g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'pen-letter');
        g.style.animationDelay = (0.4 + i * 0.13) + 's';
        p.parentNode.insertBefore(g, p);
        g.appendChild(p);
      });
      return;
    }

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
