import { CredentialAction } from "../../../credential/action"

import { AuthCredential, TicketNonce, RenewError } from "../../../credential/data"

export interface RenewCredentialComponent {
    onStateChange(stateChanged: Post<RenewCredentialState>): void
    init(): Terminate
    trigger(operation: RenewCredentialOperation): Promise<void>
}

export type RenewCredentialParam = { RenewCredentialParam: never }

export interface RenewCredentialParamPacker {
    (ticketNonce: TicketNonce): RenewCredentialParam
}

export type RenewCredentialState =
    Readonly<{ type: "initial-renew" }> |
    Readonly<{ type: "required-to-login" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "failed-to-renew", err: RenewError }> |
    Readonly<{ type: "succeed-to-renew", authCredential: AuthCredential }> |
    Readonly<{ type: "succeed-to-renew-interval", authCredential: AuthCredential }> |
    Readonly<{ type: "error", err: string }>

export const initialRenewCredentialState: RenewCredentialState = { type: "initial-renew" }

export type RenewCredentialOperation =
    Readonly<{ type: "set-param", param: RenewCredentialParam }> |
    Readonly<{ type: "renew" }> |
    Readonly<{ type: "set-renew-interval", ticketNonce: TicketNonce }>

export interface RenewCredentialComponentAction {
    credential: CredentialAction
}

interface Post<T> {
    (state: T): void
}

interface Terminate {
    (): void
}
