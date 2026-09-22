# Expediente legal de Arrow Secret Santa

Versión 1.0 — 22/09/2026. Preparado para un servicio gratuito de sorteos personales, operado desde España y dirigido a adultos. España y Vercel confirmados por el titular. Este expediente no certifica cumplimiento ni sustituye las actuaciones operativas que documenta.

## Documentos públicos

Implementados en `src/legal/documents.ts`, con identidad en `src/legal/config.ts`:

- Aviso legal: `/es/legal/aviso-legal`.
- Política de privacidad: `/es/legal/privacidad`.
- Política de cookies y almacenamiento: `/es/legal/cookies`.
- Condiciones de uso: `/es/legal/condiciones`.

Accesibles también desde `/ca/legal/…` y `/en/legal/…`, identificados explícitamente como documentos en español. No se presentan como traducciones. Las páginas se pueden imprimir. Los enlaces del formulario aparecen antes de recoger datos; el email incluye información sobre el origen de los datos, base jurídica, responsable y derechos, y enlaza a privacidad cuando el dominio está configurado.

El titular ha facilitado nombre, NIF, correo y municipio (Cerdanyola del Vallès). El domicilio y el resto de decisiones pendientes no se han inventado. Las variables `LEGAL_*` permiten completar o actualizar los datos; requieren reconstruir y desplegar las páginas. No introducir secretos: son información pública. Mientras haya campos pendientes, las páginas muestran un aviso de borrador y `noindex`.

## Documentación interna

- `registro-tratamientos.md`: actividades, datos, finalidades, destinatarios y medidas.
- `interes-legitimo.md`: evaluación preliminar para invitados y prevención de duplicados.
- `conservacion-y-proveedores.md`: calendario propuesto, contratos y transferencias por verificar.
- [Procedimiento de borrado](procedimiento-borrado.md): revisión diaria de Redis y semanal de Gmail personal, verificaciones y registro de ejecución.
- `derechos-e-incidentes.md`: procedimientos y modelos de respuesta.
- `publicacion.md`: decisiones y evidencias necesarias para cerrar el expediente.

No se ha redactado una compraventa, desistimiento o política de devoluciones: esta versión no vende productos ni cobra. No se ha inventado un DPD, inscripción mercantil, certificación de proveedores o consentimiento de participantes. Si el servicio pasa a gestionar sorteos empresariales por cuenta de terceros, hay que revisar roles y contrato de encargo antes de ofrecer esa modalidad.

## Fundamento y fuentes oficiales consultadas

- [RGPD, especialmente artículos 5, 6, 12–22, 28, 30, 32–35 y 44–49](https://eur-lex.europa.eu/legal-content/ES/ALL/?uri=CELEX%3A32016R0679).
- [LSSI, identificación y almacenamiento en terminales, artículos 10 y 22.2](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758).
- [Guía de cookies de la AEPD](https://www.aepd.es/guias/guia-cookies.pdf).

Los criterios se aplican al código revisado, no a una auditoría del despliegue público o de las cuentas privadas de proveedores. Confirmar con asesoramiento jurídico las bases y garantías que dependan de la operación real antes de dar el expediente por definitivo.
