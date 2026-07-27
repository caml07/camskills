import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

export const NotificationPlugin = async ({ $ }) => {
  const scriptPath = resolve(__dirname, "toast.ps1")

  const notify = async (message) => {
    try {
      await $`powershell -NoProfile -File "${scriptPath}" -Title "opencode" -Message "${message}"`
    } catch {
      // silently fail — don't break the session for a notification
    }
  }

  return {
    event: async ({ event }) => {
      switch (event.type) {
        case "session.idle":
          await notify("Response completed")
          break
        case "session.error":
          await notify("Error occurred")
          break
        case "permission.asked":
          await notify("Needs your approval")
          break
        case "tui.prompt.append":
          await notify("Waiting for your input")
          break
      }
    },
  }
}
