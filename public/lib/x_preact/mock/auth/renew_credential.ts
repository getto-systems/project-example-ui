import { RenewCredentialComponent } from "../../../auth/renew_credential/component"

import { RenewCredentialState } from "../../../auth/renew_credential/data"

export function newRenewCredentialComponent(): RenewCredentialComponent {
    return new Component(new Init().delayedToRenew())
}

class Init {
    delayedToRenew(): RenewCredentialState {
        return { type: "delayed-to-renew" }
    }
    failedToFetch_infra_error(): RenewCredentialState {
        return { type: "failed-to-fetch", err: { type: "infra-error", err: "error" } }
    }
    failedToRenew_bad_request(): RenewCredentialState {
        return { type: "failed-to-renew", err: { type: "bad-request" } }
    }
    failedToRenew_server_error(): RenewCredentialState {
        return { type: "failed-to-renew", err: { type: "server-error" } }
    }
    failedToRenew_bad_response(): RenewCredentialState {
        return { type: "failed-to-renew", err: { type: "bad-response", err: "error" } }
    }
    failedToRenew_infra_error(): RenewCredentialState {
        return { type: "failed-to-renew", err: { type: "infra-error", err: "error" } }
    }
}

class Component implements RenewCredentialComponent {
    state: RenewCredentialState

    constructor(state: RenewCredentialState) {
        this.state = state
    }

    hook(_stateChanged: Publisher<RenewCredentialState>): void {
        // mock では特に何もしない
    }
    onStateChange(stateChanged: Publisher<RenewCredentialState>): void {
        stateChanged(this.state)
    }
    terminate(): void {
        // mock では特に何もしない
    }
    renew(): Promise<void> {
        // mock では特に何もしない
        return Promise.resolve()
    }
}

interface Publisher<T> {
    (state: T): void
}
