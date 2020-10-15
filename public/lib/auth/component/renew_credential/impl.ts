import {
    RenewCredentialInit,
    RenewCredentialActionSet,
    RenewCredentialParam,
    RenewCredentialComponent,
    RenewCredentialState,
    RenewCredentialRequest,
} from "./component"

import { RenewAction } from "../../../credential/action"
import { PathAction } from "../../../application/action"

import { RenewEvent } from "../../../credential/data"

type Background = Readonly<{
    renew: RenewAction
    path: PathAction
}>

export function initRenewCredentialInit(): RenewCredentialInit {
    return (actions, param) => new Component(actions, param)
}

class Component implements RenewCredentialComponent {
    background: Background
    param: RenewCredentialParam

    listener: Post<RenewCredentialState>[] = []

    constructor(actions: RenewCredentialActionSet, param: RenewCredentialParam) {
        this.background = {
            renew: actions.renew.action,
            path: actions.path,
        }
        this.setup(actions)

        this.param = param
    }
    setup(actions: RenewCredentialActionSet): void {
        actions.renew.subscriber.onRenewEvent(event => this.post(this.mapRenewEvent(event)))
    }
    mapRenewEvent(event: RenewEvent): RenewCredentialState {
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

    onStateChange(stateChanged: Post<RenewCredentialState>): void {
        this.listener.push(stateChanged)
    }
    post(state: RenewCredentialState): void {
        this.listener.forEach(post => post(state))
    }

    action(request: RenewCredentialRequest): void {
        switch (request.type) {
            case "renew":
                this.background.renew.renew()
                return

            case "succeed-to-instant-load":
                this.background.renew.setContinuousRenew()
                return

            case "load-error":
                this.post({ type: "load-error", err: request.err })
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
