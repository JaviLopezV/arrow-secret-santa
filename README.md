# Arrow Secret Santa

Amigo invisible presencial para grupos de 3 a 30 personas. Interfaz en español, catalán e inglés, sin cuentas, correos ni servicios externos. Cada persona da y recibe un regalo; nadie se asigna a sí mismo. Las exclusiones de parejas se aplican en ambos sentidos.

## Instalación

Node.js >= 22.13 y npm. Mantén `mui-component-library` como carpeta hermana: el selector compartido `LanguageSelector` está en su API local 0.4.0, pero no se presupone que esa misma API esté publicada en npm.

Desde la carpeta de este proyecto:

```bash
# Preparar la biblioteca compartida (si todavía no está compilada).
npm --prefix ../mui-component-library ci
npm --prefix ../mui-component-library run build

# Instalar con el lockfile del proyecto.
npm ci
npm run dev
```

Abre `http://localhost:3000`. `/` redirige a `/es`; también existen `/ca` y `/en`. El selector conserva la sesión. No necesitas configurar variables para trabajar en local.

La dependencia `file:../mui-component-library` y `.npmrc` con `install-links=true` instalan una copia del paquete sin arrastrar el React de desarrollo de la biblioteca. Si cambia la biblioteca, vuelve a compilarla y reinstala el paquete local en este consumidor.

## Jugar

1. Indica opcionalmente nombre del grupo, presupuesto en euros y fecha.
2. Añade entre 3 y 30 participantes con nombres distintos. Puedes añadir un apellido si dos personas se llaman igual. Enter añade un nombre; el botón de eliminar también retira sus exclusiones.
3. Opcionalmente excluye parejas. Si las restricciones impiden un sorteo completo, la aplicación lo explica y permite corregirlas.
4. Haz el sorteo. Cada participante elige su nombre, confirma que está a solas y descubre a quién regala.
5. Oculta el resultado antes de pasar el dispositivo. Puedes volver a consultarlo sin repetir el sorteo. Crear otro sorteo requiere confirmar el borrado de la sesión actual.

El resultado se oculta al cerrar el diálogo, recargar, cambiar de idioma o perder el foco de la ventana. La sesión y el progreso se guardan en `sessionStorage`, clave `arrow-secret-santa:session:v1`. Se validan al recuperarlos y se muestra un aviso si falla el almacenamiento. Cerrar la pestaña puede perderlos; la restauración de pestañas depende del navegador.

**Privacidad del modo presencial:** no hay autenticación ni cifrado de las asignaciones almacenadas. Cualquier persona con acceso a la pestaña o a sus herramientas de desarrollo puede consultarlas. No se generan enlaces privados ni se envían emails. El dispositivo debe permanecer dentro del grupo. No hay sincronización, analítica ni envío de nombres a un servidor.

El motor usa aleatoriedad criptográfica de Web Crypto y emparejamiento bipartito con caminos aumentantes. Encuentra una solución si existe, con trabajo acotado para 30 participantes. No garantiza distribución uniforme entre todos los emparejamientos válidos. Las parejas recíprocas están permitidas salvo exclusión explícita. En despliegue, utiliza HTTPS para Web Crypto; localhost es válido en desarrollo.

## Convenciones y estructura

- Next.js 15 App Router, React 19 y TypeScript estricto, siguiendo los rangos compatibles de los proyectos de referencia. Las versiones instaladas quedan fijadas en `package-lock.json`.
- `eslint.config.mjs` copiado sin alteraciones del portfolio: máximo 300 líneas por archivo y 200 por función, sin desactivar reglas. Los archivos de pruebas admiten 600 líneas según esa misma configuración.
- npm, alias `@/*` a `src/*` y compilaciones separadas: `.next-dev` para desarrollo y `.next` para producción, como en el portfolio.
- MUI 7 y `@jlopvil/mui-kit`: provider, selector de idiomas, superficies, tipografía, botones, campos, selecciones, diálogo, alertas y layout compartidos. MUI directo solo para piezas no exportadas por la biblioteca: acordeón, avatar, chip, separador y barra de progreso.
- Patrón de `arrow-learn-games`: rutas por idioma, diccionarios JSON tipados, validación de locales, bootstrap del tema y selector compartido. No hace falta una dependencia adicional de i18n para estas tres rutas.
- Identidad propia crema, verde noche y coral; ilustración SVG original, tipografía de sistema sin descargas externas, foco visible, enlace para saltar al contenido, controles táctiles y diálogos accesibles. Se respeta movimiento reducido.

