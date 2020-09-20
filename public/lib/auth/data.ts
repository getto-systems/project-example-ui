import { AuthCredential, TicketNonce } from "../credential/data"
import { ResetToken } from "../password_reset/data"

export type AuthUsecaseState =
    Readonly<{ type: "fetch-credential" }> |
    Readonly<{ type: "renew-credential", ticketNonce: TicketNonce }> |
    Readonly<{ type: "store-credential", authCredential: AuthCredential }> |
    Readonly<{ type: "load-application" }> |
    Readonly<{ type: "password-login" }> |
    Readonly<{ type: "password-reset-session" }> |
    Readonly<{ type: "password-reset", resetToken: ResetToken }>

export const initialAuthUsecaseState: AuthUsecaseState = { type: "fetch-credential" }
