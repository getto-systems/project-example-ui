import { Infra } from "../infra"

import { ScriptAction, ScriptEventPublisher, ScriptEventSubscriber } from "../action"

import { PagePathname, ScriptPath, initScriptPath, ScriptEvent } from "../data"

export function initScriptAction(infra: Infra): ScriptAction {
    return new Action(infra)
}

class Action implements ScriptAction {
    infra: Infra

    pub: ScriptEventPublisher
    sub: ScriptEventSubscriber

    constructor(infra: Infra) {
        this.infra = infra

        const pubsub = new EventPubSub()
        this.pub = pubsub
        this.sub = pubsub
    }

    async load(pagePathname: PagePathname): Promise<void> {
        const scriptPath = secureScriptPath(this.infra.hostConfig.secureServerHost, pagePathname)
        this.pub.publishScriptEvent({ type: "try-to-load", scriptPath })

        const response = await this.infra.checkClient.checkStatus(scriptPath)
        if (!response.success) {
            this.pub.publishScriptEvent({ type: "failed-to-load", err: response.err })
        }
    }
}

function secureScriptPath(secureHost: string, pagePathname: PagePathname): ScriptPath {
    // secure host にアクセス中の html と同じパスで js がホストされている
    return initScriptPath(`//${secureHost}${pagePathname.replace(/\.html$/, ".js")}`)
}

class EventPubSub implements ScriptEventPublisher, ScriptEventSubscriber {
    holder: {
        script: PublisherHolder<ScriptEvent>
    }

    constructor() {
        this.holder = {
            script: { set: false },
        }
    }

    onScriptEvent(pub: Publisher<ScriptEvent>): void {
        this.holder.script = { set: true, pub }
    }

    publishScriptEvent(event: ScriptEvent): void {
        if (this.holder.script.set) {
            this.holder.script.pub(event)
        }
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}
