// Structured data (spec 88): only facts that are true and visible on the site.
// No LocalBusiness: Keyvora has no public street address to declare.
import { routes, type Lang, type RouteKey } from '../i18n/ui';

export const SITE = 'https://keyvorahome.online';

// Serialize for a <script type="application/ld+json"> tag; escaping "<" keeps
// any text from closing the script element early.
export function ldJson(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

const NAMES: Partial<Record<RouteKey, Record<Lang, string>>> = {
  home: { en: 'Home', es: 'Inicio' },
  sell: { en: 'Sell a Property', es: 'Vender una propiedad' },
  investors: { en: 'Investors', es: 'Inversionistas' },
  privacy: { en: 'Privacy Policy', es: 'Política de privacidad' }
};

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': SITE + '/#organization',
    name: 'Keyvora Home',
    url: SITE + '/',
    logo: SITE + '/assets/logo.jpg',
    email: 'keyvorahome@gmail.com',
    telephone: '+1-216-677-2783',
    areaServed: [
      { '@type': 'City', name: 'Cleveland, Ohio' },
      { '@type': 'AdministrativeArea', name: 'Cuyahoga County, Ohio' }
    ],
    sameAs: ['https://www.facebook.com/share/1DsGpWwTpB/']
  };
}

export function websiteSchema(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE + '/#website',
    name: 'Keyvora Home',
    url: SITE + routes.home[lang],
    inLanguage: lang === 'es' ? 'es' : 'en-US',
    publisher: { '@id': SITE + '/#organization' }
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  };
}

export function breadcrumbSchema(lang: Lang, route: RouteKey) {
  const crumbs: RouteKey[] = route === 'home' ? ['home'] : ['home', route];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((key, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: NAMES[key]?.[lang] ?? key,
      item: SITE + routes[key][lang]
    }))
  };
}
