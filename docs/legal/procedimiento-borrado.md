# Procedimiento de borrado y verificación

Versión 1.0 — 22/09/2026. Responsable: Javier López Villanueva. Ámbito confirmado por el titular: Vercel Inc. (funciones `fra1`), Upstash Redis (AWS `eu-central-1`) y Gmail personal.

**Estado:** procedimiento manual preparado. No se ha accedido a las cuentas ni eliminado datos. No hay cron ni automatización de borrado instalada. La puesta en marcha se acredita con la primera ejecución y el registro de revisiones posteriores; no basta con copiar estos plazos a la política de privacidad.

## 1. Frecuencia y alcance

| Datos                                          | Revisión                                 | Actuación                                                                                                            |
| ---------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Lotes Redis completados                        | Diaria                                   | Verificar que el código ya ha retirado `emails` tras el éxito                                                        |
| Lotes Redis pendientes de más de 7 días        | Diaria                                   | Retirar solo `emails`, con envíos detenidos y conservando bloqueos                                                   |
| Justificantes Redis y estados por destinatario | En cada revisión                         | Conservar mientras el diseño permita reintentar el mismo ID; resolver el plazo definitivo antes de cerrar producción |
| Correos del servicio                           | Semanal                                  | Identificar mensajes con más de 30 días y mover únicamente esos mensajes a la papelera                               |
| Papelera Gmail                                 | Semanal                                  | Verificar ciclo de eliminación, sin vaciar toda la papelera personal                                                 |
| Logs y copias                                  | Antes de publicar y tras cambios de plan | Documentar y verificar los plazos reales de cada proveedor                                                           |

La revisión diaria puede mantener un lote pendiente aproximadamente hasta 8 días; la semanal puede mantener un correo en el buzón aproximadamente hasta 37 días desde su envío. Gmail elimina los mensajes tras 30 días en la papelera: el plazo combinado puede llegar aproximadamente a 67 días, si se cumple la frecuencia. No declarar «eliminación definitiva a los 30 días». Estos plazos no acreditan eliminación de copias internas del proveedor.

## 2. Redis: retirar contenido sin provocar reenvíos

Este procedimiento corresponde al código actual de `src/server/send-draw.ts`. No usar borrado masivo, `FLUSHDB`, ni TTL general sobre `santa:draw:*`. Si desaparece una clave principal, la API puede interpretar un reintento como un sorteo nuevo.

1. En Upstash, comprobar que se está operando sobre la base del proyecto, región AWS eu-central-1. No exportar el contenido completo a hojas de cálculo o logs.
2. Inventariar mediante el explorador de claves o `SCAN` las claves con prefijo `santa:draw:`. Distinguir lotes principales `santa:draw:<UUID>` de estados `santa:draw:<UUID>:email:<índice>`; no modificar los segundos en esta limpieza.
3. Leer únicamente lo necesario: `created` (milisegundos desde epoch), `status`, `provider` y presencia de `emails`. Candidatos: lotes completados que aún contengan `emails`, o pendientes cuyo `created` sea estrictamente anterior a la hora actual menos 7 × 24 horas. Si falta o es inválida la fecha, registrar incidencia; no inferir antigüedad del UUID.
4. Antes de cualquier edición, bloquear nuevas solicitudes a `/api/draw` en **todos los despliegues que compartan la base**, incluidos previews y despliegues antiguos accesibles. Una opción es retirar temporalmente la credencial de envío y desplegar la configuración, pero solo bloquea los despliegues que reciban ese cambio: los anteriores deben quedar también inaccesibles para enviar. Detener clientes administrativos que puedan escribir. Esperar a que terminen las funciones en curso y comprobarlo en Vercel; el límite declarado en la ruta es 300 segundos. Si no se puede acreditar la ausencia de escritores, no editar manualmente: hace falta una herramienta de limpieza con control de concurrencia.
5. Volver a leer cada candidato ya sin operaciones en curso. Retirar exclusivamente la propiedad `emails` del JSON del lote. Mantener `hash`, `created`, `status`, `provider` y cualquier otro campo intactos. Conservar la clave principal y todas las claves por destinatario. No cambiar `sending` a `failed`, no poner `sent` a un lote incompleto y no borrar bloqueos.
6. Volver a leer y verificar: `emails` ya no existe, fecha/huella/estado no han cambiado y las claves por destinatario permanecen. El código rechaza pendientes vencidos antes de intentar acceder a `emails`; ese orden es esencial.
7. Rehabilitar solicitudes solo cuando la comprobación termine. Verificar salud mediante comprobaciones sin envío; no reintentar sorteos reales como prueba de limpieza.
8. Registrar fecha, cantidad de lotes revisados y redactados, errores y próxima revisión. No registrar nombres, emails ni asignaciones. Si se necesita trazabilidad por lote para una incidencia, guardar el UUID con acceso restringido y plazo definido.

La revisión de un envío ambiguo debe realizarse antes de eliminar su correo de Gmail. Los lotes antiguos de otro proveedor y los registros corruptos necesitan revisión separada; no alterar sus bloqueos para hacerlos compatibles.

**Limitación pendiente:** los recibos (`hash`, UUID y estados) siguen siendo potencialmente vinculables y carecen de caducidad segura. El procedimiento minimiza contenido, pero no resuelve esa conservación indefinida. Antes de fijar su plazo hay que modificar el protocolo para rechazar operaciones antiguas incluso cuando su clave ya no exista. No añadir un TTL aislado ni afirmar anonimización.

