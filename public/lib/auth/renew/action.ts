import { CredentialAction, RenewEvent, StoreEvent } from "../../credential/action"

import { StoreError } from "../../credential/data"

export interface RenewComponentAction {
    credential: CredentialAction,
}

export interface RenewComponent {
    initialState: RenewComponentState

    onStateChange(stateChanged: RenewComponentStateHandler): void

    renew(): Promise<void>
}

export interface RenewComponentEvent extends RenewEvent, StoreEvent { }

export type RenewComponentState =
    Readonly<{ type: "initial-renew" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "failed-to-store", err: StoreError }>

export interface RenewComponentStateHandler {
    (state: RenewComponentState): void
}
