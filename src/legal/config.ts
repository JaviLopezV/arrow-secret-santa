// Public identity fields only. Never put credentials in these variables.
export function legalIdentity() {
  return {
    name: process.env.LEGAL_OWNER_NAME?.trim() || "Javier López Villanueva",
    taxId: process.env.LEGAL_TAX_ID?.trim() || "47575661T",
    address:
      process.env.LEGAL_ADDRESS?.trim() ||
      "Cerdanyola del Vallès, España. [PENDIENTE: dirección postal completa del titular]",
    email: process.env.LEGAL_CONTACT_EMAIL?.trim() || "jlopvil@gmail.com",
    registry:
      process.env.LEGAL_REGISTRY?.trim() ||
      "[PENDIENTE: datos registrales o no aplicable]",
    hosting:
      process.env.LEGAL_HOSTING?.trim() ||
      "Vercel Inc., con ejecución de las funciones del servidor en Frankfurt, Alemania (fra1), y distribución de contenido estático mediante su red global.",
    transfers:
      process.env.LEGAL_TRANSFERS?.trim() ||
      "Vercel: funciones en Frankfurt, Alemania (fra1). Upstash Redis: AWS eu-central-1, Frankfurt, Alemania. Correo: Gmail personal. Estas regiones no garantizan que soporte, subproveedores y copias se limiten al EEE. [PENDIENTE: verificar entidades receptoras, garantías de transferencia y condiciones aplicables a las cuentas utilizadas]",
    retention:
      process.env.LEGAL_RETENTION?.trim() ||
      "Se ha definido un procedimiento manual de revisión diaria de pendientes Redis vencidos y revisión semanal de correos del servicio con más de 30 días. No hay una tarea automática de borrado de esos datos en la aplicación. [PENDIENTE: puesta en marcha y evidencia de ejecución del procedimiento, plazo de justificantes técnicos, registros y copias de seguridad]",
  };
}
