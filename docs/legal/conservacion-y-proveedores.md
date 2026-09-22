# Conservación, proveedores y transferencias

Estado: propuesta operativa pendiente de aprobación e implantación. Los plazos siguientes NO describen tareas automáticas ya instaladas. No copiarlos a `LEGAL_RETENTION` hasta haberlos implantado y verificado.

## Configuración confirmada por el titular

Vercel Inc.: funciones en Frankfurt, Alemania (`fra1`), con CDN global. Upstash Redis: AWS `eu-central-1`, Frankfurt, Alemania. Correo: Gmail personal, no Google Workspace. Esta confirmación identifica servicios y regiones declaradas; no es una auditoría de sus paneles, contratos, copias o accesos de soporte.

El [procedimiento de borrado](procedimiento-borrado.md) desarrolla los pasos manuales, sus verificaciones y las limitaciones actuales. No se ha ejecutado ninguna eliminación ni programado una tarea automática.

## Calendario propuesto

| Conjunto                             | Estado real                                                     | Propuesta que debe validar el responsable                                                                                                                                               |
| ------------------------------------ | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Formulario del navegador             | sessionStorage; reinicio sustituye estado; restauración posible | Sesión, facilitar borrado al terminar en equipo compartido                                                                                                                              |
| Emails del lote Redis completado     | Se eliminan del lote al éxito                                   | Mantener ese comportamiento y verificarlo                                                                                                                                               |
| Emails Redis pendientes              | Reintento vence a 7 días; contenido sin TTL                     | Revisar diariamente; redactar `emails` al vencer, con operación atómica y sin envíos activos                                                                                            |
| Huella y estados Redis               | Sin caducidad; evitan reenvío del mismo ID                      | Rediseñar primero la admisión de identificadores caducados; después fijar plazo mínimo justificado. No borrar claves de bloqueo mientras un cliente pueda reintentar                    |
| Contadores de cuota                  | TTL de 48 horas                                                 | Mantener 48 horas                                                                                                                                                                       |
| Gmail enviado y papelera             | Conservación de la cuenta, sin tarea propia                     | Revisión semanal: mover mensajes verificados con más de 30 días a la papelera; Gmail los elimina después de 30 días en ella. No equivale a supresión definitiva a los 30 días del envío |
| Logs del alojamiento                 | Configuración por confirmar                                     | Propuesta: 30 días, sin cuerpos ni emails; ampliar solo evidencia concreta de incidente                                                                                                 |
| Solicitudes de derechos e incidentes | Sin política                                                    | Resolver caso y conservar evidencia mínima durante el plazo legal justificado; documentar fundamento, bloqueo y fecha final                                                             |
| Backups                              | Configuración desconocida                                       | Inventariar ciclos de expiración y evitar reintroducir datos suprimidos al restaurar                                                                                                    |

La caducidad de un sorteo no equivale a supresión. La huella no equivale a anonimización. Añadir TTL sin estudiar idempotencia puede provocar envíos duplicados. Revisar la concurrencia al redactar pendientes: no sobrescribir una operación activa ni su estado confirmado. Documentar las operaciones con identificadores mínimos, sin exportar listas completas de participantes.

## Inventario y contratos

| Proveedor/servicio            | Función                            | Documentos/evidencias pendientes                                                                                                                     |
| ----------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vercel Inc. — fra1 confirmado | Ejecución y posibles logs          | Entidad contratada, acuerdo art. 28 cuando actúe como encargado, región de ejecución y logs, subencargados, plazo, accesos fuera del EEE             |
| Upstash Redis                 | Persistencia de mensajes y estados | Entidad y plan reales, DPA, base en AWS eu-central-1 confirmada, soporte/subencargados, medidas, borrado y copias                                    |
| Google/Gmail SMTP             | Entrega y cuenta remitente         | Gmail personal confirmado: verificar entidad, términos aplicables y rol. No atribuirle el DPA ni los controles de administración de Google Workspace |

Para cada proveedor conservar fecha, copia/enlace de versión contractual, aceptación, entidades, países y garantías. Si hay transferencias: verificar adecuación aplicable a la entidad y al servicio; si se usa un marco de certificación, comprobar la participación vigente y el alcance; en otro caso, cláusulas contractuales tipo, evaluación de transferencia y medidas complementarias. No afirmar residencia exclusiva UE por seleccionar una región sin revisar soporte, subencargados y copias.

Si el contrato de la cuenta Gmail usada no resulta adecuado para este tratamiento, migrar a una cuenta/servicio con condiciones apropiadas antes de abrir al público. No redactar ni firmar un DPA ficticio en nombre del proveedor: obtener el contrato real.

## Registro de revisión

Responsable: Javier López Villanueva. Proveedor / cuenta / entidad / región / contrato / garantía / evidencias / fecha / próxima revisión: pendiente para cada servicio. Actualizar las políticas públicas y `LEGAL_HOSTING`, `LEGAL_TRANSFERS`, `LEGAL_RETENTION` cuando se cierre cada punto.
