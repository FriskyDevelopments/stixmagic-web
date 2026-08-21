# Auditoría inicial de LORE Next MVP

## Estado del repositorio

El repositorio seleccionado es `FriskyDevelopments/stixmagic-web`, un monorepo con una aplicación Next.js en `apps/web` y un API Fastify en `services/api`. La autenticación administrativa existente valida Telegram Mini App init data y comprueba el rol de administrador mediante el repositorio file-backed.

La capa de persistencia actual usa `services/api/data/state.json` y todavía no tiene un modelo de tenant explícito para integraciones OAuth. Para el MVP0 se debe añadir un identificador de organización/comunidad y comprobarlo en cada lectura, acción y borrado de conexión.

## Playwright

La configuración y los casos E2E de LORE ya existen en `playwright.config.ts` y `e2e/lore-mvp.spec.ts`, pero la ejecución parcial dejó seis fallos. Los patrones observados son: el test de onboarding no encontró el diálogo en el primer render; los selectores de estado de Shelf y el filtro ritual necesitan esperar el estado visible de React; la prueba de exportación necesita esperar el texto de preview después de editar; y la prueba del Thread debe tolerar el scroll inicial del deep link antes de verificar progreso y estilos de impresión. Estos casos se corregirán y se ejecutarán de forma aislada y completa.

## Dependencias

`pnpm audit --json` informa actualmente cero vulnerabilidades para las 529 dependencias instaladas. El aviso de GitHub sobre 36 vulnerabilidades no se pudo consultar mediante la API REST porque el token disponible no tiene permiso de seguridad, y la interfaz web no expone la página sin una sesión de GitHub válida. Se debe mantener esta discrepancia documentada y revisar el estado remoto con una credencial de GitHub que incluya acceso a Dependabot antes de declarar el problema cerrado.

## Contrato Nango MVP0 verificado

La documentación oficial de Nango establece que el backend crea una Connect Session de corta duración con `allowed_integrations` y tags como `end_user_id` y `organization_id`; el frontend abre la Connect UI con el token de sesión; Nango almacena y refresca las credenciales; y el backend recibe el `connectionId` mediante un webhook de autenticación [1] [2]. Las conexiones se pueden listar sin credenciales, filtrando por tags, y las operaciones de proveedor se pueden ejecutar mediante el proxy de Nango usando el `provider_config_key` y `connection_id` [1] [3].

Para Google Calendar, la acción inicial será leer próximos eventos con los parámetros mínimos `calendarId=primary`, `singleEvents=true`, `orderBy=startTime` y un límite acotado. Google documenta que `events.list` admite esos parámetros y requiere una autorización adecuada, con scopes como `calendar.readonly` o un scope de eventos equivalente [4]. El cliente web nunca recibirá tokens, headers de autorización ni respuestas completas del proveedor.

## Referencias

[1]: https://nango.dev/docs/guides/auth/auth-guide "Nango Auth guide"
[2]: https://nango.dev/docs/reference/backend/http-api/connect/sessions/create "Nango Create a connect session"
[3]: https://nango.dev/docs/api-integrations/google-calendar "Nango Google Calendar integration"
[4]: https://developers.google.com/workspace/calendar/api/v3/reference/events/list "Google Calendar events.list reference"
