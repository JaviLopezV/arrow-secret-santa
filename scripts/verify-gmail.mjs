import { createGmailSender, gmailConfig } from '../src/server/gmail.ts';
import { existsSync } from 'node:fs';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const auth = gmailConfig();
if (!auth) {
  console.error('Configura GMAIL_USER y GMAIL_APP_PASSWORD (contraseña de aplicación de 16 letras) en .env.local.');
  process.exitCode = 1;
} else {
  try {
    await createGmailSender(auth).verify();
    console.log('Conexión TLS y autenticación con Gmail correctas. No se ha enviado ningún correo.');
  } catch (error) {
    console.error('No se pudo conectar con Gmail:', error.code || 'error de conexión', error.responseCode || '');
    process.exitCode = 1;
  }
}
