# Cierre del expediente antes de producción

Este documento diferencia trabajo realizado de decisiones pendientes. No es un certificado de cumplimiento. No se ha desplegado la web ni se han modificado cuentas de proveedores.

## Realizado

- Cuatro documentos públicos, enlaces visibles en formulario y pie, índice y vista imprimible.
- Identidad facilitada por el titular: Javier López Villanueva, NIF 47575661T, jlopvil@gmail.com.
- España y Cerdanyola del Vallès confirmados; Vercel Inc. confirmado como alojamiento, funciones en Frankfurt (fra1). Upstash AWS eu-central-1 y Gmail personal confirmados.
- Información a invitados añadida al primer correo, con enlace a privacidad si se configura el dominio.
- Registro de tratamientos, ponderación preliminar, conservación/proveedores, derechos e incidentes.
- Descripción fiel del borrado actual: no se afirma eliminación automática de pendientes, recibos o Gmail.

## Pendiente para versión definitiva

1. Completar domicilio postal (calle, número, código postal y datos necesarios) y confirmar si procede inscripción registral. Configurar `LEGAL_ADDRESS` y `LEGAL_REGISTRY`; no sustituir dirección por solo municipio.
2. Configurar `NEXT_PUBLIC_SITE_URL` con dominio HTTPS real antes de compilar. Comprobar enlaces del email y acceso público a políticas. Las páginas legales son en español; para dirigirse a público que no lo comprende, proporcionar traducciones adecuadas.
3. Conservar acuerdos y garantías aplicables a Vercel, Upstash y Gmail personal; verificar las entidades receptoras, soporte y copias. Las regiones de ejecución/base confirmadas no cierran por sí solas esta revisión. Completar `LEGAL_HOSTING` y `LEGAL_TRANSFERS` después de verificar. Si el tipo de cuenta Gmail no permite las condiciones necesarias, cambiar proveedor/cuenta.
4. Poner en marcha el [procedimiento manual de borrado](procedimiento-borrado.md) y registrar cada revisión. Resolver el riesgo de reintentos antes de caducar justificantes. Revisar pendientes Redis y enviados/papelera Gmail. Configurar `LEGAL_RETENTION` describiendo la realidad. No basta con escribir un plazo.
5. Aprobar ponderación de interés legítimo con evidencia, y decidir controles de abuso suficientes para el alcance público real. La aplicación actual no verifica la identidad del organizador ni la expectativa de cada invitado.
6. Adoptar el procedimiento de derechos e incidentes, activar controles de acceso y MFA, comprobar backups y delegar responsabilidades si otras personas administran.
7. Auditar el dominio desplegado: almacenamiento/cookies y peticiones reales, incluidos los añadidos por el hosting. Si aparecen finalidades no exentas, bloquearlas hasta consentimiento e incorporar gestión simétrica y retirada.
8. Revisar campos pendientes y textos, fechar aprobación y conservar versión publicada. Eliminar el estado de borrador únicamente cuando la operación y los datos estén completos; rellenar variables no constituye por sí solo aprobación legal.

## Evidencia de cierre

Titular / fecha / versión del código y textos / dominio / contratos y regiones / política de borrado aplicada / comprobación de derechos / revisión de cookies / decisión de interés legítimo / revisión jurídica de los extremos pendientes. Firmar o aprobar por el responsable cuando corresponda; estos documentos no están firmados.
