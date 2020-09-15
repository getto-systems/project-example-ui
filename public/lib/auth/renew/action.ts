import { CredentialAction, RenewEvent, StoreEvent } from "../../credential/action"

import { StoreError } from "../../credential/data"

export interface RenewComponentAction {
    credential: CredentialAction,
}

export interface RenewComponent {
    init(stateChanged: Publisher<RenewComponentState>): void
    terminate(): void
    trigger(event: RenewComponentEvent): Promise<void>
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

export const initialRenewComponentState: RenewComponentState = { type: "initial-renew" }

export type RenewComponentEvent =
    Readonly<{ type: "renew" }>

interface Publisher<T> {
    (state: T): void
}

export interface RenewComponentEventPublisher extends RenewEvent, StoreEvent { }

export interface RenewComponentEventInit {
    (stateChanged: RenewComponentStateHandler): RenewComponentEventPublisher
}

export interface RenewComponentStateHandler {
    (state: RenewComponentState): void
}
