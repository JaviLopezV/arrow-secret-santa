# Registro de actividades de tratamiento

Versión 1.0 · Responsable: Javier López Villanueva, NIF 47575661T, jlopvil@gmail.com. Domicilio: pendiente. Aprobación del responsable: pendiente. No se ha designado un DPD; comprobar si el alcance futuro exige uno. Registro mantenido como medida de responsabilidad proactiva, sin presumir exención por tamaño.

| Actividad              | Personas y datos                                                                                   | Finalidad y base prevista                                                                            | Destinatarios                                                                         | Conservación                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Configuración local    | Organizador e invitados: nombres, emails, evento, presupuesto, fecha, exclusiones, identificadores | Preparar el servicio solicitado; contrato para organizador, interés legítimo evaluado para invitados | Navegador; servidor al iniciar envío                                                  | Sesión de pestaña; restauración del navegador posible                                                                   |
| Sorteo y entrega       | Invitados: nombres, emails, asignaciones, contenido y estados de mensajes                          | Ejecutar solicitud del organizador; interés legítimo para invitados que esperan participar           | Vercel fra1, Upstash AWS eu-central-1, Gmail personal; nombre del receptor a su dador | Contenido Redis eliminado tras éxito; pendientes vencen para reintento a 7 días pero no se borran; calendario pendiente |
| Fiabilidad y seguridad | UUID, huella SHA-256 de la solicitud, estados de entrega; IP y registros si los genera hosting     | Evitar duplicados, abuso y resolver incidencias; interés legítimo                                    | Alojamiento, Redis, administrador autorizado                                          | Cuotas: TTL 48 h; recibos y logs pendientes de política                                                                 |
| Atención y derechos    | Email, contenido de petición, evidencia mínima de identidad, respuesta                             | Atender derechos (obligación legal); consultas generales (interés legítimo)                          | Titular, correo, autoridades si procede                                               | Expediente limitado al plazo justificado de responsabilidad; concretar                                                  |

## Medidas observadas en código

- La API valida origen, tipo y tamaño del cuerpo (32 KiB) y limita el número global de destinatarios diarios.
- Validación de nombres, emails, exclusiones e identificadores; escape de HTML en correos.
- SMTP con TLS, credenciales de servidor, resultados individuales que no vuelven al navegador.
- Persistencia de sorteo y estados de envío para evitar reenvíos automáticos en resultados ambiguos.
- Supresión del contenido de mensajes en Redis tras éxito.

## Medidas operativas por acreditar

MFA en cuentas, acceso mínimo, separación de entornos, rotación de secretos, acceso administrativo registrado sin cuerpos de mensajes, regiones de datos, cifrado en reposo del proveedor, contratos, copias y recuperación, revisión de incidentes, borrado periódico y formación del titular. No dar estas medidas por implantadas por estar enumeradas.

La huella y los UUID son datos potencialmente vinculables, no datos anónimos. No publicar asignaciones ni incluir PII en logs. Revisar este registro con cualquier nueva función, publicidad, analítica o proveedor.
