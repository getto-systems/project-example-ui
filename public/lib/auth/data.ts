import { AuthCredential } from "../credential/data"
import { ResetToken } from "../password_reset/data"

export type AuthState =
    Readonly<{ type: "renew-credential" }> |
    Readonly<{ type: "store-credential", authCredential: AuthCredential }> |
    Readonly<{ type: "load-application" }> |
    Readonly<{ type: "password-login" }> |
    Readonly<{ type: "password-reset-session" }> |
    Readonly<{ type: "password-reset", resetToken: ResetToken }>

export const initialAuthState: AuthState = { type: "renew-credential" }
