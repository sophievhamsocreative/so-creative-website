#!/bin/bash
# Zet de bestanden uit GitHub in de juiste mappen (dist/) en zet de site online
set -e
rm -rf dist
D=dist; I=$D/assets/images
mkdir -p $D/creators $D/assets/css $D/assets/js $D/assets/video $I/creators $I/feed $I/team $I/logo $I/logos
for f in *; do
  [ -f "$f" ] || continue
  case "$f" in
    koen.html|malcom.html|podcastje-van-de-week.html) cp "$f" $D/creators/ ;;
    *.html) cp "$f" $D/ ;;
    *.css) cp "$f" $D/assets/css/ ;;
    *.js) cp "$f" $D/assets/js/ ;;
    *.mp4) cp "$f" $D/assets/video/ ;;
    logo-*.png) cp "$f" $I/logo/ ;;
    sophie.jpg|sophie-koen.jpg) cp "$f" $I/team/ ;;
    boeklancering.jpg|camera.jpg|duo.jpg|event-duo.jpg|koen-boek.jpg|koen-podium.jpg|malcom-event.jpg|salsa-shop.jpg|stoel.jpg|team-bank.jpg|team.jpg|trio.jpg|zw.jpg) cp "$f" $I/feed/ ;;
    koen*.jpg|koen-boek-cover.png|ongetemd-spel.png|malcom*.jpg|podcast.jpg) cp "$f" $I/creators/ ;;
    favicon*|apple-touch-icon.png) cp "$f" $D/ ;;
    *.png|*.svg) cp "$f" $I/logos/ ;;
  esac
done
npx wrangler deploy --assets=./$D --name=so-creative-website --compatibility-date=2026-10-06
