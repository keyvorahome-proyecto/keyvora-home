// Privacy policy (spec 88). DRAFT for review by the owner's attorney or title
// company before being relied on. It describes only what the site actually
// does today: lead forms → own API → n8n → Airtable, email and Telegram
// notifications, and Google Analytics 4 on the production domain.
import type { Lang } from './ui';

type Section = { h: string; p?: string[]; list?: string[] };

export const EFFECTIVE_DATE = { en: 'October 4, 2026', es: '4 de octubre de 2026' };

export const privacy = {
  en: {
    title: 'Privacy Policy | Keyvora Home',
    description: 'How Keyvora Home collects, uses and protects the information you share through keyvorahome.online.',
    eyebrow: 'Legal',
    h1: 'Privacy Policy',
    effective: 'Effective date:',
    intro:
      'Keyvora Home ("Keyvora", "we", "us") works with property owners and real estate investors in Cleveland and Cuyahoga County, Ohio. This policy explains what information we collect through keyvorahome.online, how we use it and the choices you have.',
    sections: [
      {
        h: 'Information you give us',
        p: ['When you fill out a form on this site we collect what you enter:'],
        list: [
          'Property owners: property address, property type, condition, your situation, your timeline, first and last name, phone number and email.',
          'Investors: property types, strategies, purchase range, target ZIP codes and neighborhoods, preferred condition, funding method, first and last name, email and phone number.',
          'Anything you tell us when you call, text or email us.'
        ]
      },
      {
        h: 'Information collected automatically',
        list: [
          'The page where you submitted a form, the language you used and the date and time.',
          'How you found us: the campaign tags in the link you followed (such as utm_source) or the website that sent you. We keep this in your browser for up to 30 days so we can tell which of our ads or posts led to your inquiry.',
          'Usage data through Google Analytics: pages visited, buttons clicked, progress through our forms, device and browser type and approximate location (city level). Google Analytics uses cookies to do this. We do not send your name, phone number, email or address to Google Analytics.'
        ]
      },
      {
        h: 'How we use your information',
        list: [
          'To review your property or investment criteria and respond to your inquiry.',
          'To contact you by phone, text message or email about your inquiry or, for investors, about opportunities that match your criteria.',
          'To keep an organized record of our conversations and follow-ups.',
          'To understand how visitors use the site and improve it.',
          'To prevent spam and abuse and to meet legal obligations.'
        ]
      },
      {
        h: 'Text messages',
        p: [
          'If you give us your phone number, we may contact you by text message about your inquiry. Message and data rates may apply. Message frequency varies. You can reply STOP at any time to stop receiving texts, or HELP for help. Consent to receive messages is not a condition of any purchase.',
          'We do not sell or share your phone number or text messaging consent with third parties for their marketing purposes.'
        ]
      },
      {
        h: 'How we share information',
        p: ['We do not sell your personal information. We share it only as needed to run our business:'],
        list: [
          'With service providers that store or process it for us, such as our website host, our database (Airtable), our automation tools, Google (email and Analytics) and Telegram (internal notifications to our team). They may use it only to provide their services to us.',
          'If you decide to move forward with a transaction, with the parties needed to complete it, such as a title company, an attorney or, for property owners, an investor buyer. We will tell you before sharing your contact details with a buyer.',
          'When required by law or to protect our rights, or as part of a sale or reorganization of our business.'
        ]
      },
      {
        h: 'Cookies and your choices',
        p: [
          'You can block or delete cookies in your browser settings, and you can opt out of Google Analytics with the Google Analytics Opt-out Browser Add-on (tools.google.com/dlpage/gaoptout). The site and its forms work without analytics cookies.'
        ]
      },
      {
        h: 'How long we keep information',
        p: [
          'We keep your information for as long as we need it for the purposes above, for example while we are in contact about a property or while you are on our investor list, and as required for our legal and tax records. You can ask us to delete it at any time.'
        ]
      },
      {
        h: 'Your requests',
        p: [
          'You can ask us to tell you what information we have about you, to correct it, to delete it or to stop contacting you. Email keyvorahome@gmail.com or call (216) 677-2783 and we will respond within a reasonable time. Investors can also ask us to update their criteria the same way.'
        ]
      },
      {
        h: 'Security',
        p: [
          'Forms are sent over an encrypted connection (HTTPS) to our own server, which validates them before storing them. Access to our records is limited to our team. No method of transmission or storage is completely secure, but we work to protect your information.'
        ]
      },
      {
        h: 'Children',
        p: ['This site is not directed to anyone under 18, and we do not knowingly collect information from children.']
      },
      {
        h: 'Changes to this policy',
        p: ['If we change this policy we will post the new version on this page with a new effective date.']
      },
      {
        h: 'Contact us',
        p: ['Keyvora Home · Cleveland, Ohio · keyvorahome@gmail.com · (216) 677-2783']
      }
    ] as Section[]
  },
  es: {
    title: 'Política de Privacidad | Keyvora Home',
    description: 'Cómo Keyvora Home recopila, usa y protege la información que compartís en keyvorahome.online.',
    eyebrow: 'Legal',
    h1: 'Política de Privacidad',
    effective: 'Vigente desde:',
    intro:
      'Keyvora Home ("Keyvora", "nosotros") trabaja con propietarios e inversionistas inmobiliarios en Cleveland y el condado de Cuyahoga, Ohio. Esta política explica qué información recopilamos en keyvorahome.online, cómo la usamos y qué opciones tenés.',
    sections: [
      {
        h: 'Información que nos das',
        p: ['Cuando completás un formulario en este sitio recopilamos lo que ingresás:'],
        list: [
          'Propietarios: dirección de la propiedad, tipo de propiedad, estado, tu situación, tu plazo, nombre y apellido, teléfono y email.',
          'Inversionistas: tipos de propiedad, estrategias, rango de compra, ZIP codes y barrios de interés, estado preferido, forma de pago, nombre y apellido, email y teléfono.',
          'Lo que nos cuentes cuando nos llamás, nos escribís un mensaje o un email.'
        ]
      },
      {
        h: 'Información que se recopila automáticamente',
        list: [
          'La página desde la que enviaste el formulario, el idioma que usaste y la fecha y hora.',
          'Cómo nos encontraste: las etiquetas de campaña del enlace que seguiste (como utm_source) o el sitio que te envió. Lo guardamos en tu navegador hasta 30 días para saber qué anuncio o publicación te trajo.',
          'Datos de uso a través de Google Analytics: páginas visitadas, botones tocados, avance en nuestros formularios, tipo de dispositivo y navegador y ubicación aproximada (a nivel ciudad). Google Analytics usa cookies para esto. No enviamos a Google Analytics tu nombre, teléfono, email ni dirección.'
        ]
      },
      {
        h: 'Cómo usamos tu información',
        list: [
          'Para revisar tu propiedad o tus criterios de inversión y responder tu consulta.',
          'Para contactarte por teléfono, mensaje de texto o email sobre tu consulta o, si sos inversionista, sobre oportunidades que coincidan con tus criterios.',
          'Para llevar un registro ordenado de nuestras conversaciones y seguimientos.',
          'Para entender cómo se usa el sitio y mejorarlo.',
          'Para prevenir spam y abusos y cumplir obligaciones legales.'
        ]
      },
      {
        h: 'Mensajes de texto',
        p: [
          'Si nos das tu teléfono, podemos contactarte por mensaje de texto sobre tu consulta. Pueden aplicar cargos por mensajes y datos. La frecuencia de los mensajes varía. Podés responder STOP en cualquier momento para dejar de recibirlos, o HELP para pedir ayuda. El consentimiento para recibir mensajes no es condición para ninguna compra.',
          'No vendemos ni compartimos tu teléfono ni tu consentimiento para recibir mensajes con terceros para sus propios fines de marketing.'
        ]
      },
      {
        h: 'Con quién compartimos información',
        p: ['No vendemos tu información personal. Solo la compartimos cuando hace falta para operar:'],
        list: [
          'Con proveedores que la guardan o procesan por nosotros, como el hosting del sitio, nuestra base de datos (Airtable), nuestras herramientas de automatización, Google (email y Analytics) y Telegram (avisos internos a nuestro equipo). Solo pueden usarla para darnos su servicio.',
          'Si decidís avanzar con una operación, con quienes hacen falta para concretarla, como una title company, un abogado o, si sos propietario, un inversionista comprador. Te avisamos antes de compartir tus datos de contacto con un comprador.',
          'Cuando lo exija la ley o para proteger nuestros derechos, o como parte de una venta o reorganización de nuestro negocio.'
        ]
      },
      {
        h: 'Cookies y tus opciones',
        p: [
          'Podés bloquear o borrar las cookies desde la configuración de tu navegador, y podés desactivar Google Analytics con el complemento de inhabilitación de Google Analytics (tools.google.com/dlpage/gaoptout). El sitio y sus formularios funcionan sin cookies de analytics.'
        ]
      },
      {
        h: 'Cuánto tiempo guardamos la información',
        p: [
          'Guardamos tu información mientras la necesitemos para los fines anteriores, por ejemplo mientras estemos en contacto por una propiedad o mientras estés en nuestra lista de inversionistas, y según lo exijan nuestras obligaciones legales e impositivas. Podés pedirnos que la borremos en cualquier momento.'
        ]
      },
      {
        h: 'Tus pedidos',
        p: [
          'Podés pedirnos que te digamos qué información tenemos sobre vos, que la corrijamos, que la borremos o que dejemos de contactarte. Escribinos a keyvorahome@gmail.com o llamá al (216) 677-2783 y te respondemos en un plazo razonable. Si sos inversionista, también podés pedirnos así que actualicemos tus criterios.'
        ]
      },
      {
        h: 'Seguridad',
        p: [
          'Los formularios viajan por una conexión cifrada (HTTPS) a nuestro propio servidor, que los valida antes de guardarlos. El acceso a nuestros registros está limitado a nuestro equipo. Ningún método de transmisión o almacenamiento es totalmente seguro, pero trabajamos para proteger tu información.'
        ]
      },
      {
        h: 'Menores de edad',
        p: ['Este sitio no está dirigido a menores de 18 años y no recopilamos a sabiendas información de menores.']
      },
      {
        h: 'Cambios en esta política',
        p: ['Si cambiamos esta política, publicaremos la nueva versión en esta página con una nueva fecha de vigencia.']
      },
      {
        h: 'Contacto',
        p: ['Keyvora Home · Cleveland, Ohio · keyvorahome@gmail.com · (216) 677-2783']
      }
    ] as Section[]
  }
} satisfies Record<Lang, unknown>;

export const privacyLink = {
  en: { footer: 'Privacy Policy', consent: 'See our Privacy Policy.' },
  es: { footer: 'Política de privacidad', consent: 'Ver nuestra Política de privacidad.' }
} satisfies Record<Lang, unknown>;
