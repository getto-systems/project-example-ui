import { RenewCredentialComponent } from "../../../auth/renew_credential/component"

import { RenewCredentialComponentState } from "../../../auth/renew_credential/data"

import { TicketNonce } from "../../../credential/data"

export function newRenewCredentialComponent(): RenewCredentialComponent {
    return new Component(new Init().failedToRenew_infra_error())
}

class Init {
    delayedToRenew(): RenewCredentialComponentState {
        return { type: "delayed-to-renew" }
    }
    failedToRenew_bad_request(): RenewCredentialComponentState {
        return { type: "failed-to-renew", err: { type: "bad-request" } }
    }
    failedToRenew_server_error(): RenewCredentialComponentState {
        return { type: "failed-to-renew", err: { type: "server-error" } }
    }
    failedToRenew_bad_response(): RenewCredentialComponentState {
        return { type: "failed-to-renew", err: { type: "bad-response", err: "error" } }
    }
    failedToRenew_infra_error(): RenewCredentialComponentState {
        return { type: "failed-to-renew", err: { type: "infra-error", err: "error" } }
    }
}

class Component implements RenewCredentialComponent {
    state: RenewCredentialComponentState

    constructor(state: RenewCredentialComponentState) {
        this.state = state
    }

    hook(_stateChanged: Publisher<RenewCredentialComponentState>): void {
        // mock では特に何もしない
    }
    init(stateChanged: Publisher<RenewCredentialComponentState>): void {
        stateChanged(this.state)
    }
    terminate(): void {
        // mock では特に何もしない
    }
    renew(_ticketNonce: TicketNonce): Promise<void> {
        // mock では特に何もしない
        return Promise.resolve()
    }
}

interface Publisher<T> {
    (state: T): void
}
