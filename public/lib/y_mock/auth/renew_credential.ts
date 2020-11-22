import {
    RenewCredentialComponent,
    RenewCredentialState,
} from "../../auth/component/renew_credential/component"

export function newRenewCredentialComponent(): RenewCredentialComponent {
    return new Component(new RenewCredentialStateFactory().delayedToRenew())
}

class RenewCredentialStateFactory {
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

    onStateChange(post: Post<RenewCredentialState>): void {
        post(this.state)
    }
    renew(): void {
        // mock では特に何もしない
    }
    succeedToInstantLoad(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
