import { SecureScriptPath } from "../../../auth/sign/common/secureScriptPath/get/data"

export function appendScript(scriptPath: SecureScriptPath, setup: Setup<HTMLScriptElement>): void {
    const script = document.createElement("script")
    script.src = scriptPath
    setup(script)
    document.body.appendChild(script)
}

interface Setup<T> {
    (element: T): void
}
