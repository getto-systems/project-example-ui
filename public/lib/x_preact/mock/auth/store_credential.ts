import {
    StoreCredentialComponent,
    StoreCredentialState,
} from "../../../auth/component/store_credential/component"

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

    onStateChange(stateChanged: Post<StoreCredentialState>): void {
        stateChanged(this.state)
    }

    init(): void {
        // mock では特に何もしない
    }
    terminate(): void {
        // mock では特に何もしない
    }
    store(_authCredential: AuthCredential): Promise<void> {
        // mock では特に何もしない
        return Promise.resolve()
    }
}

interface Post<T> {
    (state: T): void
}
