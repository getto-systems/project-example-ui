import { CredentialAction, RenewEvent, StoreEvent } from "../../credential/action"

import { StoreError } from "../../credential/data"

export interface RenewComponentAction {
    credential: CredentialAction,
}

export interface RenewComponentDeprecated {
    initialState: RenewComponentState

    renew(event: RenewComponentEventPublisher): Promise<void>
}

export type RenewComponentState =
    Readonly<{ type: "initial-renew" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "failed-to-store", err: StoreError }>

export interface RenewComponentEventPublisher extends RenewEvent, StoreEvent { }

export interface RenewComponentEventInit {
    (stateChanged: RenewComponentStateHandler): RenewComponentEventPublisher
}

export interface RenewComponentStateHandler {
    (state: RenewComponentState): void
}
