import { legalIdentity } from "./config";

export const documentSlugs = [
  "aviso-legal",
  "privacidad",
  "cookies",
  "condiciones",
] as const;
export type DocumentSlug = (typeof documentSlugs)[number];
export const titles: Record<DocumentSlug, string> = {
  "aviso-legal": "Aviso legal",
  privacidad: "Política de privacidad",
  cookies: "Política de cookies y almacenamiento",
  condiciones: "Condiciones de uso",
};
export function isDocument(value: string): value is DocumentSlug {
  return documentSlugs.some((slug) => slug === value);
}
type Section = { title: string; paragraphs: string[] };
export function legalDocuments(): Record<DocumentSlug, Section[]> {
  const id = legalIdentity();
  const identity = `Titular y responsable: ${id.name}. NIF/CIF: ${id.taxId}. Domicilio: ${id.address}. Contacto y ejercicio de derechos: ${id.email}.`;
  return {
    "aviso-legal": [
      {
        title: "1. Identificación del titular",
        paragraphs: [
          identity,
          `Datos registrales: ${id.registry}. Nombre del servicio: Arrow Secret Santa. El titular está establecido en España.`,
        ],
      },
      {
        title: "2. Objeto del sitio",
        paragraphs: [
          "Arrow Secret Santa permite organizar sorteos de amigo invisible de 3 a 30 personas y enviar por correo el resultado individual. El servicio no vende regalos, no cobra el presupuesto indicado ni interviene en intercambios o compras. Las ideas de regalo son orientativas.",
        ],
      },
      {
        title: "3. Propiedad intelectual",
        paragraphs: [
          "Los contenidos y elementos propios del sitio están protegidos por las normas de propiedad intelectual que les sean aplicables. Las bibliotecas, marcas y materiales de terceros conservan sus respectivas licencias y derechos. Se permite el uso del sitio para organizar sorteos conforme a las condiciones de uso; este acceso no transfiere derechos sobre los contenidos. Se respetan las excepciones y usos permitidos por la ley.",
        ],
      },
      {
        title: "4. Enlaces y funcionamiento",
        paragraphs: [
          "Los sitios externos enlazados tienen sus propios responsables y condiciones. El titular no controla su contenido. Se adoptarán medidas razonables para mantener el servicio y corregir errores comunicados. No se garantiza funcionamiento ininterrumpido ni entrega del correo en una fecha concreta. Estas previsiones no excluyen responsabilidades legalmente exigibles ni derechos irrenunciables de los usuarios.",
        ],
      },
      {
        title: "5. Contacto y legislación",
        paragraphs: [
          "Las consultas y reclamaciones pueden dirigirse al contacto indicado arriba. Resulta aplicable la legislación española y europea pertinente, sin privar a consumidores de la protección imperativa que les corresponda. Cualquier controversia se someterá a los tribunales competentes según la ley, sin imponer un fuero distinto del legalmente aplicable.",
        ],
      },
    ],
    privacidad: [
      {
        title: "1. Responsable y alcance",
        paragraphs: [
          identity,
          "Esta política explica el tratamiento de los datos de organizadores y participantes de Arrow Secret Santa. El servicio está previsto para mayores de 18 años y grupos personales. No se solicitan datos sensibles. No incluyas información de salud, creencias u otros datos especialmente protegidos en nombres, títulos o exclusiones.",
        ],
      },
      {
        title: "2. Datos y procedencia",
        paragraphs: [
          "El organizador introduce nombres o alias, direcciones de correo, título del evento, presupuesto, fecha y exclusiones entre participantes. Se generan identificadores, asignaciones aleatorias, una huella del contenido y estados de entrega. Los datos de participantes proceden del organizador, que debe informarles antes de añadirlos y asegurarse de que esperan participar. Nombre y correo son necesarios para enviar el resultado; los detalles del evento y las exclusiones son opcionales.",
          "Durante la navegación, el alojamiento puede tratar IP, fecha, URL solicitada y datos técnicos del navegador en sus registros operativos. El formulario se conserva en sessionStorage del navegador. No se han incorporado herramientas de publicidad o analítica al código de la aplicación.",
        ],
      },
      {
        title: "3. Finalidades y bases jurídicas",
        paragraphs: [
          "Para el organizador, gestionar el servicio solicitado y remitir los resultados se basa en la ejecución de las condiciones del servicio (artículo 6.1.b del RGPD). Para participantes invitados por otra persona, se prevé el interés legítimo del titular y del organizador en realizar el intercambio esperado y comunicar su resultado (artículo 6.1.f), sujeto a una evaluación documentada de necesidad, expectativas e impacto antes de la apertura pública. Puedes oponerte si tu situación particular lo justifica.",
          "Proteger el servicio frente a abuso, evitar envíos duplicados y resolver incidencias responde al interés legítimo en la seguridad y fiabilidad. Atender obligaciones legales y derechos se basa en el artículo 6.1.c cuando exista una obligación aplicable; otras consultas se atienden por interés legítimo en responderlas. No utilizamos estos datos para marketing ni los vendemos. No se pide un consentimiento genérico por el mero uso de la web.",
        ],
      },
      {
        title: "4. Destinatarios y confidencialidad",
        paragraphs: [
          "El servidor realiza el sorteo y guarda temporalmente los mensajes en Upstash Redis para gestionar reintentos. Se utiliza Gmail personal para tramitar los correos y conservar mensajes en la cuenta remitente. La base Upstash Redis está configurada en AWS eu-central-1 (Frankfurt, Alemania), según la configuración confirmada por el titular. El proveedor del alojamiento procesa las solicitudes: " +
            id.hosting +
            ". Las entidades jurídicas, contratos y regiones deben corresponder a las cuentas efectivamente contratadas.",
          "Cada participante recibe el nombre o alias de la persona a quien debe regalar y los detalles comunes del evento, sin la lista de correos del grupo. El organizador conoce los datos que introdujo; la web no le devuelve las asignaciones. El titular y sus proveedores pueden acceder a los datos necesarios para operar y resolver incidencias. No se trata de cifrado de extremo a extremo. También podrán comunicarse datos a autoridades cuando una norma lo exija.",
        ],
      },
      {
        title: "5. Transferencias internacionales",
        paragraphs: [
          "El uso de proveedores con infraestructura o acceso fuera del Espacio Económico Europeo puede implicar transferencias internacionales. Deben comprobarse las entidades receptoras, subencargados y regiones, y aplicarse una decisión de adecuación vigente o garantías adecuadas, como cláusulas contractuales tipo y medidas complementarias cuando procedan. No se presume que cualquier cuenta de Gmail o cualquier región de Redis ofrezca las mismas garantías.",
          id.transfers,
          "Puedes solicitar al contacto del responsable información sobre las garantías aplicadas y una copia o referencia de las mismas, con las limitaciones necesarias para proteger información confidencial.",
        ],
      },
      {
        title: "6. Conservación y eliminación",
        paragraphs: [
          "En el navegador, sessionStorage permanece durante la sesión de la pestaña; la restauración de sesiones puede prolongarla. Reiniciar el formulario sustituye el estado local, pero no retira mensajes enviados ni elimina registros del servidor. Puedes borrar los datos del sitio desde tu navegador.",
          "En Redis, tras completarse el envío se elimina el contenido de los mensajes del lote y permanecen su huella, fecha y estados técnicos. Los envíos pendientes dejan de admitirse para reintento a los 7 días; ese vencimiento no borra automáticamente su contenido. Los contadores de cuota caducan a las 48 horas. Los mensajes de Gmail y los justificantes técnicos no tienen actualmente supresión automática en esta aplicación.",
          id.retention,
          "Los datos necesarios para reclamaciones u obligaciones legales se conservarán o bloquearán durante el plazo que corresponda, con acceso restringido. Las copias de seguridad deben someterse a su propio ciclo documentado de eliminación. No se promete un plazo de borrado que no esté aplicado en los sistemas.",
        ],
      },
      {
        title: "7. Tus derechos",
        paragraphs: [
          "Puedes solicitar acceso, rectificación, supresión, limitación y, cuando proceda, portabilidad, así como oponerte a tratamientos basados en interés legítimo. Si un tratamiento adicional se basara en consentimiento, podrías retirarlo sin afectar al tratamiento previo. Escribe al contacto del responsable indicando tu petición y el correo usado en el sorteo; no envíes de entrada un documento de identidad completo. Solo se solicitará información adicional proporcionada cuando sea necesaria para verificar tu identidad.",
          "Se responderá en un mes desde la recepción. Si la complejidad o el número de solicitudes lo justifican, el plazo puede ampliarse otros dos meses, informándote dentro del primer mes. Puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es) o la autoridad de control competente. Una petición de supresión no permite recuperar correos ya entregados en buzones ajenos.",
        ],
      },
      {
        title: "8. Decisiones automatizadas e información a invitados",
        paragraphs: [
          "El reparto se calcula automáticamente para respetar las exclusiones. No se elaboran perfiles ni se toman decisiones con efectos jurídicos o de importancia similar sobre las personas. Si recibes un correo inesperado, no es necesario registrarte: contacta con el responsable para solicitar información sobre el origen, oponerte y pedir la supresión que proceda. La información a los invitados se facilita también en el primer correo y debe compartirse por el organizador antes de incluirlos.",
        ],
      },
      {
        title: "9. Cambios",
        paragraphs: [
          "La fecha y versión figuran en esta página. Los cambios relevantes se comunicarán por medios adecuados antes de aplicar nuevas finalidades o condiciones que lo requieran.",
        ],
      },
    ],
    cookies: [
      {
        title: "1. Qué tecnologías utilizamos",
        paragraphs: [
          "Esta política incluye cookies y tecnologías similares, como sessionStorage y localStorage. El código de la aplicación no instala cookies de publicidad ni analítica. Utiliza almacenamiento propio para mantener el sorteo durante la sesión y preferencias visuales del sistema de interfaz. El inventario debe verificarse también sobre el dominio de producción y sus servicios de alojamiento.",
        ],
      },
      {
        title: "2. Inventario del almacenamiento propio",
        paragraphs: [
          "arrow-secret-santa:session:v2 — sessionStorage, propio. Contiene el formulario, participantes, exclusiones e identificador y estado de envío para conservar el sorteo y evitar duplicados al reintentar. Duración: sesión de la pestaña, sujeta a restauración por el navegador. Se actualiza al reiniciar el formulario.",
          "my-ui-mode y la familia my-ui-color-scheme (incluidas las claves con sufijos -light y -dark, si se crean) — localStorage, propio, gestionado por el proveedor de interfaz. Almacena preferencias de tema, sin nombres ni correos del sorteo. Persiste hasta borrarse desde el navegador. La presencia concreta depende de las preferencias y la versión de la interfaz.",
        ],
      },
      {
        title: "3. Consentimiento",
        paragraphs: [
          "El almacenamiento estrictamente necesario para prestar el servicio solicitado, y el de preferencias elegidas por el usuario cuando procede la exención, no requiere un consentimiento adicional conforme al artículo 22.2 de la LSSI. La versión revisada no incorpora un banner de aceptación de publicidad o analítica porque no integra esas finalidades. Si se añaden tecnologías no exentas, deberán permanecer bloqueadas hasta obtener consentimiento, con opciones de aceptar y rechazar igualmente accesibles y un mecanismo para retirarlo.",
        ],
      },
      {
        title: "4. Gestión desde el navegador",
        paragraphs: [
          "Puedes consultar y borrar el almacenamiento del dominio en los ajustes de privacidad o datos de sitios de tu navegador. Bloquearlo puede impedir conservar el formulario o enviar con garantías frente a reintentos. El borrado local no elimina correos ni datos que ya estén en el servidor. En equipos compartidos, borra los datos del sitio al terminar.",
        ],
      },
      {
        title: "5. Terceros y contacto",
        paragraphs: [
          "Gmail y Redis se utilizan desde el servidor: su uso no equivale a instalar cookies de esos servicios en tu navegador. Si visitas un enlace externo, se aplican las políticas de ese sitio. Consulta la política de privacidad para conocer proveedores, derechos y transferencias.",
          identity,
        ],
      },
    ],
    condiciones: [
      {
        title: "1. Servicio y ámbito",
        paragraphs: [
          "Arrow Secret Santa es una herramienta gratuita para organizar intercambios personales de regalos entre 3 y 30 personas adultas. No requiere cuenta. Estas condiciones se ponen a disposición antes de iniciar el envío. El titular y sus datos de contacto constan en el aviso legal. No se ofrece en esta versión un servicio de tratamiento por cuenta de empresas ni una plataforma para campañas comerciales.",
        ],
      },
      {
        title: "2. Obligaciones del organizador",
        paragraphs: [
          "Introduce únicamente personas que esperen participar, informa previamente sobre el uso de sus datos y comparte la política de privacidad. Comprueba que las direcciones son correctas y que puedes facilitar esos datos para el sorteo. No introduzcas datos sensibles ni de menores. No uses el servicio para spam, suplantación, acoso, pruebas con correos ajenos o actividades ilícitas. El organizador no puede prestar consentimiento en nombre de todos mediante una casilla genérica.",
        ],
      },
      {
        title: "3. Sorteo y envío",
        paragraphs: [
          "Las exclusiones limitan las combinaciones y pueden hacer imposible el reparto. Al iniciar el envío se fija el sorteo para que los reintentos mantengan las asignaciones. Los correos pueden llegar a spam, retrasarse o no entregarse. En estados ambiguos se bloquea el reenvío automático para evitar duplicados; contacta con el titular antes de repetir el sorteo. La información ya enviada no puede retirarse de los buzones de participantes.",
          "El presupuesto y la fecha son acuerdos orientativos del grupo. La herramienta no gestiona pagos, no garantiza que se intercambien regalos ni responde del cumplimiento de acuerdos entre participantes. Las sugerencias de regalo no son ofertas de venta.",
        ],
      },
      {
        title: "4. Disponibilidad y responsabilidad",
        paragraphs: [
          "Se pueden aplicar cuotas, suspender usos abusivos y realizar mantenimiento de manera proporcionada. Se procurará atender las incidencias notificadas. No se excluye responsabilidad por dolo, negligencia u otros supuestos en los que la ley impida limitarla, ni se restringen los derechos irrenunciables de consumidores.",
        ],
      },
      {
        title: "5. Privacidad y cancelación",
        paragraphs: [
          "La política de privacidad explica el almacenamiento y los derechos. Reiniciar el formulario permite comenzar otra configuración local, pero no cancela envíos ya iniciados ni borra automáticamente los datos del servidor. Para solicitar supresión o resolver una incidencia, utiliza el contacto del aviso legal.",
        ],
      },
      {
        title: "6. Cambios y reclamaciones",
        paragraphs: [
          "Las condiciones futuras no alterarán retroactivamente derechos adquiridos. Las reclamaciones se dirigirán al titular y podrán ejercitarse ante las autoridades o tribunales competentes. Se aplicará la legislación española, con respeto a las normas imperativas y al fuero que corresponda a cada usuario.",
        ],
      },
    ],
  };
}
