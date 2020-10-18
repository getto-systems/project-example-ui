import { LoginFields } from "./data"

import { AuthCredential } from "../credential/data"
import { LoginID } from "../login_id/data"
import { Password } from "../password/data"
import { Content } from "../field/data"

export type LoginInfra = Readonly<{
    fields: LoginFieldCollector
    client: PasswordLoginClient
    time: TimeConfig
    delayed: Delayed
}>

export interface LoginFieldCollector {
    loginID(): Promise<Content<LoginID>>
    password(): Promise<Content<Password>>
}

export type TimeConfig = Readonly<{
    passwordLoginDelayTime: DelayTime,
}>

export type DelayTime = Readonly<{ delay_milli_second: number }>

export interface PasswordLoginClient {
    login(fields: LoginFields): Promise<LoginResponse>
}

export type LoginResponse =
    Readonly<{ success: false, err: LoginError }> |
    Readonly<{ success: true, authCredential: AuthCredential }>
export function loginFailed(err: LoginError): LoginResponse {
    return { success: false, err }
}
export function loginSuccess(authCredential: AuthCredential): LoginResponse {
    return { success: true, authCredential }
}

export type LoginError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-login" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>

export interface Delayed {
    <T>(promise: Promise<T>, time: DelayTime, handler: DelayedHandler): Promise<T>
}

interface DelayedHandler {
    (): void
}