## 3. Gmail personal: revisión semanal

1. Entrar en la cuenta remitente configurada para la aplicación. Crear una etiqueta específica, por ejemplo `Arrow-Secret-Santa`, para clasificar mensajes verificados del servicio. La etiqueta no es una prueba de origen ni una automatización de borrado.
2. En la primera revisión, localizar candidatos en Enviados con `in:sent older_than:30d`. Esta búsqueda también devuelve correo personal: **no seleccionar todos los resultados para borrarlos**.
3. En cada candidato, usar «Mostrar original» y comprobar remitente, contenido del sorteo y el encabezado `Message-ID`. La aplicación genera IDs con estructura `santa-<UUID>-<índice>@gmail.com`. Para localizar un mensaje concreto se puede usar `in:anywhere rfc822msgid:santa-<UUID>-<índice>@gmail.com`, sustituyendo el ID completo. No usar un comodín del Message-ID como criterio de borrado.
4. Etiquetar solo mensajes confirmados. Para revisiones posteriores, `in:sent label:Arrow-Secret-Santa older_than:30d` reduce candidatos, pero sigue siendo necesario comprobarlos. Incluir también notificaciones de fallo relacionadas, si contienen datos personales, una vez verificadas.
5. Excluir de la limpieza solo mensajes necesarios para una incidencia o reclamación concreta, dejando motivo, responsable y fecha de revisión. No mantener excepciones sin plazo. Resolver o documentar los envíos ambiguos antes de eliminar la evidencia que permite verificarlos.
6. Mover a la papelera los **mensajes individuales** verificados. En vista de conversaciones, comprobar que no se arrastran respuestas personales u otros mensajes del hilo. Si no se puede distinguirlos, abrir el mensaje y utilizar su acción individual de eliminación.
7. Comprobar los mensajes movidos y registrar la operación. Gmail permite recuperarlos de la papelera durante su periodo de conservación y los elimina tras 30 días. Archivar, quitar una etiqueta o sacar de Enviados no equivale a borrar.
8. En la siguiente revisión, verificar que las eliminaciones previas siguen el ciclo previsto. No utilizar «Vaciar papelera» global: contiene datos ajenos a la aplicación. Una supresión definitiva anticipada, si corresponde, debe limitarse a mensajes concretos y realizarse conscientemente por el titular.

La contraseña de aplicación SMTP usada para enviar no instala una tarea de limpieza. Este procedimiento no presupone Google Workspace, Vault ni sus controles administrativos. No se han configurado filtros que borren mensajes futuros ni se ha accedido a tu buzón.

## 4. Derechos de supresión, logs, copias y navegador

- Las solicitudes de derechos se atienden por el procedimiento de derechos e incidentes; no deben esperar por defecto al calendario ordinario. Antes de borrar un lote aún vigente, bloquear sus envíos y resolver técnicamente la conservación del bloqueo: el procedimiento de retirar `emails` anterior se limita a lotes completados o vencidos.
- En Vercel, inventariar runtime logs, registros de seguridad/acceso, exportaciones y log drains si existen. Registrar plan, duración efectiva y destinos externos. No afirmar «30 días» sin comprobar la configuración. Evitar cuerpos de solicitudes, destinatarios y contenidos de correo en nuevos logs.
- En Upstash y demás proveedores, comprobar si hay backups, snapshots y restauraciones disponibles, con sus ciclos y mecanismos de eliminación. Pedir aclaración al proveedor si el panel no lo indica. No crear una copia íntegra antes de cada limpieza. Tras una restauración, repetir las supresiones pendientes antes de volver a habilitar envíos.
- Borrar únicamente los datos del dominio de la aplicación en equipos compartidos. Reiniciar el formulario sustituye su estado local; no elimina el contenido de Redis ni de Gmail. La restauración de sesiones del navegador puede prolongar `sessionStorage`.
- Los mensajes entregados en buzones de participantes quedan fuera del control directo del titular. No afirmar que borrar el remitente los elimina allí.

## 5. Registro mínimo de ejecución

Guardar con acceso restringido un registro por revisión. No incluir contenido de mensajes. Propuesta para registros agregados sin PII: conservar 12 meses para comprobar la continuidad del procedimiento y revisar después su necesidad. Expedientes identificables de incidencias/derechos tienen su propio plazo justificado.

| Fecha UTC                      | Responsable             | Sistema       | Revisados | Retirados / a papelera | Verificación | Incidencias y referencia mínima | Próxima revisión |
| ------------------------------ | ----------------------- | ------------- | --------- | ---------------------- | ------------ | ------------------------------- | ---------------- |
| Pendiente de primera ejecución | Javier López Villanueva | Redis / Gmail | —         | —                      | —            | —                               | —                |

Cuando empiece a ejecutarse, completar `LEGAL_RETENTION` con los plazos **efectivamente aplicados**, incluida papelera, excepciones justificadas, logs y copias. Mantener el pendiente de justificantes Redis mientras no haya una solución técnica. No retirar el aviso de borrador por el solo hecho de disponer de este documento.

## Referencias verificadas

- [Eliminar mensajes en Gmail](https://support.google.com/mail/answer/7401): papelera y eliminación a los 30 días.
- [Operadores de búsqueda de Gmail](https://support.google.com/mail/answer/7190): `in:`, `older_than:`, `label:` y `rfc822msgid:`.
- Comportamiento local revisado: `src/server/send-draw.ts`, `src/app/api/draw/route.ts`, `src/server/gmail.ts` y `src/game/useGame.ts`.
