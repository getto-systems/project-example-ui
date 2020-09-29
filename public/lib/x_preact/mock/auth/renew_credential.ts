import {
    RenewCredentialComponent,
    RenewCredentialState,
    RenewCredentialOperation,
} from "../../../auth/component/renew_credential/component"

export function newRenewCredentialComponent(): RenewCredentialComponent {
    return new Component(new Init().delayedToRenew())
}

class Init {
    delayedToRenew(): RenewCredentialState {
        return { type: "delayed-to-renew" }
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

    onStateChange(stateChanged: Post<RenewCredentialState>): void {
        stateChanged(this.state)
    }

    init(): ComponentResource<RenewCredentialOperation> {
        return {
            request: () => { /* mock では特に何もしない */ },
            terminate: () => { /* mock では特に何もしない */ },
        }
    }
}

interface Post<T> {
    (state: T): void
}

interface Terminate {
    (): void
}

type ComponentResource<T> = Readonly<{
    request: Post<T>
    terminate: Terminate
}>
