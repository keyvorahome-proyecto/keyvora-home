// Investor page, profile builder and thank-you copy (spec 43–54).
// Option `value`s must match src/lib/leads.ts and the Airtable select options
// exactly; only the labels are translated.
import type { Lang } from './ui';

type Option = { value: string; label: string };
const zip = (values: string[], labels: string[]): Option[] => values.map((value, i) => ({ value, label: labels[i] }));

const TYPE_VALUES = ['Single Family', 'Duplex', 'Triplex', 'Fourplex', 'Multifamily', 'Land', 'Other'];
const STRATEGY_VALUES = ['Fix & Flip', 'Buy & Hold', 'BRRRR', 'Development', 'Wholesale / Assignment', 'Other'];
const CONDITION_VALUES = ['Turnkey', 'Light rehab', 'Heavy rehab', 'Any condition'];
const FUNDING_VALUES = ['Cash', 'Hard Money', 'Private Money', 'Other'];

// Cleveland neighborhoods and nearby Cuyahoga County cities offered as quick
// picks. Names are proper nouns and stay the same in both languages.
export const AREAS = [
  'Ohio City',
  'Tremont',
  'Detroit-Shoreway',
  'Clark-Fulton',
  'Stockyards',
  'Cudell',
  'West Park',
  "Kamm's Corners",
  'Old Brooklyn',
  'Slavic Village',
  'Union-Miles',
  'Mount Pleasant',
  'Lee-Harvard',
  'Buckeye-Shaker',
  'Glenville',
  'Collinwood',
  'Lakewood',
  'Parma',
  'Euclid',
  'Garfield Heights',
  'Maple Heights',
  'East Cleveland'
];

export const RANGE = { cap: 500_000, step: 5_000, defaultMin: 50_000, defaultMax: 250_000 };

