import { Infra } from "../infra"

import { packScriptPath, unpackPagePathname } from "../adapter"

import { ScriptAction, ScriptEventPublisher, ScriptEventSubscriber } from "../action"

import { PagePathname, ScriptPath, ScriptEvent } from "../data"

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
        const post = (event: ScriptEvent) => this.pub.postScriptEvent(event)

        const scriptPath = secureScriptPath(this.infra.hostConfig.secureServerHost, pagePathname)
        post({ type: "try-to-load", scriptPath })
    }
}

function secureScriptPath(secureHost: string, pagePathname: PagePathname): ScriptPath {
    // secure host にアクセス中の html と同じパスで js がホストされている
    return packScriptPath(`//${secureHost}${unpackPagePathname(pagePathname).replace(/\.html$/, ".js")}`)
}

class EventPubSub implements ScriptEventPublisher, ScriptEventSubscriber {
    listener: {
        script: Post<ScriptEvent>[]
    }

    constructor() {
        this.listener = {
            script: [],
        }
    }

    onScriptEvent(post: Post<ScriptEvent>): void {
        this.listener.script.push(post)
    }

    postScriptEvent(event: ScriptEvent): void {
        this.listener.script.forEach(post => post(event))
    }
}

interface Post<T> {
    (state: T): void
}
