# Arrow Secret Santa

Aplicación Next.js + React + TypeScript con `@jlopvil/mui-kit` publicada en npm. Español, catalán e inglés.

Entre 3 y 30 participantes con nombre y email únicos, presupuesto, fecha y exclusiones bidireccionales. El servidor sortea y envía desde Gmail un correo individual con la persona a quien regalar. Plantillas HTML y texto, fecha y presupuesto adaptados al idioma elegido al iniciar el envío. La web nunca recibe las asignaciones.

## Desarrollo

Node.js >= 22.13.0. Todas las dependencias, incluida `@jlopvil/mui-kit`, se instalan desde npm; no se necesitan carpetas externas.

```sh
npm install
npm run dev
```

Abre http://localhost:3000/es (también `/ca` y `/en`).

## Conectar Gmail (sin comprar dominio)

1. Activa la verificación en dos pasos de tu cuenta de Google.
2. Abre https://myaccount.google.com/apppasswords y crea una contraseña de aplicación para «Arrow Secret Santa».
3. Copia `.env.example` a `.env.local` si no existe. Configura:

```dotenv
GMAIL_USER=tu-cuenta@gmail.com
GMAIL_APP_PASSWORD="contraseña de aplicación de 16 letras"
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
EMAIL_DAILY_LIMIT=100
```

Usa la contraseña de aplicación, nunca la contraseña habitual. Se admiten los espacios que Google muestra entre grupos de letras. No compartas ni subas `.env.local` a Git. El remitente será «Arrow Secret Santa» con la dirección de `GMAIL_USER`; no hace falta configurar EMAIL_FROM ni DNS ni Resend.

Google puede no ofrecer contraseñas de aplicación en cuentas con ciertas políticas de empresa, Protección Avanzada o determinadas configuraciones de verificación. En ese caso habría que implementar OAuth2. Ayuda oficial: https://support.google.com/accounts/answer/185833?hl=es

En Vercel configura las mismas variables en Settings → Environment Variables y vuelve a desplegar; `.env.local` no se sube. `NEXT_PUBLIC_SITE_URL` puede ser tu dirección `https://tu-proyecto.vercel.app`. Gmail usa SMTP con TLS en `smtp.gmail.com:465`; el servidor debe permitir esa conexión. Gmail aplica sus propios límites y puede bloquear conexiones que considere sospechosas. Esta integración está pensada para grupos pequeños.

Comprueba las credenciales sin enviar emails:

```sh
npm run verify:gmail
```

Para probar la entrega real, configura las credenciales y crea un sorteo con tres direcciones bajo tu control. No uses las direcciones de simulación de Resend: este proyecto ya envía por Gmail.

## Plantillas y verificaciones

```sh
npm run preview:emails
npm test
npm run lint
npm run typecheck
npm run build
```

Las vistas previas están en `email-previews/es.html`, `ca.html`, `en.html` y sus versiones `.txt`. No envían correos. Las pruebas automatizadas usan un transporte simulado.

## Reintentos y almacenamiento

Redis persiste el sorteo antes de enviar, con un identificador guardado previamente en sessionStorage. La configuración y el idioma quedan fijados al iniciar el envío. Los correos se envían de uno en uno: los confirmados se omiten en reintentos y los rechazados explícitamente pueden volver a intentarse con la misma asignación.

SMTP no ofrece una clave de idempotencia como Resend. Cada destinatario se reclama atómicamente en Redis antes de enviar. Si el proceso muere, Gmail responde de forma ambigua o falla Redis después de la aceptación, el destinatario queda en estado `sending`: no se reenvía automáticamente. La interfaz avisa y el organizador debe revisar la carpeta Enviados de Gmail antes de continuar. Un Message-ID estable permite localizar el mensaje, pero no garantiza deduplicación por Gmail.

Para una recuperación manual, el administrador debe detener solicitudes activas, revisar el mensaje con Message-ID `santa-<id>-<índice>@gmail.com` y el destinatario. La clave `santa:draw:<id>:email:<índice>` puede marcarse `sent` si el envío se confirma. Solo marcarla `failed` cuando se haya establecido que no se envió; de lo contrario conservar el bloqueo. Nunca borrar el sorteo para resolver un fallo ambiguo. Los pendientes anteriores de Resend se bloquean y requieren revisión, no se reenvían por Gmail.

Los pendientes caducan para envío a los 7 días. Tras éxito, se elimina el contenido privado del lote y se conservan la huella y los estados de envío. Los pendientes contienen datos personales y deben revisarse periódicamente: redactar su campo `emails` al caducar, conservando la fecha y el bloqueo. No borrar las claves de operaciones que un cliente pueda reintentar. Gmail conserva los correos en la cuenta remitente.

La API exige origen propio y JSON, limita el cuerpo a 32 KiB y aplica una cuota diaria compartida (100 destinatarios nuevos por defecto). Es una protección básica para una web sin cuentas; antes de abrirla a tráfico público elevado añade autenticación o CAPTCHA y límites por usuario. Redis es obligatorio y debe tener Eviction desactivado. El límite diario no sustituye los límites propios de Gmail.

## SEO y publicación en Google

Las páginas `/es`, `/ca` y `/en` incluyen títulos y descripciones propios, un H1 descriptivo, preguntas frecuentes renderizadas en el servidor, enlaces entre idiomas, canonical, hreflang (incluido `x-default`), Open Graph y datos estructurados `WebSite` y `WebApplication`. `/sitemap.xml` enumera las tres páginas y `/robots.txt` indica el sitemap.

Para activar estos cambios en la web pública:

1. Configura `NEXT_PUBLIC_SITE_URL` con el dominio público definitivo antes de compilar y desplegar. Debe ser el mismo dominio que quieres indexar, sin rutas de idioma. En Vercel, si se omite, se utiliza `VERCEL_PROJECT_PRODUCTION_URL`. Evita publicar canonical con localhost o con un dominio de preview.
2. Añade ese dominio a [Google Search Console](https://search.google.com/search-console). Puedes verificar una propiedad de dominio mediante DNS o una propiedad de prefijo de URL mediante etiqueta HTML: en ese caso guarda solo el valor de `content` en `GOOGLE_SITE_VERIFICATION` y vuelve a desplegar.
3. Envía `https://TU-DOMINIO/sitemap.xml` en el apartado Sitemaps e inspecciona `/es`, `/en` y `/ca` para solicitar su indexación. Comprueba que son accesibles sin contraseña y que el hosting no añade `X-Robots-Tag: noindex` en producción.
4. Revisa consultas, impresiones e indexación en Search Console. El SEO facilita el descubrimiento y la comprensión del contenido, pero no garantiza posiciones ni indexación. Los enlaces desde otras webs relevantes también ayudan a descubrir el sitio.

Verificación del HTML generado (usa el mismo `NEXT_PUBLIC_SITE_URL` al compilar y verificar):

```sh
npm run build
npm run verify:metadata
```

La verificación comprueba las tres traducciones, H1, contenido visible, enlaces, datos estructurados, canonical, hreflang e imágenes sociales. No envía emails ni solicitudes de indexación.
