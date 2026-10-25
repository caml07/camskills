import { fileURLToPath } from "url"
import { dirname, resolve } from "path"
import { execFile } from "node:child_process"
import { promisify } from "node:util"

const __dirname = dirname(fileURLToPath(import.meta.url))
const run = promisify(execFile)

const EVENTS = {
  "permission.asked": { urgency: "critical", app: "opencode-permission" },
  "question.asked": { urgency: "critical", app: "opencode-question" },
  "session.idle": { urgency: "normal", app: "opencode-idle" },
  "session.error": { urgency: "critical", app: "opencode-error" },
  "tui.prompt.append": { urgency: "normal", app: "opencode-prompt" },
}

const COOLDOWN_MS = 30_000
// opencode TUI pone el título del terminal como "OC | ..."; sobrescribible con OPENCODE_NOTIFY_MATCH
const FOCUS_MATCH = process.env.OPENCODE_NOTIFY_MATCH ?? "opencode|^oc \\|"

const SOUNDS_DIR = process.env.OPENCODE_SOUNDS_DIR ?? resolve(__dirname, "sounds")
const NOTIFY_DEVICE = process.env.OPENCODE_NOTIFY_DEVICE ?? ""
const SOUNDS = {
  "permission.asked": process.env.OPENCODE_SOUND_PERMISSION ?? "Firework_launch.ogg",
  "question.asked": process.env.OPENCODE_SOUND_QUESTION ?? "Drawer_open.wav.ogg",
  "session.idle": process.env.OPENCODE_SOUND_IDLE ?? "Note_block_pling.ogg",
  "session.error": process.env.OPENCODE_SOUND_ERROR ?? "Note_block_harp.ogg",
  "tui.prompt.append": process.env.OPENCODE_SOUND_PROMPT ?? "Note_block_pling.ogg",
}

export const parseFocusedTitle = (output) => {
  const block = output.split(/\n\s*\n/).find((b) => b.includes("(focused)"))
  const m = block?.match(/Title: "([^"]*)"/)
  return m?.[1] ?? ""
}

const render = (type, props) => {
  switch (type) {
    case "permission.asked":
      return `Se necesita tu aprobación${props?.permission ? `: ${props.permission}` : ""}`
    case "question.asked":
      return `Pregunta: ${props?.questions?.[0]?.header ?? props?.questions?.[0]?.question ?? ""}`
    case "session.idle":
      return "Tarea completada"
    case "session.error":
      return `${props?.error?.name ?? "Error"}${props?.error?.data?.message ? `: ${props.error.data.message}` : ""}`
    case "tui.prompt.append":
      return "Esperando tu input"
  }
}

export default {
  id: "caml.notification",
  setup(ctx) {
    const last = new Map()
    const match = new RegExp(FOCUS_MATCH, "i")
    const controller = new AbortController()

    const isFocused = async () => {
      try {
        const { stdout } = await run("niri", ["msg", "windows"])
        return match.test(parseFocusedTitle(stdout))
      } catch {
        return false // fail-open: si no podemos chequear, notificamos igual
      }
    }

    const sessionTitle = async (sessionID) => {
      if (!sessionID) return null
      try {
        const session = await ctx.session.get({ sessionID })
        return session?.title ?? null
      } catch {
        return null // fallback: título genérico
      }
    }

    const play = async (sound) => {
      if (!sound || process.platform === "win32") return
      const file = resolve(SOUNDS_DIR, sound)
      await run("paplay", [...(NOTIFY_DEVICE ? [`--device=${NOTIFY_DEVICE}`] : []), file])
    }

    const notify = async (title, message, urgency, app) => {
      if (process.platform === "win32") {
        const winSound = urgency === "critical" ? "Notification.Looping.Alarm" : "Notification.Default"
        await run("powershell", ["-NoProfile", "-File", resolve(__dirname, "toast.ps1"), "-Title", title, "-Message", message, "-Sound", winSound])
      } else {
        await run("notify-send", ["-u", urgency, "-a", app, title, message])
      }
    }

    const handleEvent = async (event) => {
      const cfg = EVENTS[event.type]
      if (!cfg) return
      const now = Date.now()
      if (now - (last.get(event.type) ?? 0) < COOLDOWN_MS) return
      last.set(event.type, now)
      try {
        if (await isFocused()) return
        const props = event.data ?? event.properties
        const title = (await sessionTitle(props?.sessionID)) ?? null
        await play(SOUNDS[event.type])
        await notify(title ? `OC | ${title}` : "opencode", render(event.type, props), cfg.urgency, cfg.app)
      } catch {
        // nunca romper la sesión por una notificación
      }
    }

    void (async () => {
      try {
        for await (const event of ctx.event.subscribe({ signal: controller.signal })) {
          if (controller.signal.aborted) break
          void handleEvent(event)
        }
      } catch {
        // La desconexión del stream no debe afectar a OpenCode.
      }
    })()

    return () => controller.abort()
  }
}
