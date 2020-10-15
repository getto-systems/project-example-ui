import { unpackScriptPath } from "../../application/adapter"

import { ScriptPath } from "../../application/data"

export function appendScript(scriptPath: ScriptPath, setup: Setup<HTMLScriptElement>): void {
    const script = document.createElement("script")
    script.src = unpackScriptPath(scriptPath)
    setup(script)
    document.body.appendChild(script)
}

interface Setup<T> {
    (element: T): void
}
