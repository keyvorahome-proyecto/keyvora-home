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
check_contains /investors 'data-lead-form="investor"'
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
check_contains / 'looking for investments'
check_contains / 'What brings you to Keyvora?'
check_contains / 'Every property has a story.'
check_contains / 'id="how-it-works"'
check_contains / 'Start with your property.'
check_contains / 'data-quick-entry'
check_contains / 'class="sticky-cta"'
check_contains /es/ 'Tu propiedad en Cleveland. Tus opciones.'
check_contains /es/ '¿Qué te trae a Keyvora?'
check_contains / 'cleveland-skyline-day-1280.webp'
check_contains /es/ 'El centro de Cleveland y el río Cuyahoga'
check_contains / 'house-porch-evening-853.webp'
check_contains / 'data-situation="Inherited property"'
check_contains / 'data-timeline="Just exploring"'
for p in /images/house-midwest-640.webp /images/house-porch-spring-1280.jpg /images/house-porch-evening-560.webp; do check_status "$p" 200; done
for p in /images/cleveland-skyline-day-800.webp /images/cleveland-sign-1280.jpg /images/cleveland-skyline-dusk-1280.webp; do check_status "$p" 200; done

# Seller multi-step form (spec 28-42)
check_contains /sell-your-house 'Thinking about selling your Cleveland property?'
check_contains /es/sell-your-house '¿Estás pensando en vender tu propiedad en Cleveland?'
check_contains /sell-your-house 'data-multistep'
check_contains /sell-your-house 'SUBMIT MY PROPERTY →'
check_contains /sell-your-house 'Consent is not required as a condition of any purchase.'
check_contains /sell-your-house 'value="Needs significant repairs"'
check_contains /sell-your-house 'value="1–3 months"'
check_contains /es/sell-your-house 'Propiedad heredada'
check_contains /es/sell-your-house 'value="Inherited property"'
check_contains /sell-your-house 'data-thanks="/sell-your-house/thank-you"'
for p in /sell-your-house/thank-you /es/sell-your-house/thank-you; do check_status "$p" 200; done
check_contains /sell-your-house/thank-you 'Thanks — we received your property information.'
check_contains /sell-your-house/thank-you 'CALL KEYVORA'
check_contains /sell-your-house/thank-you 'RETURN HOME'
check_contains /sell-your-house/thank-you 'noindex'
check_contains /es/sell-your-house/thank-you 'Gracias — recibimos los datos de tu propiedad.'
if curl -s "$BASE/sitemap-0.xml" | grep -q 'thank-you'; then echo "::error::FAIL sitemap includes thank-you pages"; fail=1; fi

# Investor funnel (spec 43-54)
check_contains /investors 'Get Cleveland off-market opportunities matched to your strategy.'
check_contains /investors 'BUILD MY INVESTOR PROFILE →'
check_contains /investors 'SEE HOW IT WORKS →'
check_contains /investors 'SAVE MY INVESTOR CRITERIA →'
check_contains /investors 'value="Wholesale / Assignment"'
check_contains /investors 'value="Land"'
check_contains /investors 'value="Hard Money"'
check_contains /investors 'value="Any condition"'
check_contains /investors 'data-cap="500000"'
check_contains /investors 'data-thanks="/investors/thank-you"'
check_contains /investors 'id="how-it-works"'
check_contains /es/investors 'Recibí oportunidades off-market en Cleveland según tu estrategia.'
check_contains /es/investors 'value="Development"'
for p in /investors/thank-you /es/investors/thank-you; do check_status "$p" 200; done
check_contains /investors/thank-you 'on the Keyvora investor list.'
check_contains /investors/thank-you 'noindex'
check_contains /es/investors/thank-you 'Ya estás en la lista de inversionistas de Keyvora.'

exit $fail