| Ruta                    | Responsabilidad                                  |
| ----------------------- | ------------------------------------------------ |
| `src/app/[locale]`      | Páginas, idioma HTML y metadatos                 |
| `src/app/providers.tsx` | Tema y componentes MUI                           |
| `src/components`        | Presentación y controles de la aplicación        |
| `src/game/draw.ts`      | Algoritmo independiente de React                 |
| `src/game/useGame.ts`   | Estado y acciones de la sesión                   |
| `src/game/storage.ts`   | Validación de datos recuperados                  |
| `src/game/types.ts`     | Modelos y límites                                |
| `src/i18n`              | Textos es/ca/en y contrato tipado                |
| `src/lib/metadata.ts`   | URL base y metadatos localizados                 |
| `tests`                 | Pruebas nativas de Node, sin framework adicional |

La revisión de referencias incluyó sus configuraciones, README disponibles, fuentes, exports y dependencias; el portfolio no contiene README. El único `AGENTS.md` encontrado en los tres repositorios pertenece a la biblioteca y se ha consultado junto a su arquitectura y roadmap. No se han trasladado sus restricciones exclusivas de publicación a esta aplicación ni se ha modificado la biblioteca.

## URL pública y metadatos

Copia `.env.example` a `.env.local` si necesitas establecer la URL. Configura `NEXT_PUBLIC_SITE_URL` con la URL pública real **antes de compilar**; no hay dominio de producción predefinido.

Orden de resolución, igual que en las referencias:

1. `NEXT_PUBLIC_SITE_URL`, URL absoluta con esquema.
2. `https://${VERCEL_PROJECT_PRODUCTION_URL}`, si Vercel proporciona esa variable.
3. `http://localhost:3000` para desarrollo.

Se generan `metadataBase`, título, descripción, canonical, alternativos es/ca/en y x-default, Open Graph, Twitter `summary_large_image`, sitemap y robots. `public/og.png` es una imagen propia de 1200 × 630 con dimensiones y textos alternativos traducidos. No hay identificadores sociales ni datos personales copiados del portfolio.

El SVG fuente está en `public/gift.svg`. Para regenerar la composición PNG se incluye `node scripts/generate-og.mjs`, que utiliza Sharp ya instalado por Next.js. No hace falta regenerarla para compilar.

## Verificar

```bash
npm run lint -- --max-warnings=0
npm run typecheck
npm test
npm run build
npm run verify:metadata
npm start
```

`verify:metadata` inspecciona el HTML de producción de los tres idiomas y la cabecera PNG real. Si compilas con variables de entorno, ejecuta la verificación con los mismos valores exportados en el entorno (el script Node no carga `.env.local` automáticamente).

Las diez pruebas cubren tamaños 3–30, autoasignaciones, unicidad, exclusiones bidireccionales, casos imposibles, comparación exhaustiva de los 64 grafos de exclusión de cuatro personas, inmutabilidad, recuperación y corrupción de sesiones, fechas y paridad de traducciones.

Comprobación manual en navegador: añadir con Enter, duplicados, sorteo imposible y corrección, revelación y ocultación, Escape, recarga, selector es/ca/en, cancelación y confirmación del reinicio. Diseño revisado a 1280 px, 390 px y 320 px; sin desbordamiento horizontal en móvil. La compilación de producción y los metadatos también se han comprobado.

## Despliegue y límites

```bash
npm run build
npm start
```

El entorno de construcción necesita la carpeta hermana `mui-component-library` compilada. Para desplegar este repositorio de forma aislada, publica primero una versión de `@jlopvil/mui-kit` que incluya `LanguageSelector` y sustituye la dependencia local por esa versión, regenerando el lockfile. No se ha publicado ni desplegado el proyecto.

El alcance actual es jugar por turnos en un dispositivo. El envío remoto de resultados, la autenticación, la recuperación entre dispositivos y un backend quedan fuera de esta implementación.
