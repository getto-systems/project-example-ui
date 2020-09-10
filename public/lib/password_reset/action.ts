import { LoginID, AuthCredential } from "../auth_credential/data"
import { Password } from "../password/data"
import { InputContent, ResetError, ResetToken } from "./data"
import { Content } from "../input/data"

export interface PasswordResetAction {
    reset(event: ResetEvent, resetToken: ResetToken, fields: [Content<LoginID>, Content<Password>]): Promise<ResetResult>
}

export type ResetResult =
    Readonly<{ success: false }> |
    Readonly<{ success: true, authCredential: AuthCredential }>

export interface ResetEvent {
    tryToReset(): void
    delayedToReset(): void
    failedToReset(content: InputContent, err: ResetError): void
}
