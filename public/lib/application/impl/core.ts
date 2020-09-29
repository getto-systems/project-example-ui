import { Infra } from "../infra"

import { packScriptPath, unpackPagePathname } from "../adapter"

import { ApplicationAction } from "../action"

import { PagePathname, ScriptPath } from "../data"

export function initApplicationAction(infra: Infra): ApplicationAction {
    return new Action(infra)
}

class Action implements ApplicationAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra
    }

    secureScriptPath(pagePathname: PagePathname): ScriptPath {
        return secureScriptPath(this.infra.hostConfig.secureServerHost, pagePathname)
    }
}

function secureScriptPath(secureHost: string, pagePathname: PagePathname): ScriptPath {
    // secure host にアクセス中の html と同じパスで js がホストされている
    return packScriptPath(`//${secureHost}${unpackPagePathname(pagePathname).replace(/\.html$/, ".js")}`)
}
