import { Infra } from "../infra"

import { ScriptPath } from "../data"
import { ScriptAction, ScriptEvent } from "../action"

export function initScriptAction(infra: Infra): ScriptAction {
    return new ScriptActionImpl(infra)
}

class ScriptActionImpl implements ScriptAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra
    }

    async load(event: ScriptEvent, currentLocation: Readonly<Location>): Promise<void> {
        const scriptPath = secureScriptPath(this.infra.config.secureServerHost, new URL(currentLocation.toString()).pathname)
        event.tryToLoad(scriptPath)

        const response = await this.infra.checkClient.checkStatus(scriptPath)
        if (!response.success) {
            event.failedToLoad(response.err)
        }
        return

        function secureScriptPath(secureHost: string, pathname: string): ScriptPath {
            // secure host に html と同じパスで js がホストされている
            return { scriptPath: `//${secureHost}${pathname.replace(/\.html$/, ".js")}` }
        }
    }
}