export const investors = {
  en: {
    title: 'Cleveland Off-Market Opportunities for Investors | Keyvora Home',
    description:
      'Tell us what you buy, where and how you invest. Keyvora Home saves your criteria and contacts you when a relevant Cleveland opportunity comes up.',
    sticky: 'Build my investor profile',
    hero: {
      eyebrow: 'For investors',
      h1: 'Get Cleveland off-market opportunities matched to your strategy.',
      lead: "Tell us what you buy, where you buy it and how you invest. We'll use your criteria when relevant opportunities become available.",
      cta: 'BUILD MY INVESTOR PROFILE →',
      secondary: 'SEE HOW IT WORKS →',
      photoAlt: 'A wood-sided house with a wide front porch and a magnolia tree in bloom'
    },
    how: {
      eyebrow: 'How it works',
      h2: 'From criteria to opportunity',
      steps: [
        { title: 'Tell us what you buy', text: 'Property types, strategy, price range, areas, condition and funding.' },
        { title: 'Save criteria', text: 'We keep your investor profile on file.' },
        { title: 'Match relevant opportunities', text: 'When a property fits your criteria, we reach out with the details.' },
        { title: 'Review', text: 'You review the opportunity and decide. No obligation.' }
      ]
    },
    formHead: { eyebrow: 'Investor profile', h2: 'Build your investor profile' },
    altContact: { before: 'Prefer to talk it through?', call: 'Call', or: 'or', text: 'text', after: 'us at (216) 677-2783.' },
    form: {
      progress: 'Step {n} of {total}',
      back: '← Back',
      next: 'Continue →',
      submit: 'SAVE MY INVESTOR CRITERIA →',
      submitting: 'Saving…',
      tryAgain: 'TRY AGAIN',
      optional: '(optional)',
      chooseAll: 'Choose all that apply.',
      stepNames: ['Type', 'Strategy', 'Range', 'Area', 'Condition', 'Funding', 'Contact'],
      propertyTypes: { title: 'What property types do you buy?', options: zip(TYPE_VALUES, TYPE_VALUES) },
      strategies: { title: "What's your strategy?", options: zip(STRATEGY_VALUES, STRATEGY_VALUES) },
      range: {
        title: "What's your target purchase range?",
        hint: 'Drag the sliders or type the amounts. Leave the maximum empty for no limit.',
        min: 'Minimum',
        max: 'Maximum',
        maxPlaceholder: 'No maximum',
        noMax: 'no maximum',
        minSlider: 'Minimum price',
        maxSlider: 'Maximum price'
      },
      area: {
        title: 'Where do you want to buy?',
        hint: 'Add ZIP codes, pick neighborhoods, or both.',
        zips: 'Target ZIP codes',
        zipsPlaceholder: '44102, 44105, 44109',
        picks: 'Neighborhoods and nearby cities',
        other: 'Other areas',
        otherPlaceholder: 'Separate with commas'
      },
      preferredCondition: { title: 'What condition do you prefer?', options: zip(CONDITION_VALUES, CONDITION_VALUES) },
      funding: { title: 'How do you fund your purchases?', options: zip(FUNDING_VALUES, FUNDING_VALUES) },
      contact: {
        title: 'Where should we send opportunities?',
        hint: 'First name and email. Add a phone number if you want a call or text.',
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        phone: 'Phone'
      },
      consent:
        'By submitting this form, you agree that Keyvora Home may contact you about investment opportunities that match your criteria. Message and data rates may apply.',
      errors: {
        choice: 'Please choose an option to continue.',
        multi: 'Please choose at least one option.',
        range: "The minimum can't be higher than the maximum.",
        area: 'Add at least one ZIP code or neighborhood.',
        zip: 'ZIP codes must have 5 digits, separated by commas.',
        firstName: 'Please enter your first name.',
        emailRequired: 'Please enter your email.',
        email: 'Please enter a valid email address.',
        phone: 'Please enter a valid phone number (at least 10 digits).',
        general: 'Something went wrong while submitting your information. Please try again.'
      }
    },
    faq: {
      eyebrow: 'FAQ',
      h2: 'Common questions',
      items: [
        {
          q: 'What is an assignment fee?',
          a: 'When Keyvora Home secures a purchase contract on a property, it may assign that contract to an investor buyer in exchange for an assignment fee, rather than purchasing and reselling the property itself. This fee is already included in the price presented to you.'
        },
        {
          q: 'How does closing work?',
          a: "Closing is handled through a title company or attorney, following standard real estate practice. You'll receive full details on the process for any specific opportunity before deciding to move forward."
        },
        {
          q: 'How often will I hear about new opportunities?',
          a: "Keyvora Home is a new operation, so opportunity frequency will grow as our Cleveland network develops. We only reach out when a property fits the criteria you saved."
        },
        {
          q: 'Can I update my criteria later?',
          a: 'Yes. Reply to any of our messages or call us and we will update your investor profile.'
        }
      ]
    },
    thanks: {
      title: "You're on the Keyvora Investor List | Keyvora Home",
      description: 'Your investor criteria are saved. Keyvora Home will use them when relevant Cleveland opportunities become available.',
      eyebrow: 'Saved',
      h1: "You're on the Keyvora investor list.",
      lead: "Your criteria are saved. We'll use them to reach out when a relevant Cleveland opportunity becomes available.",
      steps: [
        'We keep your investor profile on file.',
        'When a property matches your criteria, we contact you with the details.',
        'You review the opportunity and decide.'
      ],
      call: 'CALL KEYVORA',
      home: 'RETURN HOME',
      how: 'Learn how the process works →'
    }
  },
  es: {
    title: 'Oportunidades Off-Market en Cleveland | Keyvora Home',
    description:
      'Contanos qué comprás, dónde y cómo invertís. Keyvora Home guarda tus criterios y te contacta cuando aparece una oportunidad relevante en Cleveland.',
    sticky: 'Armar mi perfil de inversionista',
    hero: {
      eyebrow: 'Para inversionistas',
      h1: 'Recibí oportunidades off-market en Cleveland según tu estrategia.',
      lead: 'Contanos qué comprás, dónde lo comprás y cómo invertís. Vamos a usar tus criterios cuando aparezcan oportunidades relevantes.',
      cta: 'ARMAR MI PERFIL DE INVERSIONISTA →',
      secondary: 'VER CÓMO FUNCIONA →',
      photoAlt: 'Una casa de madera con porche amplio y un magnolio en flor'
    },
    how: {
      eyebrow: 'Cómo funciona',
      h2: 'De tus criterios a la oportunidad',
      steps: [
        { title: 'Contanos qué comprás', text: 'Tipos de propiedad, estrategia, rango de precio, zonas, estado y financiación.' },
        { title: 'Guardamos tus criterios', text: 'Tenemos tu perfil de inversionista registrado.' },
        { title: 'Buscamos oportunidades que encajen', text: 'Cuando una propiedad coincide con tus criterios, te contactamos con los detalles.' },
        { title: 'Revisás', text: 'Revisás la oportunidad y decidís. Sin compromiso.' }
      ]
    },
    formHead: { eyebrow: 'Perfil de inversionista', h2: 'Armá tu perfil de inversionista' },
    altContact: { before: '¿Preferís hablarlo?', call: 'Llamanos', or: 'o', text: 'escribinos', after: 'al (216) 677-2783.' },
    form: {
      progress: 'Paso {n} de {total}',
      back: '← Atrás',
      next: 'Continuar →',
      submit: 'GUARDAR MIS CRITERIOS →',
      submitting: 'Guardando…',
      tryAgain: 'INTENTAR DE NUEVO',
      optional: '(opcional)',
      chooseAll: 'Elegí todas las que correspondan.',
      stepNames: ['Tipo', 'Estrategia', 'Rango', 'Zona', 'Estado', 'Pago', 'Contacto'],
      propertyTypes: {
        title: '¿Qué tipos de propiedad comprás?',
        options: zip(TYPE_VALUES, ['Casa unifamiliar', 'Dúplex', 'Tríplex', 'Cuádruplex', 'Multifamiliar', 'Terreno', 'Otro'])
      },
      strategies: {
        title: '¿Cuál es tu estrategia?',
        options: zip(STRATEGY_VALUES, ['Fix & Flip', 'Buy & Hold', 'BRRRR', 'Desarrollo', 'Wholesale / Assignment', 'Otra'])
      },
      range: {
        title: '¿Cuál es tu rango de compra?',
        hint: 'Mové los controles o escribí los montos. Dejá el máximo vacío si no tenés límite.',
        min: 'Mínimo',
        max: 'Máximo',
        maxPlaceholder: 'Sin máximo',
        noMax: 'sin máximo',
        minSlider: 'Precio mínimo',
        maxSlider: 'Precio máximo'
      },
      area: {
        title: '¿Dónde querés comprar?',
        hint: 'Agregá ZIP codes, elegí barrios, o las dos cosas.',
        zips: 'ZIP codes de interés',
        zipsPlaceholder: '44102, 44105, 44109',
        picks: 'Barrios y ciudades cercanas',
        other: 'Otras zonas',
        otherPlaceholder: 'Separadas por comas'
      },
      preferredCondition: {
        title: '¿En qué estado preferís las propiedades?',
        options: zip(CONDITION_VALUES, ['Lista para usar', 'Reparación liviana', 'Reparación pesada', 'Cualquier estado'])
      },
      funding: {
        title: '¿Cómo financiás tus compras?',
        options: zip(FUNDING_VALUES, ['Efectivo', 'Hard money', 'Private money', 'Otro'])
      },
      contact: {
        title: '¿A dónde te enviamos las oportunidades?',
        hint: 'Tu nombre y email. Sumá un teléfono si querés que te llamemos o escribamos.',
        firstName: 'Nombre',
        lastName: 'Apellido',
        email: 'Email',
        phone: 'Teléfono'
      },
      consent:
        'Al enviar este formulario, aceptás que Keyvora Home se comunique con vos sobre oportunidades de inversión que coincidan con tus criterios. Pueden aplicar cargos por mensajes y datos.',
      errors: {
        choice: 'Elegí una opción para continuar.',
        multi: 'Elegí al menos una opción.',
        range: 'El mínimo no puede ser mayor que el máximo.',
        area: 'Agregá al menos un ZIP code o un barrio.',
        zip: 'Los ZIP codes tienen 5 dígitos, separados por comas.',
        firstName: 'Ingresá tu nombre.',
        emailRequired: 'Ingresá tu email.',
        email: 'Ingresá un email válido.',
        phone: 'Ingresá un teléfono válido (al menos 10 dígitos).',
        general: 'Algo salió mal al enviar tus datos. Probá de nuevo.'
      }
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      h2: 'Dudas comunes',
      items: [
        {
          q: '¿Qué es una assignment fee?',
          a: 'Cuando Keyvora Home obtiene un contrato de compra sobre una propiedad, puede ceder ese contrato a un inversionista comprador a cambio de una assignment fee, en lugar de comprar y revender la propiedad directamente. Esta comisión ya está incluida en el precio que se te presenta.'
        },
        {
          q: '¿Cómo funciona el cierre de la operación?',
          a: 'El cierre se gestiona a través de una title company o un abogado, siguiendo las prácticas estándar del sector inmobiliario. Vas a recibir todos los detalles del proceso para cada oportunidad específica antes de decidir avanzar.'
        },
        {
          q: '¿Con qué frecuencia voy a recibir nuevas oportunidades?',
          a: 'Keyvora Home es una operación nueva, así que la frecuencia de oportunidades irá creciendo a medida que se desarrolle nuestra red en Cleveland. Solo te contactamos cuando una propiedad coincide con los criterios que guardaste.'
        },
        {
          q: '¿Puedo cambiar mis criterios más adelante?',
          a: 'Sí. Respondé cualquiera de nuestros mensajes o llamanos y actualizamos tu perfil de inversionista.'
        }
      ]
    },
    thanks: {
      title: 'Ya Estás en la Lista de Inversionistas de Keyvora | Keyvora Home',
      description: 'Tus criterios de inversión quedaron guardados. Keyvora Home los va a usar cuando aparezcan oportunidades relevantes en Cleveland.',
      eyebrow: 'Guardado',
      h1: 'Ya estás en la lista de inversionistas de Keyvora.',
      lead: 'Tus criterios quedaron guardados. Los vamos a usar para contactarte cuando aparezca una oportunidad relevante en Cleveland.',
      steps: [
        'Guardamos tu perfil de inversionista.',
        'Cuando una propiedad coincide con tus criterios, te contactamos con los detalles.',
        'Revisás la oportunidad y decidís.'
      ],
      call: 'LLAMAR A KEYVORA',
      home: 'VOLVER AL INICIO',
      how: 'Ver cómo funciona el proceso →'
    }
  }
} satisfies Record<Lang, unknown>;
