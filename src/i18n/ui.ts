export type Lang = 'en' | 'es';

export const routes = {
  home: { en: '/', es: '/es/' },
  sell: { en: '/sell-your-house', es: '/es/sell-your-house' },
  investors: { en: '/investors', es: '/es/investors' }
} as const;

export type RouteKey = keyof typeof routes;

export const ui = {
  en: {
    skip: 'Skip to main content',
    logoAlt: 'Keyvora Home logo',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    navHome: 'Home',
    navInvestors: 'For Investors',
    navSell: 'Sell Your House',
    navFaq: 'FAQ',
    jvText: 'Are you a wholesaler or investor interested in a JV?',
    jvLink: 'Get in touch'
  },
  es: {
    skip: 'Saltar al contenido principal',
    logoAlt: 'Logo de Keyvora Home',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    navHome: 'Inicio',
    navInvestors: 'Para Inversionistas',
    navSell: 'Vender mi Casa',
    navFaq: 'Preguntas Frecuentes',
    jvText: '¿Sos wholesaler o inversionista y te interesa una JV?',
    jvLink: 'Contactanos'
  }
} as const;
