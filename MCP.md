# MCPs opcionales

Este repo versiona una plantilla segura para los MCPs usados con OpenCode en
`opencode.mcp.example.jsonc`. No contiene tokens, rutas privadas ni sesiones de
OAuth. Los tres servidores están desactivados por defecto para no meter todas
las herramientas en el contexto de cada sesión.

## Perfil Composio

- **Activo:** Notion.
- **Futuro:** WhatsApp mediante un bot de Cam Cookies.
- **No activar por defecto:** cualquier otro toolkit de Composio hasta que se
  necesite explícitamente.

Las conexiones, cuentas y permisos de Composio viven en Composio/OpenCode; no
se guardan en este repo. La mención de WhatsApp es una intención futura, no una
conexión activa.

## Activación local

OpenCode sustituye variables con la forma `{env:NOMBRE}`. Copia o mezcla solo el
bloque `mcp` del ejemplo en `~/.config/opencode/opencode.jsonc` y define los
valores en el entorno local:

```bash
export CONTEXT7_API_KEY="..."
export OBSIDIAN_MCP_BIN="/ruta/al/binario/obsidian-native-mcp"
export OBSIDIAN_VAULT="cam=/ruta/al/vault/cam"
```

Activa únicamente los servidores que necesites cambiando `enabled` a `true`.
Para Composio, autentica y limita los toolkits desde la conexión de Composio;
este archivo solo declara el transporte MCP.

## Seguridad

- Nunca reemplaces `{env:CONTEXT7_API_KEY}` por el token real en un archivo
  versionado.
- No publiques `~/.config/opencode/opencode.jsonc`, `mcp-auth.json`, tokens de
  Composio ni rutas privadas de bóvedas.
- Si una integración necesita OAuth, deja que OpenCode guarde la sesión en su
  almacén local y no la copies al repo.

Referencias: [OpenCode MCP servers](https://opencode.ai/docs/mcp-servers/) y
[OpenCode config variables](https://opencode.ai/docs/config/#env-vars).
