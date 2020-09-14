import { Infra } from "../infra"

import { ScriptAction, ScriptEventHandler } from "../action"

import { PagePathname, ScriptPath, ScriptEvent } from "../data"

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

    async load(pagePathname: PagePathname): Promise<void> {
        const scriptPath = secureScriptPath(this.infra.hostConfig.secureServerHost, pagePathname)
        this.publish({ type: "try-to-load", scriptPath })

        const response = await this.infra.checkClient.checkStatus(scriptPath)
        if (!response.success) {
            this.publish({ type: "failed-to-load", err: response.err })
        }
    }
}

function secureScriptPath(secureHost: string, pagePathname: PagePathname): ScriptPath {
    // secure host にアクセス中の html と同じパスで js がホストされている
    return { scriptPath: `//${secureHost}${pagePathname.pagePathname.replace(/\.html$/, ".js")}` }
}
