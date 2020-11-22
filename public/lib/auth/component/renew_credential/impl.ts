import {
    RenewCredentialActionSet,
    RenewCredentialComponent,
    RenewCredentialState,
    RenewCredentialRequest,
} from "./component"

import { RenewEvent, SetContinuousRenewEvent } from "../../../credential/data"

export function initRenewCredential(actions: RenewCredentialActionSet): RenewCredentialComponent {
    return new Component(actions)
}

class Component implements RenewCredentialComponent {
    actions: RenewCredentialActionSet

    listener: Post<RenewCredentialState>[] = []

    constructor(actions: RenewCredentialActionSet) {
        this.actions = actions
    }

    onStateChange(post: Post<RenewCredentialState>): void {
        this.listener.push(post)
    }
    post(state: RenewCredentialState): void {
        this.listener.forEach((post) => post(state))
    }

    action(request: RenewCredentialRequest): void {
        switch (request.type) {
            case "renew":
                this.actions.renew((event) => {
                    this.post(this.mapRenewEvent(event))
                })
                return

            case "succeed-to-instant-load":
                this.actions.setContinuousRenew((event) => {
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
                    scriptPath: this.actions.secureScriptPath(),
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
