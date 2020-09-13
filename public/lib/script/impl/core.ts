import { Infra } from "../infra"

import { ScriptPath, ScriptEvent } from "../data"
import { ScriptAction, ScriptEventHandler } from "../action"

export function initScriptAction(handler: ScriptEventHandler, infra: Infra): ScriptAction {
    return new ScriptActionImpl(handler, infra)
}

class ScriptActionImpl implements ScriptAction {
    handler: ScriptEventHandler
    infra: Infra

    constructor(handler: ScriptEventHandler, infra: Infra) {
        this.handler = handler
        this.infra = infra
    }

    publish(event: ScriptEvent): void {
        this.handler.handleScriptEvent(event)
    }

    async load(currentLocation: Readonly<Location>): Promise<void> {
        const scriptPath = secureScriptPath(this.infra.config.secureServerHost, currentLocation)
        this.publish({ type: "try-to-load", scriptPath })

        const response = await this.infra.checkClient.checkStatus(scriptPath)
        if (!response.success) {
            this.publish({ type: "failed-to-load", err: response.err })
        }
        return

        function secureScriptPath(secureHost: string, currentLocation: Readonly<Location>): ScriptPath {
            // secure host にアクセス中の html と同じパスで js がホストされている
            const pathname = new URL(currentLocation.toString()).pathname
            return { scriptPath: `//${secureHost}${pathname.replace(/\.html$/, ".js")}` }
        }
    }
}
