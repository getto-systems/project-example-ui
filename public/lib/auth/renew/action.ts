import { CredentialAction, RenewEvent, StoreEvent } from "../../credential/action"

import { StoreError } from "../../credential/data"

export interface RenewComponentAction {
    credential: CredentialAction,
}

export interface RenewComponent {
    initialState: RenewComponentState

    renew(event: RenewComponentEvent): Promise<void>
}

export type RenewComponentState =
    Readonly<{ type: "initial-renew" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "failed-to-store", err: StoreError }>

export interface RenewComponentEvent extends RenewEvent, StoreEvent { }

export interface RenewComponentEventInit {
    (stateChanged: RenewComponentStateHandler): RenewComponentEvent
}

export interface RenewComponentStateHandler {
    (state: RenewComponentState): void
}
