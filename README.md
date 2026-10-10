# So Creative Management — website

Statische website (HTML + CSS + JS), gehost via GitHub → Cloudflare Pages.

## Structuur
```
index.html          Home
creators.html       Overzicht creators
over.html           Over So Creative
contact.html        Contact / aanvraag
creators/           (later) detailpagina per creator, bv. creators/koen.html
assets/css/style.css  Gedeelde stijl voor álle pagina's
assets/js/main.js     Mobiel menu + jaartal footer
assets/images/        Foto's (hero.jpg, creators/koen.jpg, creators/malcom.jpg, ...)
```

## Huisstijl
- Kleuren: burgundy `#771138`, blauw `#d4eaf5`, wit `#ffffff`
- Font: Poppins voor alles, DM Serif Display alleen voor het logo, Gochi Hand (handschrift) voor "rewrite"

## Afspraken
- Header en footer staan op elke pagina hetzelfde. Pas je het menu aan, doe dat dan op alle pagina's.
- Zet `aria-current="page"` op de link van de pagina waar je bent.
- Gele vakjes (`class="ph"`) en gestippelde fotovakken (`class="foto-ph"`) moeten nog gevuld worden met echte content.
- Opbouw van de home volgt het theoretisch kader: AIDA (hero → creators/waarom/werkwijze → case/testimonial → samenwerken?).
- Nooit API-keys of `.env`-bestanden in deze repo zetten.
