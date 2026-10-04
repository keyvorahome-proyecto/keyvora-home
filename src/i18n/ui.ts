export type Lang = 'en' | 'es';

export const routes = {
  home: { en: '/', es: '/es/' },
  sell: { en: '/sell-your-house', es: '/es/sell-your-house' },
  investors: { en: '/investors', es: '/es/investors' },
  sellThanks: { en: '/sell-your-house/thank-you', es: '/es/sell-your-house/thank-you' },
  investorThanks: { en: '/investors/thank-you', es: '/es/investors/thank-you' }
} as const;

export type RouteKey = keyof typeof routes;

export const ui = {
  en: {
    skip: 'Skip to main content',
    logoAlt: 'Keyvora Home logo',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    navSell: 'Sell a Property',
    navInvestors: 'Investors',
    navHow: 'How It Works',
    navFaq: 'FAQ',
    navCta: 'Start my property review',
    jvText: 'Are you a wholesaler or investor interested in a JV?',
    jvLink: 'Get in touch'
  },
  es: {
    skip: 'Saltar al contenido principal',
    logoAlt: 'Logo de Keyvora Home',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    navSell: 'Vender una propiedad',
    navInvestors: 'Inversionistas',
    navHow: 'Cómo funciona',
    navFaq: 'Preguntas frecuentes',
    navCta: 'Revisar mi propiedad',
    jvText: '¿Sos wholesaler o inversionista y te interesa una JV?',
    jvLink: 'Contactanos'
  }
} as const;
