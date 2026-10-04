// Home page copy (spec instructions 6, 14–27). EN text follows the spec verbatim
// where the spec gives it; ES is the matching translation.
import type { Lang } from './ui';

export const home = {
  en: {
    title: 'Keyvora Home | Your Cleveland Property. Your Options.',
    description:
      "Selling a property or looking for investment opportunities in Cleveland, Ohio? Keyvora Home helps homeowners and investors take the next step, with local focus and no pressure.",
    hero: {
      eyebrow: 'Cleveland, Ohio',
      h1: 'Your Cleveland property. Your options.',
      lead: "Whether you're looking to sell a property or find your next investment opportunity, Keyvora Home helps you take the next step.",
      sellCta: 'I want to sell a property',
      investCta: "I'm looking for investments",
      micro: 'Local focus. Direct communication. No-pressure conversations.'
    },
    selector: {
      eyebrow: 'Get started',
      h2: 'What brings you to Keyvora?',
      seller: {
        title: 'I want to sell a property',
        text: 'Tell us about your Cleveland property and your situation.',
        cta: 'Start property review →'
      },
      investor: {
        title: "I'm looking for investment opportunities",
        text: "Tell us what you're looking for and we'll keep your criteria on file.",
        cta: 'Join investor network →'
      }
    },
    situations: {
      eyebrow: 'For property owners',
      h2: 'Every property has a story.',
      intro: "Whatever brought you here, we start by listening. Tell us what's going on with your property.",
      cta: 'Start property review →',
      pick: 'Start here →',
      items: [
        { icon: '🔧', situation: 'Property needs too many repairs', title: 'Needs repairs', text: "Small fixes or major work. Tell us what it needs and we'll talk it through." },
        { icon: '📜', situation: 'Inherited property', title: 'Inherited property', text: "Handling a property you inherited can be a lot. We'll walk through your options with you." },
        { icon: '🚪', situation: 'Vacant property', title: 'Vacant property', text: "An empty house still takes money and attention. Let's discuss what makes sense." },
        { icon: '🔑', situation: 'Rental property', title: 'Rental property', text: 'Tenants, turnover or simply ready to move on. We work with rental owners too.' },
        { icon: '⏱️', timeline: 'As soon as possible', title: 'Need to sell soon', text: "If timing matters, share your timeline and we'll be clear about what's possible." },
        { icon: '🧭', timeline: 'Just exploring', title: 'Just exploring', text: 'No commitment needed. Learn your options before deciding anything.' }
      ]
    },
    why: {
      eyebrow: 'Why Keyvora',
      h2: 'A local, straightforward approach',
      items: [
        { title: 'Local focus', text: 'We work only in Cleveland and Cuyahoga County, so our attention stays on one market.' },
        { title: 'Simple process', text: 'A short form, a conversation and clear next steps. Nothing complicated to get started.' },
        { title: 'Direct communication', text: 'You talk with us directly. No call centers and no pressure.' },
        { title: 'Investor network', text: "We're building a network of investors looking for Cleveland properties, so the right opportunity can find the right buyer." }
      ]
    },
    cleveland: {
      eyebrow: 'Why Cleveland',
      h2: 'One market, on purpose',
      text: 'Keyvora Home focuses on Cleveland, Ohio by choice. Concentrating on one market lets us learn its neighborhoods, property types and price points, instead of spreading thin across many cities.'
    },
    how: {
      eyebrow: 'How it works',
      h2: 'Two clear paths',
      seller: {
        title: 'For property owners',
        steps: [
          { title: 'Tell us', text: 'Share a few details about the property and your situation.' },
          { title: 'Review', text: 'We review the information you sent.' },
          { title: 'Discuss', text: 'We talk with you directly about the property and your options.' },
          { title: 'Decide', text: 'You decide whether and when to move forward. No obligation.' }
        ]
      },
      investor: {
        title: 'For investors',
        steps: [
          { title: 'Tell us what you buy', text: 'Property types, strategy, price range and areas.' },
          { title: 'Save criteria', text: 'We keep your criteria on file.' },
          { title: 'Match relevant opportunities', text: 'When a property fits your criteria, we reach out.' },
          { title: 'Review', text: 'You review the details and decide.' }
        ]
      }
    },
    quick: {
      h2: 'Start with your property.',
      text: 'A few details help us understand the property and your situation.',
      label: 'Property address',
      placeholder: 'Street address, city, ZIP',
      cta: 'Start property review →'
    },
    sticky: 'Start property review',
    images: {
      hero: 'Downtown Cleveland skyline and the Cuyahoga River on a clear day',
      sign: 'The Cleveland script sign by the lakefront, with downtown buildings behind it',
      dusk: 'Downtown Cleveland skyline over the river at dusk',
      sellerCard: 'A two-story family home with a covered front porch and a green lawn',
      investorCard: 'A wood-sided house with a wide front porch and a magnolia tree in bloom',
      story: 'Evening light on the front porch of an older wood house'
    }
  },
  es: {
    title: 'Keyvora Home | Tu propiedad en Cleveland. Tus opciones.',
    description:
      '¿Querés vender una propiedad o buscás oportunidades de inversión en Cleveland, Ohio? Keyvora Home ayuda a propietarios e inversionistas a dar el siguiente paso, con enfoque local y sin presión.',
    hero: {
      eyebrow: 'Cleveland, Ohio',
      h1: 'Tu propiedad en Cleveland. Tus opciones.',
      lead: 'Ya sea que quieras vender una propiedad o encontrar tu próxima oportunidad de inversión, Keyvora Home te ayuda a dar el siguiente paso.',
      sellCta: 'Quiero vender una propiedad',
      investCta: 'Busco oportunidades de inversión',
      micro: 'Enfoque local. Comunicación directa. Conversaciones sin presión.'
    },
    selector: {
      eyebrow: 'Empezá acá',
      h2: '¿Qué te trae a Keyvora?',
      seller: {
        title: 'Quiero vender una propiedad',
        text: 'Contanos sobre tu propiedad en Cleveland y tu situación.',
        cta: 'Revisar mi propiedad →'
      },
      investor: {
        title: 'Busco oportunidades de inversión',
        text: 'Contanos qué estás buscando y guardamos tus criterios.',
        cta: 'Unirme a la red de inversionistas →'
      }
    },
    situations: {
      eyebrow: 'Para propietarios',
      h2: 'Cada propiedad tiene una historia.',
      intro: 'Sea lo que sea que te trajo hasta acá, empezamos por escucharte. Contanos qué pasa con tu propiedad.',
      cta: 'Revisar mi propiedad →',
      pick: 'Empezar por acá →',
      items: [
        { icon: '🔧', situation: 'Property needs too many repairs', title: 'Necesita reparaciones', text: 'Arreglos chicos o trabajos grandes. Contanos qué necesita y lo conversamos.' },
        { icon: '📜', situation: 'Inherited property', title: 'Propiedad heredada', text: 'Ocuparse de una propiedad heredada puede ser mucho. Vemos tus opciones juntos.' },
        { icon: '🚪', situation: 'Vacant property', title: 'Propiedad vacía', text: 'Una casa vacía igual requiere dinero y atención. Hablemos de qué conviene.' },
        { icon: '🔑', situation: 'Rental property', title: 'Propiedad en alquiler', text: 'Inquilinos, rotación o simplemente ganas de cerrar esa etapa. También trabajamos con propietarios que alquilan.' },
        { icon: '⏱️', timeline: 'As soon as possible', title: 'Necesito vender pronto', text: 'Si los tiempos importan, contanos tu plazo y te decimos con claridad qué es posible.' },
        { icon: '🧭', timeline: 'Just exploring', title: 'Solo estoy explorando', text: 'Sin compromiso. Conocé tus opciones antes de decidir nada.' }
      ]
    },
    why: {
      eyebrow: 'Por qué Keyvora',
      h2: 'Un enfoque local y directo',
      items: [
        { title: 'Enfoque local', text: 'Trabajamos solo en Cleveland y el condado de Cuyahoga, así nuestra atención está en un solo mercado.' },
        { title: 'Proceso simple', text: 'Un formulario corto, una conversación y próximos pasos claros. Nada complicado para empezar.' },
        { title: 'Comunicación directa', text: 'Hablás directamente con nosotros. Sin call centers y sin presión.' },
        { title: 'Red de inversionistas', text: 'Estamos armando una red de inversionistas que buscan propiedades en Cleveland, para que cada oportunidad encuentre al comprador indicado.' }
      ]
    },
    cleveland: {
      eyebrow: 'Por qué Cleveland',
      h2: 'Un solo mercado, a propósito',
      text: 'Keyvora Home se enfoca en Cleveland, Ohio por decisión propia. Concentrarnos en un solo mercado nos permite conocer sus barrios, tipos de propiedad y rangos de precio, en lugar de dispersarnos en muchas ciudades.'
    },
    how: {
      eyebrow: 'Cómo funciona',
      h2: 'Dos caminos claros',
      seller: {
        title: 'Para propietarios',
        steps: [
          { title: 'Contanos', text: 'Compartí algunos datos de la propiedad y de tu situación.' },
          { title: 'Revisamos', text: 'Revisamos la información que nos enviaste.' },
          { title: 'Conversamos', text: 'Hablamos directamente con vos sobre la propiedad y tus opciones.' },
          { title: 'Decidís', text: 'Vos decidís si avanzar y cuándo. Sin compromiso.' }
        ]
      },
      investor: {
        title: 'Para inversionistas',
        steps: [
          { title: 'Contanos qué comprás', text: 'Tipos de propiedad, estrategia, rango de precio y zonas.' },
          { title: 'Guardamos tus criterios', text: 'Tenemos tus criterios registrados.' },
          { title: 'Buscamos oportunidades que encajen', text: 'Cuando una propiedad coincide con tus criterios, te contactamos.' },
          { title: 'Revisás', text: 'Revisás los detalles y decidís.' }
        ]
      }
    },
    quick: {
      h2: 'Empezá por tu propiedad.',
      text: 'Algunos datos nos ayudan a entender la propiedad y tu situación.',
      label: 'Dirección de la propiedad',
      placeholder: 'Calle y número, ciudad, ZIP',
      cta: 'Revisar mi propiedad →'
    },
    sticky: 'Revisar mi propiedad',
    images: {
      hero: 'El centro de Cleveland y el río Cuyahoga en un día despejado',
      sign: 'El cartel de Cleveland junto al lago, con edificios del centro detrás',
      dusk: 'El centro de Cleveland sobre el río al atardecer',
      sellerCard: 'Una casa familiar de dos plantas con porche techado y césped',
      investorCard: 'Una casa de madera con porche amplio y un magnolio en flor',
      story: 'Luz de la tarde sobre el porche de una casa antigua de madera'
    }
  }
} satisfies Record<Lang, unknown>;
