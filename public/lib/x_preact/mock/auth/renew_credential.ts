import {
    RenewCredentialComponent,
    RenewCredentialParam,
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

    setParam(_param: RenewCredentialParam): RenewCredentialComponent {
        // mock では特に何もしない
        return this
    }

    onStateChange(stateChanged: Post<RenewCredentialState>): void {
        stateChanged(this.state)
    }

    init(): void {
        // mock では特に何もしない
    }
    terminate(): void {
        // mock では特に何もしない
    }
    trigger(_operation: RenewCredentialOperation): Promise<void> {
        // mock では特に何もしない
        return Promise.resolve()
    }
}

interface Post<T> {
    (state: T): void
}
