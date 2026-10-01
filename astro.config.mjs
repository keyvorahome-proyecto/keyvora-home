// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://keyvorahome.online',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en-US', es: 'es' } }
    })
  ]
});
