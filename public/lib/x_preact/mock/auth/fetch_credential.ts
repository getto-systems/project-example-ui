import { FetchCredentialComponent } from "../../../auth/fetch_credential/component"

import { FetchCredentialState } from "../../../auth/fetch_credential/data"

export function newFetchCredentialComponent(): FetchCredentialComponent {
    return new Component(new Init().failedToFetch())
}

class Init {
    failedToFetch(): FetchCredentialState {
        return { type: "failed-to-fetch", err: { type: "infra-error", err: "error" } }
    }
}

class Component implements FetchCredentialComponent {
    state: FetchCredentialState

    constructor(state: FetchCredentialState) {
        this.state = state
    }

    hook(_stateChanged: Publisher<FetchCredentialState>): void {
        // mock では特に何もしない
    }
    init(stateChanged: Publisher<FetchCredentialState>): void {
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
