// Contactpagina: wisselen tussen formulier voor merken en voor creators
(function () {
  var knoppen = document.querySelectorAll('.wie-keuze [data-wie]');
  function kies(wie) {
    knoppen.forEach(function (k) {
      var actief = k.getAttribute('data-wie') === wie;
      k.setAttribute('aria-selected', actief);
      document.getElementById('form-' + k.getAttribute('data-wie')).hidden = !actief;
    });
  }
  knoppen.forEach(function (k) { k.addEventListener('click', function () { kies(k.getAttribute('data-wie')); }); });
  // contact.html#creator opent meteen het creatorformulier (handig voor een link vanaf de homepagina)
  if (location.hash === '#creator') kies('creator');

  // Versturen: opent een kant-en-klare e-mail (later eventueel via Supabase)
  document.querySelectorAll('.contact-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form), regels = {};
      data.forEach(function (v, k) { if (v) regels[k] = regels[k] ? regels[k] + ', ' + v : v; });
      var tekst = Object.keys(regels).map(function (k) { return k + ': ' + regels[k]; }).join('\n');
      var naam = regels['Merk'] || regels['Handle'] || regels['Naam'] || '';
      window.location.href = 'mailto:sophie@socreativemanagement.com?subject=' +
        encodeURIComponent(form.getAttribute('data-onderwerp') + ' – ' + naam) + '&body=' + encodeURIComponent(tekst);
      var p = document.createElement('p'); p.className = 'form-bedankt';
      p.textContent = 'Je e-mailprogramma opent met je bericht. Verstuur de mail om je aanvraag af te ronden. Lukt dat niet? Mail ons op sophie@socreativemanagement.com.';
      if (!form.querySelector('.form-bedankt')) form.appendChild(p);
    });
  });
})();
