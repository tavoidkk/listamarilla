import type { Metadata } from "next";
import { LegalDoc, type LegalSection } from "@/components/legal/LegalDoc";
import { MarketingHeader } from "@/components/brand/MarketingHeader";
import { MarketingFooter } from "@/components/brand/MarketingFooter";

export const metadata: Metadata = {
  title: "Política de Privacidad — LISTAMARILLA",
  description:
    "Política de Privacidad de LISTAMARILLA: qué datos tratamos, con qué finalidad, cómo los protegemos y cuáles son tus derechos.",
};

const CONTACT_EMAIL = "info@paginas-amarillas.app";

const sections: LegalSection[] = [
  {
    id: "introduccion",
    title: "Introducción",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Esta Política de Privacidad explica cómo LISTAMARILLA (en adelante,
            &ldquo;nosotros&rdquo;, &ldquo;nuestro&rdquo; o el &ldquo;Proveedor&rdquo;) recopila,
            utiliza, almacena y protege la información en el marco del directorio digital de
            servicios para condominios (el &ldquo;Servicio&rdquo;).
          </>
        ),
      },
      {
        type: "note",
        text: (
          <>
            LISTAMARILLA es el proveedor tecnológico del Servicio. En el caso del portal de
            vecinos, el condominio contratante (la &ldquo;Junta&rdquo;) actúa como responsable de
            los datos de su directorio y nosotros los tratamos en su nombre para operar y
            mantener el Servicio.
          </>
        ),
      },
    ],
  },
  {
    id: "datos",
    title: "Qué datos recopilamos",
    blocks: [
      {
        type: "p",
        text: "Según cuál sea tu rol, podemos recopilar las siguientes categorías de datos:",
      },
      {
        type: "list",
        items: [
          <>
            <strong>Datos de la cuenta de la Junta:</strong> nombre del contacto y del edificio,
            correo electrónico, teléfono e identificador interno de la organización.
          </>,
          <>
            <strong>Configuración del portal:</strong> nombre del edificio, imagen de fondo,
            logo, paleta de colores, categorías y el código de seguridad (almacenado de forma
            protegida).
          </>,
          <>
            <strong>Contenido del directorio:</strong> datos de los prestadores publicados por
            los vecinos (nombre, teléfono y datos complementarios que el vecino decida incluir).
          </>,
          <>
            <strong>Calificaciones y reseñas:</strong> valoración, comentario del votante y, si
            este así lo indica, su nombre, piso y apartamento.
          </>,
          <>
            <strong>Identificador de sesión anónimo:</strong> un identificador aleatorio que se
            genera en el navegador del vecino para evitar votos duplicados y moderar los aportes.
            No permite identificar a la persona por sí mismo.
          </>,
          <>
            <strong>Datos técnicos:</strong> tipo de dispositivo y navegador, direcciones IP,
            fecha y hora de acceso; se usan para seguridad, prevención de abuso y diagnóstico.
          </>,
        ],
      },
    ],
  },
  {
    id: "finalidades",
    title: "Finalidad del tratamiento",
    blocks: [
      {
        type: "list",
        items: [
          "Proveer y operar el portal de vecinos y el panel de administración del condominio.",
          "Permitir la publicación, búsqueda y calificación de prestadores de servicios.",
          "Prevenir el voto duplicado, el contenido fraudulento y el uso indebido del código de seguridad.",
          "Mantener la seguridad del Servicio, detectar fallos y brindar soporte técnico.",
          "Enviar comunicaciones relacionadas con la cuenta, la renovación, el soporte y cambios del Servicio.",
          "Cumplir con obligaciones legales y resolver disputas.",
        ],
      },
      {
        type: "p",
        text: "No vendemos, alquilamos ni compartimos datos personales con terceros con fines comerciales.",
      },
    ],
  },
  {
    id: "base-legal",
    title: "Base legal del tratamiento",
    blocks: [
      {
        type: "list",
        items: [
          "La ejecución del contrato de servicio entre la Junta y LISTAMARILLA, necesario para operar el portal.",
          "El consentimiento del interesado, en los casos en que se solicite expresamente (por ejemplo, datos opcionales que el votante decide aportar).",
          "El interés legítimo de LISTAMARILLA en la seguridad, funcionamiento y prevención de abuso del Servicio, sin que prevalezcan los derechos y libertades de los interesados.",
        ],
      },
    ],
  },
  {
    id: "seguridad",
    title: "Cómo almacenamos y protegemos los datos",
    blocks: [
      {
        type: "list",
        items: [
          "Los datos se alojan en infraestructura en la nube (bases de datos PostgreSQL/Supabase) con cifrado en tránsito (TLS) y en reposo.",
          "El acceso a los datos está restringido por roles y permisos (RLS) y solo el personal autorizado puede operar la infraestructura.",
          "Se realizan copias de seguridad periódicas para la recuperación ante fallos.",
          "El código de seguridad del edificio se almacena de forma protegida y solo se expone a quien corresponde validarlo.",
        ],
      },
    ],
  },
  {
    id: "conservacion",
    title: "Conservación de los datos",
    blocks: [
      {
        type: "list",
        items: [
          "Mantendremos los datos mientras el portal del condominio esté activo y durante los plazos de retención técnica que resulten razonables.",
          "Al cancelar el servicio, la Junta podrá solicitar una exportación de los datos del directorio.",
          "Una vez tramitada la baja, los datos se eliminan o se anonimizan en un plazo razonable, salvo que la ley exija su conservación por un período mayor.",
        ],
      },
    ],
  },
  {
    id: "localstorage",
    title: "Almacenamiento local del navegador y cookies",
    blocks: [
      {
        type: "list",
        items: [
          "El portal de vecinos usa almacenamiento local del navegador para guardar el identificador de sesión anónimo y la preferencia de aceptación del aviso del directorio.",
          "No utilizamos cookies de rastreo publicitario ni construimos perfiles con fines de marketing.",
          "El vecino puede eliminar el identificador de sesión al limpiar los datos del sitio desde su navegador; al hacerlo, podrá volver a votar en futuras consultas.",
        ],
      },
    ],
  },
  {
    id: "comparticion",
    title: "Con quién compartimos los datos",
    blocks: [
      {
        type: "list",
        items: [
          "Proveedores tecnológicos necesarios para operar el Servicio (alojamiento, bases de datos, correo y procesamiento de pagos), limitado a lo estrictamente indispensable.",
          "La Junta del edificio, que administra su portal y gestiona el contenido del directorio.",
          "Autoridades o tribunales competentes, únicamente cuando exista un requerimiento legal válido.",
        ],
      },
      {
        type: "note",
        text: "Los datos pueden residir en servidores situados fuera del país del condominio. En esos casos aplicamos medidas de protección adecuadas (cláusulas contractuales y controles de seguridad) conforme a la legislación de protección de datos aplicable.",
      },
    ],
  },
  {
    id: "derechos",
    title: "Derechos de los interesados",
    blocks: [
      {
        type: "p",
        text: "Conforme a la legislación aplicable, toda persona cuyos datos tratemos puede:",
      },
      {
        type: "list",
        items: [
          "Solicitar el acceso a sus datos personales.",
          "Solicitar la rectificación de datos inexactos o incompletos.",
          "Solicitar la supresión (cancelación) de sus datos cuando ya no sean necesarios para las finalidades previstas.",
          "Oponerse al tratamiento en determinadas circunstancias o solicitar la limitación del mismo.",
          "Solicitar la portabilidad de los datos, cuando resulte aplicable.",
          "Retirar el consentimiento otorgado en cualquier momento, sin afectar la licitud del tratamiento previo.",
        ],
      },
      {
        type: "p",
        text: (
          <>
            En el ámbito del portal de vecinos, la gestión de contactos y reseñas del directorio
            corresponde a la Junta desde su panel de administración. Para el ejercicio de
            derechos o ante cualquier solicitud, puedes escribirnos a{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-amber-600 underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            indicando el edificio, y responderemos en un plazo razonable conforme a la ley.
          </>
        ),
      },
    ],
  },
  {
    id: "menores",
    title: "Menores de edad",
    blocks: [
      {
        type: "p",
        text: (
          <>
            El Servicio está dirigido a adultos responsables de la administración de un
            condominio y a residentes en edad legal. No recopilamos a sabiendas datos personales
            de menores de edad. Si detectamos que se ha tratado información de un menor sin la
            debida autorización, procederemos a su eliminación.
          </>
        ),
      },
    ],
  },
  {
    id: "responsabilidad-junta",
    title: "Responsabilidades de la Junta del condominio",
    blocks: [
      {
        type: "list",
        items: [
          "Informar a los vecinos sobre la existencia del directorio, su funcionamiento y el hecho de que se comparte dentro del edificio.",
          "Velar por que la publicación de prestadores no contenga datos personales de terceros sin su consentimiento, ni información falsa o difamatoria.",
          "Custodiar el código de seguridad y rotarlo ante la salida de vecinos o sospecha de divulgación.",
          "Atender las solicitudes de los vecinos relativas a contactos, reseñas y calificaciones de su edificio.",
        ],
      },
    ],
  },
  {
    id: "cambios",
    title: "Cambios en esta Política",
    blocks: [
      {
        type: "list",
        items: [
          "Podemos actualizar esta Política de Privacidad para reflejar cambios en el Servicio o en la normativa aplicable.",
          "Los cambios se publicarán en esta página con la fecha de última actualización y, cuando sean relevantes, se notificarán por correo o al acceder al panel.",
          "El uso continuado del Servicio después de la actualización implica la aceptación de la nueva versión de la Política.",
        ],
      },
    ],
  },
  {
    id: "contacto",
    title: "Contacto",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Para consultas, ejercicio de derechos de protección de datos o solicitudes de
            eliminación, escríbenos a{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-amber-600 underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            . Siempre indicamos el nombre del edificio y el motivo de tu solicitud para poder
            atenderte mejor.
          </>
        ),
      },
    ],
  },
];

export default function PrivacidadPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MarketingHeader />
      <LegalDoc
        badge="Documento legal"
        title="Política de Privacidad"
        subtitle="Cómo LISTAMARILLA protege los datos de las juntas de condominio, sus vecinos y los prestadores que se comparten en el directorio."
        updatedOn="17 de septiembre de 2026"
        contactEmail={CONTACT_EMAIL}
        sections={sections}
      />
      <MarketingFooter />
    </div>
  );
}