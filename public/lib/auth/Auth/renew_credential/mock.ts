import { MockComponent } from "../../../z_external/mock/component"

import { RenewCredentialComponent, RenewCredentialState } from "./component"

export function initRenewCredential(): RenewCredentialComponent {
    return initRenewCredentialWithState(new RenewCredentialStateFactory().delayedToRenew())
}
export function initRenewCredentialWithState(state: RenewCredentialState): RenewCredentialMockComponent {
    return new RenewCredentialMockComponent(state)
}

export type RenewCredentialMockProps =
    | Readonly<{ type: "delayed" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function mapRenewCredentialMockProps(props: RenewCredentialMockProps): RenewCredentialState {
    switch (props.type) {
        case "delayed":
            return { type: "delayed-to-renew" }

        case "bad-request":
            return { type: "failed-to-renew", err: { type: "bad-request" } }

        case "server-error":
            return { type: "failed-to-renew", err: { type: "server-error" } }

        case "bad-response":
            return { type: "failed-to-renew", err: { type: "bad-response", err: props.err } }

        case "infra-error":
            return { type: "failed-to-renew", err: { type: "infra-error", err: props.err } }
    }
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

export class RenewCredentialMockComponent extends MockComponent<RenewCredentialState>
    implements RenewCredentialComponent {
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
