import { RenewCredentialActionSet, RenewCredentialComponent, RenewCredentialState } from "./component"

import { RenewEvent, SetContinuousRenewEvent } from "../../../credential/data"
import { LoadError } from "../../../application/data"

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

    renew(): void {
        this.actions.renew((event) => {
            this.post(this.mapRenewEvent(event))
        })
    }
    succeedToInstantLoad(): void {
        this.actions.setContinuousRenew((event) => {
            this.post(this.mapSetContinuousRenewEvent(event))
        })
    }
    loadError(err: LoadError): void {
        this.post({ type: "load-error", err })
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
