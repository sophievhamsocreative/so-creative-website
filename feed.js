// ==========================================================================
// Social feed in de hero van de homepagina
//
// FOTO TOEVOEGEN: zet de foto in assets/images/feed/ en voeg hieronder een
// regel toe. De hartjes, like-meldingen en andere icoontjes worden
// automatisch afwisselend rond de foto's gezet.
//
// INDELING: hoe de foto's staan — 'speels', 'golf' of 'polaroid'
// ==========================================================================

var INDELING = 'speels';

var FEED = [
  'assets/images/feed/team.jpg',
  'assets/images/feed/salsa-shop.jpg',
  'assets/images/feed/koen-boek.jpg',
  'assets/images/feed/trio.jpg',
  'assets/images/feed/koen-podium.jpg',
  'assets/images/feed/boeklancering.jpg',
  'assets/images/feed/event-duo.jpg',
  'assets/images/feed/malcom-event.jpg'
];

// ---------- Hieronder niets aanpassen ----------
(function () {
  var rij = document.getElementById('feed-rij');
  if (!rij) return;

  function svg(naam, vol) { return '<svg class="icoon' + (vol ? ' vol' : '') + '"><use href="#i-' + naam + '"/></svg>'; }
  function deco(klassen, inhoud) { return '<span class="deco ' + klassen + '" aria-hidden="true">' + inhoud + '</span>'; }
  var los = function (naam, klassen, vol) { return deco('d-los ' + klassen, svg(naam, vol)); };
  var melding = function (pos) { return deco('d-melding ' + pos, svg('hart', true) + svg('reactie', true)); };

  // Vier patronen die om en om terugkomen
  var patronen = [
    function () { return los('hart', 'p-rb r1', true) + los('reactie', 'p-lo mid r2'); },
    function () { return melding('p-lb') + los('deel', 'p-ro mid r4'); },
    function () { return los('bewaar', 'p-rb klein r3') + los('hart', 'p-lo klein r2', true) + los('hart', 'p-lm klein r1'); },
    function () { return los('hart', 'p-lb r2', true) + melding('p-ro'); }
  ];

  // h = hoogte, r = draaiing, y = verschuiving omhoog/omlaag, m = overlap, v = vierkant
  var INDELINGEN = {
    speels: [
      { h: 330, r: -4, y: 10 }, { h: 250, r: 5, y: 70, m: -24 }, { h: 390, r: -2, y: -14 }, { h: 270, r: 3, y: 46, m: -14, v: 1 },
      { h: 340, r: -5, y: 4 }, { h: 230, r: 4, y: 80, m: -28 }, { h: 370, r: 2, y: -8 }, { h: 260, r: -3, y: 56, m: -10, v: 1 }
    ],
    golf: [
      { h: 300, y: 40 }, { h: 390, y: -16 }, { h: 240, y: 76, v: 1 }, { h: 350, y: 0 },
      { h: 280, y: 54 }, { h: 410, y: -24 }, { h: 250, y: 66, v: 1 }, { h: 330, y: 10 }
    ],
    polaroid: [
      { h: 320, r: -6, y: 10 }, { h: 300, r: 4, y: 40, m: -40, z: 2 }, { h: 340, r: -3, y: -6, m: -30 }, { h: 290, r: 7, y: 36, m: -40, z: 2, v: 1 },
      { h: 330, r: -5, y: 6, m: -30 }, { h: 300, r: 3, y: 44, m: -40, z: 2 }, { h: 350, r: -7, y: -4, m: -30 }, { h: 290, r: 5, y: 30, m: -40, z: 2, v: 1 }
    ]
  };
  var indeling = INDELINGEN[INDELING] ? INDELING : 'speels';
  var feedEl = document.querySelector('.feed');
  if (feedEl) feedEl.classList.add('indeling-' + indeling);
  var plek = INDELINGEN[indeling];

  var html = FEED.map(function (foto, i) {
    var p = plek[i % plek.length];
    var stijl = '--h:' + p.h + 'px;--r:' + (p.r || 0) + 'deg;--y:' + (p.y || 0) + 'px;--m:' + (p.m || 0) + 'px;--z:' + (p.z || 1);
    return '<div class="fitem' + (p.v ? ' vierkant' : '') + '" style="' + stijl + '">' +
      '<img src="' + foto + '" alt="" loading="lazy">' +
      patronen[i % patronen.length]() +
      '</div>';
  }).join('');

  // Twee keer achter elkaar, zodat de rij eindeloos doorloopt
  rij.innerHTML = html + html.replace(/<div class="fitem/g, '<div aria-hidden="true" class="fitem');
})();

// Feed stilzetten zodra de merkenbalk in beeld is (weer verder bij terugscrollen)
(function () {
  var feed = document.querySelector('.feed');
  var merken = document.querySelector('.merken');
  if (!feed || !merken || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function (items) {
    feed.classList.toggle('gepauzeerd', items[0].isIntersecting);
  }, { threshold: 0.6 }).observe(merken);
})();
