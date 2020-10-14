import {
    CredentialInit,
    CredentialActionSet,
    CredentialParam,
    CredentialComponent,
    CredentialState,
    CredentialRequest,
} from "./component"

import { RenewAction } from "../../../credential/action"
import { PathAction } from "../../../application/action"

import { RenewEvent } from "../../../credential/data"

type Background = Readonly<{
    renew: RenewAction
    path: PathAction
}>

export function initCredentialInit(): CredentialInit {
    return (actions, param) => new Component(actions, param)
}

class Component implements CredentialComponent {
    background: Background
    param: CredentialParam

    listener: Post<CredentialState>[] = []

    constructor(actions: CredentialActionSet, param: CredentialParam) {
        this.background = {
            renew: actions.renew.action,
            path: actions.path,
        }
        this.setup(actions)

        this.param = param
    }
    setup(actions: CredentialActionSet): void {
        actions.renew.subscriber.onRenewEvent(event => this.post(this.mapRenewEvent(event)))
    }
    mapRenewEvent(event: RenewEvent): CredentialState {
        switch (event.type) {
            case "try-to-instant-load":
            case "succeed-to-renew":
                return {
                    type: event.type,
                    scriptPath: this.background.path.secureScriptPath(this.param.pagePathname),
                }

            default:
                return event
        }
    }

    onStateChange(stateChanged: Post<CredentialState>): void {
        this.listener.push(stateChanged)
    }
    post(state: CredentialState): void {
        this.listener.forEach(post => post(state))
    }

    action(request: CredentialRequest): void {
        switch (request.type) {
            case "renew":
                this.background.renew.renew()
                return

            case "succeed-to-instant-load":
                this.background.renew.setContinuousRenew()
                return

            case "failed-to-load":
                this.post({ type: "failed-to-load", err: request.err })
                return

            default:
                assertNever(request)
        }
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
