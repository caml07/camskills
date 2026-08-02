import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

const EVENTS = {
  "permission.asked": { message: "Se necesita tu aprobación", urgency: "critical" },
  "session.idle": { message: "Tarea completada", urgency: "normal" },
  "session.error": { message: "Ocurrió un error", urgency: "critical" },
}

const COOLDOWN_MS = 30_000
// opencode TUI pone el título del terminal como "OC | ..."; sobrescribible con OPENCODE_NOTIFY_MATCH
const FOCUS_MATCH = process.env.OPENCODE_NOTIFY_MATCH ?? "opencode|^oc \\|"

const SOUNDS_DIR = process.env.OPENCODE_SOUNDS_DIR ?? "/home/caml/Documents/sounds"
const SOUNDS = {
  "permission.asked": process.env.OPENCODE_SOUND_PERMISSION ?? "Note_block_pling.ogg",
  "session.idle": process.env.OPENCODE_SOUND_IDLE ?? "Note_block_harp.ogg",
  "session.error": process.env.OPENCODE_SOUND_ERROR ?? "Drawer_open.wav.ogg",
}

export const parseFocusedTitle = (output) => {
  const block = output.split(/\n\s*\n/).find((b) => b.includes("(focused)"))
  const m = block?.match(/Title: "([^"]*)"/)
  return m?.[1] ?? ""
}

export const NotificationPlugin = async ({ $ }) => {
  const last = new Map()
  const match = new RegExp(FOCUS_MATCH, "i")

  const isFocused = async () => {
    try {
      const output = await $`niri msg windows`.text()
      return match.test(parseFocusedTitle(output))
    } catch {
      return false // fail-open: si no podemos chequear, notificamos igual
    }
  }

  const play = async (sound) => {
    if (!sound) return
    await $`paplay "${resolve(SOUNDS_DIR, sound)}"`.quiet()
  }

  const notify = async (message, urgency) => {
    if (process.platform === "win32") {
      await $`powershell -NoProfile -File "${resolve(__dirname, "toast.ps1")}" -Title "opencode" -Message "${message}"`.quiet()
    } else {
      await $`notify-send -u ${urgency} -a opencode "${message}"`.quiet()
    }
  }

  return {
    event: async ({ event }) => {
      const cfg = EVENTS[event.type]
      if (!cfg) return
      const now = Date.now()
      if (now - (last.get(event.type) ?? 0) < COOLDOWN_MS) return
      last.set(event.type, now)
      try {
        if (await isFocused()) return
        await play(SOUNDS[event.type])
        await notify(cfg.message, cfg.urgency)
      } catch {
        // nunca romper la sesión por una notificación
      }
    },
  }
}
