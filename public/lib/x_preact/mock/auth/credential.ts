import {
    CredentialComponent,
    CredentialComponentResource,
    CredentialState,
} from "../../../auth/component/credential/component"

export function newCredentialComponent(): CredentialComponent {
    return new Component(new Init().delayedToRenew())
}

class Init {
    delayedToRenew(): CredentialState {
        return { type: "delayed-to-renew" }
    }
    failedToRenew_bad_request(): CredentialState {
        return { type: "failed-to-renew", err: { type: "bad-request" } }
    }
    failedToRenew_server_error(): CredentialState {
        return { type: "failed-to-renew", err: { type: "server-error" } }
    }
    failedToRenew_bad_response(): CredentialState {
        return { type: "failed-to-renew", err: { type: "bad-response", err: "error" } }
    }
    failedToRenew_infra_error(): CredentialState {
        return { type: "failed-to-renew", err: { type: "infra-error", err: "error" } }
    }
}

class Component implements CredentialComponent {
    state: CredentialState

    constructor(state: CredentialState) {
        this.state = state
    }

    onStateChange(stateChanged: Post<CredentialState>): void {
        stateChanged(this.state)
    }

    init(): CredentialComponentResource {
        return {
            request: () => { /* mock では特に何もしない */ },
            terminate: () => { /* mock では特に何もしない */ },
        }
    }
}

interface Post<T> {
    (state: T): void
}
