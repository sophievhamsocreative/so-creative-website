// Creatorpagina: video's in telefoons afspelen en de strook met samenwerkingen
(function () {
  // Video's spelen af zodra je er met de muis overheen gaat (zonder geluid).
  // Klik = geluid aan/uit. Op touchscreens: tik = afspelen met geluid / pauzeren.
  var heeftHover = window.matchMedia('(hover: hover)').matches;
  function stopAndere(huidige) {
    document.querySelectorAll('.telefoon video').forEach(function (v) {
      if (v !== huidige) { v.pause(); v.muted = true; v.closest('.telefoon').classList.remove('speelt', 'geluid'); }
    });
  }
  function speel(tel, video) {
    stopAndere(video);
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
    tel.classList.add('speelt');
  }
  document.querySelectorAll('.telefoon').forEach(function (tel) {
    var video = tel.querySelector('video');
    var scherm = tel.querySelector('.tel-scherm');
    if (!video || !scherm) return;
    video.muted = true;
    if (heeftHover) {
      scherm.addEventListener('mouseenter', function () { speel(tel, video); });
      scherm.addEventListener('mouseleave', function () { video.pause(); tel.classList.remove('speelt'); });
      scherm.addEventListener('click', function () {
        video.muted = !video.muted;
        tel.classList.toggle('geluid', !video.muted);
        if (video.paused) speel(tel, video);
      });
    } else {
      scherm.addEventListener('click', function () {
        if (video.paused) { video.muted = false; tel.classList.add('geluid'); speel(tel, video); }
        else { video.pause(); tel.classList.remove('speelt'); }
      });
    }
  });

  // Pijlknoppen schuiven de strook één kaart op
  var strook = document.querySelector('.strook');
  document.querySelectorAll('.strook-knop').forEach(function (k) {
    k.addEventListener('click', function () {
      if (!strook) return;
      var kaart = strook.querySelector('.collab');
      var stap = kaart ? kaart.getBoundingClientRect().width + 26 : 260;
      strook.scrollBy({ left: stap * Number(k.getAttribute('data-richting')), behavior: 'smooth' });
    });
  });
})();

// ==========================================================================
// Mediakit downloaden na het achterlaten van een e-mailadres
//
// OPSLAAN VAN E-MAILADRESSEN: nu worden de gegevens alleen in de browser
// gecontroleerd. Wil je ze bewaren, koppel dan hieronder bij `bewaar()` een
// opslag, bijvoorbeeld een Supabase-tabel "mediakit_aanvragen" (zie workshop).
// Zet nooit geheime sleutels (service-role key) in deze file.
// ==========================================================================
(function () {
  var dialog = document.getElementById('mediakit-dialog');
  if (!dialog) return;
  var form = dialog.querySelector('form');
  var fout = dialog.querySelector('.mk-fout');
  var huidig = { url: '', creator: '' };

  function stap(naam) {
    dialog.querySelectorAll('.mk-stap').forEach(function (s) { s.hidden = s.getAttribute('data-stap') !== naam; });
  }

  document.querySelectorAll('[data-mediakit]').forEach(function (knop) {
    knop.addEventListener('click', function () {
      huidig.url = knop.getAttribute('data-mediakit');
      huidig.creator = knop.getAttribute('data-creator') || '';
      dialog.querySelector('[data-mk-naam]').textContent = huidig.creator;
      dialog.querySelector('[data-mk-link]').setAttribute('href', huidig.url);
      fout.hidden = true; form.reset(); stap('invullen');
      if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', '');
      setTimeout(function () { document.getElementById('mk-mail').focus(); }, 50);
    });
  });

  dialog.querySelectorAll('[data-sluit]').forEach(function (k) { k.addEventListener('click', function () { dialog.close(); }); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });

  function bewaar(gegevens) {
    // TODO: koppel hier je opslag, bijvoorbeeld:
    // return supabase.from('mediakit_aanvragen').insert(gegevens);
    return Promise.resolve();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var mail = document.getElementById('mk-mail');
    var akkoord = document.getElementById('mk-akkoord');
    if (!mail.value || !mail.checkValidity()) { fout.textContent = 'Vul een geldig e-mailadres in, bijvoorbeeld naam@merk.nl.'; fout.hidden = false; mail.focus(); return; }
    if (!akkoord.checked) { fout.textContent = 'Vink het vakje aan om de mediakit te downloaden.'; fout.hidden = false; return; }
    fout.hidden = true;
    bewaar({
      creator: huidig.creator,
      naam: document.getElementById('mk-naam').value,
      merk: document.getElementById('mk-merk').value,
      email: mail.value,
      datum: new Date().toISOString()
    }).then(function () {
      var a = document.createElement('a');
      a.href = huidig.url; a.download = ''; document.body.appendChild(a); a.click(); a.remove();
      stap('klaar');
    });
  });
})();
