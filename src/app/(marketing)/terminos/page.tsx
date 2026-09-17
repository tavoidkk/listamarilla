import type { Metadata } from "next";
import { LegalDoc, type LegalSection } from "@/components/legal/LegalDoc";
import { MarketingHeader } from "@/components/brand/MarketingHeader";
import { MarketingFooter } from "@/components/brand/MarketingFooter";

export const metadata: Metadata = {
  title: "Términos y Condiciones — LISTAMARILLA",
  description:
    "Términos y Condiciones de uso del servicio LISTAMARILLA: directorio digital de servicios para juntas de condominio y vecinos.",
};

const CONTACT_EMAIL = "info@paginas-amarillas.app";

const sections: LegalSection[] = [
  {
    id: "aceptacion",
    title: "Aceptación de los Términos",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Al acceder, suscribir o utilizar el servicio de directorio digital de servicios
            para condominios que opera LISTAMARILLA (el &ldquo;Servicio&rdquo;), tanto la junta de
            condominio o administrador que contrata (el &ldquo;Condominio&rdquo; o la
            &ldquo;Junta&rdquo;) como los vecinos que consultan el portal (los
            &ldquo;Residentes&rdquo;) aceptan los presentes Términos y Condiciones de Uso.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            Si no estás de acuerdo con estos términos, no utilices el Servicio ni accedas al
            portal de vecinos. El uso del Servicio implica tu aceptación plena e incondicional de
            este documento y de la{" "}
            <a href="/privacidad" className="font-semibold text-amber-600 underline-offset-4 hover:underline">
              Política de Privacidad
            </a>
            , que forma parte integral de estos términos.
          </>
        ),
      },
    ],
  },
  {
    id: "servicio",
    title: "Descripción del Servicio",
    blocks: [
      {
        type: "p",
        text: (
          <>
            LISTAMARILLA es una aplicación web (PWA) que permite a las juntas de condominio
            publicar un directorio digital de prestadores de servicios de confianza. Los
            Residentes pueden consultar los contactos por categoría, agregar prestadores y
            calificar los servicios que han utilizado, todo dentro del portal único del
            edificio, sin necesidad de descargar una aplicación.
          </>
        ),
      },
      {
        type: "list",
        items: [
          <>
            <strong>Portal para vecinos (Residentes):</strong> consulta de contactos por
            categoría, búsqueda, registro de prestadores y votación con reseñas.
          </>,
          <>
            <strong>Panel de administración (Junta):</strong> configuración del edificio,
            personalización de imagen y colores, gestión de categorías y contactos, código de
            seguridad y QR imprimible para el edificio.
          </>,
          <>
            <strong>Acceso sin cuenta:</strong> el portal de vecinos funciona en el navegador
            del teléfono; los Residentes no necesitan registrarse ni crear una cuenta.
          </>,
        ],
      },
    ],
  },
  {
    id: "roles",
    title: "Roles y responsabilidades",
    blocks: [
      {
        type: "p",
        text: "El Servicio distingue tres roles con capacidades y obligaciones distintas:",
      },
      {
        type: "list",
        items: [
          <>
            <strong>Junta o Administrador:</strong> contrata y configura el edificio, define el
            branding, el código de seguridad, y administra categorías y contactos. Es
            responsable de la veracidad de los datos que publica y de custodiar sus
            credenciales de acceso.
          </>,
          <>
            <strong>Residente o Vecino:</strong> consulta el directorio, propone contactos y vota
            mediante el código de seguridad del edificio. Es responsable de usar el código solo
            para los fines del directorio y de abstenerse de publicar contenido falso o
            difamatorio.
          </>,
          <>
            <strong>Operador de la plataforma (interno):</strong> rol administrativo de
            LISTAMARILLA para la operación, mantenimiento y soporte técnico del Servicio.
          </>,
        ],
      },
    ],
  },
  {
    id: "registro",
    title: "Registro y credenciales de la Junta",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Para activar el Servicio, la Junta debe solicitar el acceso o crear su cuenta de
            administración. La cuenta queda asociada a una o más direcciones de correo
            electrónico autorizadas dentro del panel de administración.
          </>
        ),
      },
      {
        type: "list",
        items: [
          "La Junta es responsable de mantener la confidencialidad de sus contraseñas y de toda actividad realizada desde sus credenciales.",
          "Ante cualquier uso no autorizado o sospecha de compromiso de la cuenta, la Junta debe notificar de inmediato a LISTAMARILLA vía info@paginas-amarillas.app.",
          "LISTAMARILLA puede solicitar verificación de identidad o de representación del condominio antes de habilitar o restablecer accesos.",
        ],
      },
    ],
  },
  {
    id: "codigo-seguridad",
    title: "Código de seguridad de los vecinos",
    blocks: [
      {
        type: "p",
        text: (
          <>
            La Junta define un código de seguridad que delimita qué pueden hacer los Residentes
            en el portal. Sin el código vigente, los Vecinos pueden consultar el directorio pero
            no pueden agregar prestadores ni votar.
          </>
        ),
      },
      {
        type: "list",
        items: [
          "El código debe comunicarse únicamente a Residentes del edificio por canales oficiales del condominio (WhatsApp del edificio, lobby, ascensor).",
          "La Junta es responsable de su custodia y de rotarlo cuando se muden vecinos o se sospeche divulgación externa.",
          "El código no constituye una medida de autenticación absoluta: complementa, no sustituye, el criterio de la Junta sobre quién puede aportar contenido.",
        ],
      },
    ],
  },
  {
    id: "contenido",
    title: "Contenido del directorio y conducta",
    blocks: [
      {
        type: "p",
        text: "Los participantes del Servicio se comprometen a usar el directorio de buena fe y a no:",
      },
      {
        type: "list",
        items: [
          "Publicar contactos o reseñas falsos, fraudulentos, difamatorios, discriminatorios, ofensivos o que violen derechos de terceros.",
          "Agregar a prestadores sin el consentimiento de los interesados o con datos personales de terceros sin autorización.",
          "Votar más de una vez por contacto, manipular calificaciones o usarse múltiples identidades para sesgar resultados.",
          "Intentar acceder, alterar o descifrar datos de otros condominios, de la plataforma o de sus infraestructura.",
          "Usar el Servicio para fines ilícitos, de acoso, spam o distribución de contenido malicioso.",
        ],
      },
      {
        type: "note",
        text: (
          <>
            LISTAMARILLA se reserva el derecho de eliminar contenido que infrinja estas reglas y,
          en casos graves o reiterados, de suspender la cuenta del condominio o el acceso al
          portal.
          </>
        ),
      },
    ],
  },
  {
    id: "calificaciones",
    title: "Calificaciones y votos",
    blocks: [
      {
        type: "list",
        items: [
          "Cada Residente emite un voto por contacto mediante un identificador de sesión anónimo generado en su navegador.",
          "Las calificaciones y comentarios se muestran de forma agregada y las reseñas pueden aparecer de forma anónima o con el nombre, piso y apartamento que el propio votante elija indicar.",
          "La Junta puede moderar o eliminar contactos y reseñas desde el panel de administración.",
          "Las calificaciones son opiniones de los Residentes y no constituyen una recomendación de LISTAMARILLA.",
        ],
      },
    ],
  },
  {
    id: "prestadores",
    title: "Relación con los prestadores de servicios",
    blocks: [
      {
        type: "p",
        text: (
          <>
            LISTAMARILLA no es intermediario, agente ni representante de los prestadores de
            servicios listados en el directorio. No contratamos, supervisamos, verificamos ni
            garantizamos la calidad, puntualidad, precios o resultados de ningún prestador.
          </>
        ),
      },
      {
        type: "note",
        text: (
          <>
            Cualquier contratación realizada por un Residente o por el condominio con un
            prestador listado es de la exclusiva responsabilidad de las partes contratantes, tal
            como se informa a los vecinos en el aviso de aceptación del portal.
          </>
        ),
      },
    ],
  },
  {
    id: "propiedad-intelectual",
    title: "Propiedad intelectual",
    blocks: [
      {
        type: "list",
        items: [
          <>
            La marca LISTAMARILLA, su logo, diseño, código fuente, textos y elementos gráficos son
            propiedad de LISTAMARILLA o de sus licenciantes y están protegidos por normas de
            propiedad intelectual. Queda prohibida su copia, réplica o uso sin autorización.
          </>,
          <>
            El contenido que la Junta sube al Servicio (nombre del edificio, imagen, colores,
            categorías, contactos) es de su propiedad o de la de los Residentes que lo aportan.
            Al subirlo otorgan a LISTAMARILLA una licencia limitada, no exclusiva y revocable
            para operar, almacenar y mostrar dicho contenido exclusivamente con el fin de prestar
            el Servicio.
          </>,
        ],
      },
    ],
  },
  {
    id: "tarifas",
    title: "Tarifas y pagos",
    blocks: [
      {
        type: "p",
        text: (
          <>
            El Servicio se ofrece bajo un plan anual con un precio de USD $100 por edificio al
            año (menos tarifas o impuestos aplicables). El pago se procesa mediante medios de
            pago seguros de terceros.
          </>
        ),
      },
      {
        type: "list",
        items: [
          "El plan incluye el portal PWA para vecinos, el panel de administración, categorías personalizables, calificaciones, QR imprimible, branding personalizado y soporte por correo.",
          "La subscripción se renueva por períodos anuales a menos que el condominio cancele antes del vencimiento.",
          "Los impuestos, tasas o cargos bancarios que correspondan según la jurisdicción del condominio podrán sumarse al precio publicado.",
        ],
      },
    ],
  },
  {
    id: "cancelacion",
    title: "Cancelación, reembolsos y datos",
    blocks: [
      {
        type: "list",
        items: [
          "El condominio puede cancelar cuando quiera, sin cláusulas de permanencia ni penalizaciones.",
          "Antes de dar de baja el servicio, la Junta puede solicitar la exportación de los datos del directorio para conservar una copia.",
          "Al cancelarse, el portal de vecinos deja de estar accesible y los datos del condominio se eliminan conforme a la Política de Privacidad y a los plazos de conservación allí indicados.",
          "Salvo derecho legal aplicable, no se realizan reembolsos de porciones no utilizadas del período anual ya pagado.",
        ],
      },
    ],
  },
  {
    id: "suspension",
    title: "Suspensión y terminación por el proveedor",
    blocks: [
      {
        type: "p",
        text: (
          <>
            LISTAMARILLA podrá suspender temporalmente o terminar el acceso al Servicio, previo
            aviso razonable, cuando: se incumplan estos términos; la cuenta presente morosidad;
            se detecte uso indebido, contenido ilegal o compromiso del código de seguridad; o
            cuando sea necesario para proteger la integridad, seguridad o disponibilidad de la
            plataforma.
          </>
        ),
      },
      {
        type: "note",
        text: "En caso de suspensión por responsabilidad del condominio, los datos se conservan durante el período previsto en la Política de Privacidad para permitir la regularización.",
      },
    ],
  },
  {
    id: "disponibilidad",
    title: "Disponibilidad y garantías",
    blocks: [
      {
        type: "list",
        items: [
          "El Servicio se ofrece &ldquo;tal cual&rdquo; y &ldquo;según disponibilidad&rdquo;, sin garantías expresas o implícitas de disponibilidad continua, salvo las que no puedan excluirse por ley.",
          "Realizamos esfuerzos razonables de disponibilidad, mantenimiento y copias de seguridad periódicas de los datos alojados.",
          "No garantizamos que el Servicio esté libre de errores, cortes o interrupciones, ni que funcione en todos los dispositivos o navegadores.",
        ],
      },
    ],
  },
  {
    id: "limitacion-responsabilidad",
    title: "Limitación de responsabilidad",
    blocks: [
      {
        type: "list",
        items: [
          "En la máxima medida permitida por la ley, LISTAMARILLA no será responsable por daños indirectos, incidentales, especiales o consecuentes (incluida la pérdida de datos, lucro cesante o interrupción del negocio) derivados del uso o imposibilidad de uso del Servicio.",
          "La responsabilidad agregada de LISTAMARILLA por cualquier reclamo no superará el monto efectivamente pagado por el condominio en los últimos doce (12) meses anteriores al hecho que originó el reclamo.",
          "El condominio es responsable del contenido que publique y de la gestión de los datos personales que trata dentro de su portal, incluidas las consecuencias de su divulgación indebida.",
        ],
      },
      {
        type: "note",
        text: "Nada en estos términos limita la responsabilidad que no pueda limitarse por ley ni los derechos que la legislación aplicable reconocen a los consumidores en su jurisdicción.",
      },
    ],
  },
  {
    id: "indemnizacion",
    title: "Indemnización",
    blocks: [
      {
        type: "p",
        text: (
          <>
            La Junta se obliga a mantener indemne a LISTAMARILLA y a su personal frente a
            reclamaciones, daños, costos y gastos derivados de: el contenido publicado en el
            portal de su edificio; el uso indebido del código de seguridad; el incumplimiento de
            estos términos; o la violación de derechos de terceros (incluidos los datos
            personales de residentes y prestadores).
          </>
        ),
      },
    ],
  },
  {
    id: "privacidad",
    title: "Privacidad y protección de datos",
    blocks: [
      {
        type: "p",
        text: (
          <>
            El tratamiento de los datos personales en el marco del Servicio se rige por la
            Politica de Privacidad aplicable, que forma parte de estos términos. Revisa qué datos
            tratamos, con qué finalidad, los derechos que te asisten y cómo ejercerlos.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            El condominio se reconoce responsable (corresponsable) de la información de su
            directorio y debe informar a sus vecinos sobre el uso de la plataforma conforme a la
            legislación de protección de datos aplicable.
          </>
        ),
      },
    ],
  },
  {
    id: "legislacion",
    title: "Legislación aplicable y jurisdicción",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Estos términos se rigen por la legislación de la jurisdicción donde esté establecido
            el condominio contratante, sin perjuicio de las normas imperativas aplicables. Toda
            controversia se resolverá preferentemente mediante acuerdo directo y, en su defecto,
            conforme a los mecanismos de solución de controversias que disponga la ley local.
          </>
        ),
      },
    ],
  },
  {
    id: "modificaciones",
    title: "Modificaciones a los Términos",
    blocks: [
      {
        type: "list",
        items: [
          "LISTAMARILLA puede actualizar estos términos cuando sea necesario para reflejar cambios en el Servicio o la normativa aplicable.",
          "Los cambios se publicarán en esta página con la fecha de última actualización y, cuando sean relevantes, se notificarán por correo o al iniciar sesión en el panel.",
          "El uso continuado del Servicio después de la publicación de los cambios implica su aceptación.",
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
            Ante cualquier duda sobre estos términos, el Servicio o el ejercicio de tus derechos,
            escríbenos a{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-amber-600 underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </>
        ),
      },
    ],
  },
];

export default function TerminosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MarketingHeader />
      <LegalDoc
        badge="Documento legal"
        title="Términos y Condiciones de Uso"
        subtitle="Las reglas que gobiernan el uso del directorio digital de servicios para juntas de condominio y residentes."
        updatedOn="17 de septiembre de 2026"
        contactEmail={CONTACT_EMAIL}
        sections={sections}
      />
      <MarketingFooter />
    </div>
  );
}