#!/usr/bin/env bash
# Smoke test against a running server. Usage: scripts/smoke-test.sh http://localhost:4321
set -euo pipefail
BASE="${1:-http://localhost:4321}"
fail=0

check_status() { # path expected_status [expected_location]
  local out code loc
  out=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$BASE$1")
  code=${out%% *}; loc=${out#* }
  if [[ "$code" != "$2" ]]; then echo "::error::FAIL $1 -> $code (expected $2)"; fail=1; return; fi
  if [[ -n "${3:-}" && "$loc" != "$BASE$3" ]]; then echo "::error::FAIL $1 -> $loc (expected $BASE$3)"; fail=1; return; fi
  echo "ok   $1 -> $code ${3:-}"
}

check_contains() { # path text
  if curl -sL "$BASE$1" | grep -qF -- "$2"; then echo "ok   $1 contains: $2"; else echo "::error::FAIL $1 missing: $2"; fail=1; fi
}

# Pages
for p in / /sell-your-house /investors /es/ /es/sell-your-house /es/investors; do check_status "$p" 200; done

# Legacy URLs (301)
# /index.html and /es/index.html are served as files (same page, canonical points to the clean URL)
check_status /index.html 200
check_status /sell-your-house.html 301 /sell-your-house
check_status /for-investors.html 301 /investors
check_status /for-investors 301 /investors
check_status /es/index.html 200
check_status /es/sell-your-house.html 301 /es/sell-your-house
check_status /es/for-investors.html 301 /es/investors
check_status /sitemap.xml 301 /sitemap-index.xml

# Static assets
for p in /css/styles.css /js/main.js /assets/logo.jpg /assets/favicon.svg /robots.txt /sitemap-index.xml; do check_status "$p" 200; done

# Content checks
check_contains / '<html lang="en"'
check_contains /es/ '<html lang="es"'
check_contains /es/sell-your-house 'Dirección de la propiedad'
check_contains /investors 'data-lead-form="buyer"'
check_contains /sell-your-house 'data-lead-form="seller"'
check_contains /sell-your-house 'name="website_url"'
check_contains /investors '<link rel="canonical" href="https://keyvorahome.online/investors">'

# Copy rules (owner decision D7): claims removed from the site
for p in / /sell-your-house /investors /es/ /es/sell-your-house /es/investors; do
  page=$(curl -sL "$BASE$p")
  for phrase in 'cash offer' 'sell fast' 'House Fast' 'hidden costs' 'widely available' 'oferta en efectivo' 'costos ocultos' 'Vendé tu Casa Rápido'; do
    if grep -qiF -- "$phrase" <<<"$page"; then echo "::error::FAIL $p contains banned phrase: $phrase"; fail=1; fi
  done
done
check_contains /sell-your-house 'no fees or commissions'
check_contains /sell-your-house 'Cuyahoga County'
check_contains /es/sell-your-house 'condado de Cuyahoga'

# Home v2 (spec 14-27)
check_contains / 'Your Cleveland property. Your options.'
check_contains / "I'm looking for investments"
check_contains / 'What brings you to Keyvora?'
check_contains / 'Every property has a story.'
check_contains / 'id="how-it-works"'
check_contains / 'Start with your property.'
check_contains / 'data-quick-entry'
check_contains / 'class="sticky-cta"'
check_contains /es/ 'Tu propiedad en Cleveland. Tus opciones.'
check_contains /es/ '¿Qué te trae a Keyvora?'
check_contains /investors 'Join investor network'

exit $fail
