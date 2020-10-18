import {
    RenewCredentialActionSet,
    RenewCredentialParam,
    RenewCredentialComponent,
    RenewCredentialState,
    RenewCredentialRequest,
} from "./component"

import { RenewEvent, SetContinuousRenewEvent } from "../../../credential/data"

export function initRenewCredential(background: RenewCredentialActionSet, param: RenewCredentialParam): RenewCredentialComponent {
    return new Component(background, param)
}

class Component implements RenewCredentialComponent {
    background: RenewCredentialActionSet
    param: RenewCredentialParam

    listener: Post<RenewCredentialState>[] = []

    constructor(background: RenewCredentialActionSet, param: RenewCredentialParam) {
        this.background = background
        this.param = param
    }

    onStateChange(post: Post<RenewCredentialState>): void {
        this.listener.push(post)
    }
    post(state: RenewCredentialState): void {
        this.listener.forEach(post => post(state))
    }

    action(request: RenewCredentialRequest): void {
        switch (request.type) {
            case "renew":
                this.background.renew((event) => {
                    this.post(this.mapRenewEvent(event))
                })
                return

            case "succeed-to-instant-load":
                this.background.setContinuousRenew((event) => {
                    this.post(this.mapSetContinuousRenewEvent(event))
                })
                return

            case "load-error":
                this.post({ type: "load-error", err: request.err })
                return

            default:
                assertNever(request)
        }
    }

    mapRenewEvent(event: RenewEvent): RenewCredentialState {
        switch (event.type) {
            case "try-to-instant-load":
            case "succeed-to-renew":
                return {
                    type: event.type,
                    scriptPath: this.background.secureScriptPath(this.param.pagePathname),
                }

            default:
                return event
        }
    }
    mapSetContinuousRenewEvent(event: SetContinuousRenewEvent): RenewCredentialState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
