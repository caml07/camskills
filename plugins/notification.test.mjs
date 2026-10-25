import { test } from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import notification, { parseFocusedTitle } from "./notification.js"

test("V2 event subscription sends an unfocused session notification and stops on cleanup", async () => {
  const dir = await mkdtemp(join(tmpdir(), "opencode-notification-"))
  const previous = process.env.PATH
  let stop
  try {
    process.env.PATH = `${dir}:${previous}`
    for (const name of ["niri", "paplay", "notify-send"]) {
      await writeFile(join(dir, name), `#!/usr/bin/env node
const fs = require('node:fs')
if (process.argv[1].endsWith('/niri')) console.log('Window ID: 1\\nTitle: "other app"')
else fs.appendFileSync(${JSON.stringify(join(dir, "calls"))}, JSON.stringify([${JSON.stringify(name)}, ...process.argv.slice(2)]) + '\\n')
`, { mode: 0o755 })
    }
    let emit
    let signal
    stop = notification.setup({
      session: { get: async () => ({ title: "Mi tarea" }) },
      event: { subscribe: ({ signal: subscribed }) => {
        signal = subscribed
        return { async *[Symbol.asyncIterator]() {
          yield await new Promise((resolve) => { emit = resolve })
        } }
      } },
    })
    emit({ type: "session.idle", data: { sessionID: "ses_test" } })
    let calls
    for (let i = 0; i < 100; i++) {
      try { calls = (await readFile(join(dir, "calls"), "utf8")).trim().split("\n").map(JSON.parse) } catch {}
      if (calls?.length === 2) break
      await new Promise((resolve) => setTimeout(resolve, 20))
    }
    assert.equal(calls?.length, 2)
    assert.equal(calls[0][0], "paplay")
    assert.deepEqual(calls[1].slice(-2), ["OC | Mi tarea", "Tarea completada"])
    stop()
    assert.equal(signal.aborted, true)
    assert.equal(parseFocusedTitle('Window ID: 1 (focused)\nTitle: "OC | Mi tarea"'), "OC | Mi tarea")
  } finally {
    stop?.()
    process.env.PATH = previous
    await rm(dir, { recursive: true, force: true })
  }
})
