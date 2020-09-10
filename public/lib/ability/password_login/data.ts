import { LoginID, LoginIDBoard, AuthCredential } from "../auth_credential/data";
import { Password, PasswordBoard } from "../password/data";
import { InputValue } from "../input/data";

export type LoginBoard = Readonly<[LoginIDBoard, PasswordBoard]>
export type LoginContent = Readonly<[LoginID, Password]>

export type InputContent = Readonly<{
    loginID: InputValue,
    password: InputValue,
}>

export type ValidLoginContent =
    Readonly<{ valid: false }> |
    Readonly<{ valid: true, content: LoginContent }>

export type ValidContent<T> =
    Readonly<{ valid: false }> |
    Readonly<{ valid: true, content: T }>
export function invalidContent<T>(): ValidContent<T> {
    return { valid: false }
}
export function validContent<T>(content: T): ValidContent<T> {
    return { valid: true, content }
}

export type LoginState =
    Readonly<{ state: "initial-login" }> |
    Readonly<{ state: "try-to-login", delayed: boolean, promise: Promise<LoginState> }> |
    Readonly<{ state: "failed-to-login", err: LoginError }> |
    Readonly<{ state: "succeed-to-login", authCredential: AuthCredential }>
export const initialLogin: LoginState = { state: "initial-login" }
export function tryToLogin(promise: Promise<LoginState>): LoginState {
    return { state: "try-to-login", delayed: false, promise }
}
export function delayedToLogin(promise: Promise<LoginState>): LoginState {
    return { state: "try-to-login", delayed: true, promise }
}
export function failedToLogin(err: LoginError): LoginState {
    return { state: "failed-to-login", err }
}
export function succeedToLogin(authCredential: AuthCredential): LoginState {
    return { state: "succeed-to-login", authCredential }
}

export type LoginError =
    Readonly<{ type: "validation-error" }> |
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-login" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
