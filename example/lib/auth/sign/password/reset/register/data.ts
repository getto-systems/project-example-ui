import { LoginID } from "../../../../common/loginID/data"
import { Password } from "../../../../common/password/data"

export type ResetToken = string & { ResetToken: never }
export function markResetToken(resetToken: string): ResetToken {
    return resetToken as string & { ResetToken: never }
}

export type ResetFields = Readonly<{
    loginID: LoginID
    password: Password
}>

export type SubmitError =
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "empty-reset-token" }>
    | SubmitRemoteError

export type SubmitRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
