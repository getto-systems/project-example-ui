import { StoreCredentialComponent } from "../../../auth/store_credential/component"

import { StoreCredentialComponentState } from "../../../auth/store_credential/data"

import { AuthCredential } from "../../../credential/data"

export function newStoreCredentialComponent(): StoreCredentialComponent {
    return new Component(new Init().initialStore())
}

class Init {
    initialStore(): StoreCredentialComponentState {
        return { type: "initial-store" }
    }
    failedToStore(): StoreCredentialComponentState {
        return { type: "failed-to-store", err: { type: "infra-error", err: "error" } }
    }
}

class Component implements StoreCredentialComponent {
    state: StoreCredentialComponentState

    constructor(state: StoreCredentialComponentState) {
        this.state = state
    }

    hook(_stateChanged: Publisher<StoreCredentialComponentState>): void {
        // mock では特に何もしない
    }
    init(stateChanged: Publisher<StoreCredentialComponentState>): void {
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

interface Publisher<T> {
    (state: T): void
}
