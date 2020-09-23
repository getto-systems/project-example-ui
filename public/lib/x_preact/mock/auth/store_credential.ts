import { StoreCredentialComponent } from "../../../auth/store_credential/component"

import { StoreCredentialState } from "../../../auth/store_credential/data"

import { AuthCredential } from "../../../credential/data"

export function newStoreCredentialComponent(): StoreCredentialComponent {
    return new Component(new Init().failedToStore())
}

class Init {
    failedToStore(): StoreCredentialState {
        return { type: "failed-to-store", err: { type: "infra-error", err: "error" } }
    }
}

class Component implements StoreCredentialComponent {
    state: StoreCredentialState

    constructor(state: StoreCredentialState) {
        this.state = state
    }

    hook(_stateChanged: Dispatcher<StoreCredentialState>): void {
        // mock では特に何もしない
    }
    onStateChange(stateChanged: Dispatcher<StoreCredentialState>): void {
        stateChanged(this.state)
    }
    terminate(): void {
        // mock では特に何もしない
    }
    store(_authCredential: AuthCredential): Promise<void> {
        // mock では特に何もしない
        return Promise.resolve()
    }
}

interface Dispatcher<T> {
    (state: T): void
}
