// Seller multi-step form and thank-you copy (spec 28–42).
// Option `value`s must match src/lib/leads.ts and the Airtable select options
// exactly; only the labels are translated.
import type { Lang } from './ui';

type Option = { value: string; label: string };

const PROPERTY_TYPE_VALUES = ['Single Family', 'Duplex', 'Triplex', 'Fourplex', 'Multifamily', 'Other'];
const CONDITION_VALUES = ['Move-in ready', 'Needs some work', 'Needs significant repairs', 'Major renovation', 'Not sure'];
const SITUATION_VALUES = [
  'I simply want to sell',
  'Inherited property',
  'Vacant property',
  'Rental property',
  'Relocating',
  'Financial situation',
  'Property needs too many repairs',
  'Other'
];
const TIMELINE_VALUES = ['As soon as possible', 'Within 30 days', '1–3 months', '3–6 months', 'More than 6 months', 'Just exploring'];

const zip = (values: string[], labels: string[]): Option[] => values.map((value, i) => ({ value, label: labels[i] }));

export const sellerForm = {
  en: {
    progress: 'Step {n} of {total}',
    back: '← Back',
    next: 'Continue →',
    submit: 'SUBMIT MY PROPERTY →',
    submitting: 'Sending…',
    tryAgain: 'TRY AGAIN',
    optional: '(optional)',
    stepNames: ['Address', 'Type', 'Condition', 'Situation', 'Timeline', 'Contact'],
    steps: {
      address: {
        title: 'Where is the property?',
        hint: 'Street address, city and ZIP if you have it.',
        label: 'Property address',
        placeholder: '123 Main St, Cleveland, OH 44102'
      },
      propertyType: {
        title: 'What type of property is it?',
        options: zip(PROPERTY_TYPE_VALUES, PROPERTY_TYPE_VALUES)
      },
      condition: {
        title: 'What condition is it in?',
        hint: 'An honest guess is fine. We consider properties in any condition.',
        options: zip(CONDITION_VALUES, CONDITION_VALUES)
      },
      situation: {
        title: "What's your situation?",
        hint: 'Choose all that apply.',
        options: zip(SITUATION_VALUES, SITUATION_VALUES)
      },
      timeline: {
        title: 'When would you like to sell?',
        options: zip(TIMELINE_VALUES, TIMELINE_VALUES)
      },
      contact: {
        title: 'How can we reach you?',
        hint: 'First name and a phone number or email.',
        firstName: 'First name',
        lastName: 'Last name',
        phone: 'Phone',
        email: 'Email'
      }
    },
    consent:
      'By submitting this form, you agree that Keyvora Home may contact you regarding your property inquiry. Message and data rates may apply. Consent is not required as a condition of any purchase.',
    errors: {
      address: 'Please enter the property address.',
      choice: 'Please choose an option to continue.',
      multi: 'Please choose at least one option.',
      firstName: 'Please enter your first name.',
      contact: 'Please enter a phone number or an email.',
      phone: 'Please enter a valid phone number (at least 10 digits).',
      email: 'Please enter a valid email address.',
      general: 'Something went wrong while submitting your information. Please try again.'
    },
    thanks: {
      title: 'Thanks — We Received Your Property Information | Keyvora Home',
      description: 'We received your property information. Next, we will reach out for a conversation about the property and your situation.',
      eyebrow: 'Received',
      h1: 'Thanks — we received your property information.',
      lead: "We'll review what you shared. The next step is a conversation with you about the property and your situation, with no obligation.",
      steps: [
        'We review the details you sent.',
        'We contact you by phone or email.',
        'We talk about the property and your options. You decide what happens next.'
      ],
      call: 'CALL KEYVORA',
      home: 'RETURN HOME',
      how: 'Learn how the process works →'
    }
  },
  es: {
    progress: 'Paso {n} de {total}',
    back: '← Atrás',
    next: 'Continuar →',
    submit: 'ENVIAR MI PROPIEDAD →',
    submitting: 'Enviando…',
    tryAgain: 'INTENTAR DE NUEVO',
    optional: '(opcional)',
    stepNames: ['Dirección', 'Tipo', 'Estado', 'Situación', 'Plazo', 'Contacto'],
    steps: {
      address: {
        title: '¿Dónde está la propiedad?',
        hint: 'Calle y número, ciudad y ZIP si lo tenés.',
        label: 'Dirección de la propiedad',
        placeholder: '123 Main St, Cleveland, OH 44102'
      },
      propertyType: {
        title: '¿Qué tipo de propiedad es?',
        options: zip(PROPERTY_TYPE_VALUES, ['Casa unifamiliar', 'Dúplex', 'Tríplex', 'Cuádruplex', 'Multifamiliar', 'Otro'])
      },
      condition: {
        title: '¿En qué estado está?',
        hint: 'Una estimación sincera alcanza. Consideramos propiedades en cualquier estado.',
        options: zip(CONDITION_VALUES, [
          'Lista para habitar',
          'Necesita algunos arreglos',
          'Necesita reparaciones importantes',
          'Renovación completa',
          'No estoy seguro'
        ])
      },
      situation: {
        title: '¿Cuál es tu situación?',
        hint: 'Elegí todas las que correspondan.',
        options: zip(SITUATION_VALUES, [
          'Simplemente quiero vender',
          'Propiedad heredada',
          'Propiedad vacía',
          'Propiedad en alquiler',
          'Me mudo',
          'Situación financiera',
          'Necesita demasiadas reparaciones',
          'Otra'
        ])
      },
      timeline: {
        title: '¿Cuándo te gustaría vender?',
        options: zip(TIMELINE_VALUES, [
          'Lo antes posible',
          'Dentro de 30 días',
          'En 1 a 3 meses',
          'En 3 a 6 meses',
          'En más de 6 meses',
          'Solo estoy explorando'
        ])
      },
      contact: {
        title: '¿Cómo te contactamos?',
        hint: 'Tu nombre y un teléfono o email.',
        firstName: 'Nombre',
        lastName: 'Apellido',
        phone: 'Teléfono',
        email: 'Email'
      }
    },
    consent:
      'Al enviar este formulario, aceptás que Keyvora Home se comunique con vos sobre tu consulta por la propiedad. Pueden aplicar cargos por mensajes y datos. El consentimiento no es condición para ninguna compra.',
    errors: {
      address: 'Ingresá la dirección de la propiedad.',
      choice: 'Elegí una opción para continuar.',
      multi: 'Elegí al menos una opción.',
      firstName: 'Ingresá tu nombre.',
      contact: 'Ingresá un teléfono o un email.',
      phone: 'Ingresá un teléfono válido (al menos 10 dígitos).',
      email: 'Ingresá un email válido.',
      general: 'Algo salió mal al enviar tus datos. Probá de nuevo.'
    },
    thanks: {
      title: 'Gracias — Recibimos los Datos de tu Propiedad | Keyvora Home',
      description: 'Recibimos los datos de tu propiedad. El siguiente paso es una conversación sobre la propiedad y tu situación.',
      eyebrow: 'Recibido',
      h1: 'Gracias — recibimos los datos de tu propiedad.',
      lead: 'Vamos a revisar lo que nos contaste. El siguiente paso es una conversación con vos sobre la propiedad y tu situación, sin compromiso.',
      steps: [
        'Revisamos los datos que enviaste.',
        'Te contactamos por teléfono o email.',
        'Conversamos sobre la propiedad y tus opciones. Vos decidís cómo seguir.'
      ],
      call: 'LLAMAR A KEYVORA',
      home: 'VOLVER AL INICIO',
      how: 'Ver cómo funciona el proceso →'
    }
  }
} satisfies Record<Lang, unknown>;
