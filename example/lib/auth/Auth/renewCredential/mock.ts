import { MockComponent } from "../../../sub/getto-example/application/mock"

import { RenewCredentialComponent, RenewCredentialComponentState } from "./component"

export function initMockRenewCredential(state: RenewCredentialComponentState): RenewCredentialMockComponent {
    return new RenewCredentialMockComponent(state)
}

export type RenewCredentialMockProps =
    | Readonly<{ type: "delayed" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function mapRenewCredentialMockProps(props: RenewCredentialMockProps): RenewCredentialComponentState {
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

export class RenewCredentialMockComponent extends MockComponent<RenewCredentialComponentState>
    implements RenewCredentialComponent {
    renew(): void {
        // mock では特に何もしない
    }
    succeedToInstantLoad(): void {
        // mock では特に何もしない
    }
    failedToInstantLoad(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}
