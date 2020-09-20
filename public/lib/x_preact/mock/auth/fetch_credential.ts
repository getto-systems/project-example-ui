import { FetchCredentialComponent } from "../../../auth/fetch_credential/component"

import { FetchCredentialComponentState } from "../../../auth/fetch_credential/data"

export function newFetchCredentialComponent(): FetchCredentialComponent {
    return new Component(new Init().failedToFetch())
}

class Init {
    initialFetch(): FetchCredentialComponentState {
        return { type: "initial-fetch" }
    }
    failedToFetch(): FetchCredentialComponentState {
        return { type: "failed-to-fetch", err: { type: "infra-error", err: "error" } }
    }
}

class Component implements FetchCredentialComponent {
    state: FetchCredentialComponentState

    constructor(state: FetchCredentialComponentState) {
        this.state = state
    }

    hook(_stateChanged: Publisher<FetchCredentialComponentState>): void {
        // mock では特に何もしない
    }
    init(stateChanged: Publisher<FetchCredentialComponentState>): void {
        stateChanged(this.state)
    }
    terminate(): void {
        // mock では特に何もしない
    }
    fetch(): Promise<void> {
        // mock では特に何もしない
        return Promise.resolve()
    }
}

interface Publisher<T> {
    (state: T): void
}
