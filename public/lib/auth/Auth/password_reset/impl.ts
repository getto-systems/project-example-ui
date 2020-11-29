import { PasswordResetActionSet, PasswordResetComponent, PasswordResetState } from "./component"

import { ResetEvent } from "../../password_reset/data"
import { StoreEvent } from "../../credential/data"
import { LoadError } from "../../application/data"

export function initPasswordReset(actions: PasswordResetActionSet): PasswordResetComponent {
    return new Component(actions)
}

class Component implements PasswordResetComponent {
    actions: PasswordResetActionSet

    listener: Post<PasswordResetState>[] = []

    constructor(actions: PasswordResetActionSet) {
        this.actions = actions
    }

    onStateChange(post: Post<PasswordResetState>): void {
        this.listener.push(post)
    }
    post(state: PasswordResetState): void {
        this.listener.forEach((post) => post(state))
    }

    reset(): void {
        this.actions.reset((event) => {
            this.post(this.mapResetEvent(event))
        })
    }
    loadError(err: LoadError): void {
        this.post({ type: "load-error", err })
    }

    mapResetEvent(event: ResetEvent): PasswordResetState {
        switch (event.type) {
            case "succeed-to-reset":
                this.actions.store(event.authCredential, (event) => {
                    this.post(this.mapStoreEvent(event))
                })
                return {
                    type: event.type,
                    scriptPath: this.actions.secureScriptPath(),
                }

            default:
                return event
        }
    }
    mapStoreEvent(event: StoreEvent): PasswordResetState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
