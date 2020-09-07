import { LoginID, LoginIDBoard, TicketNonce, ApiRoles } from "../credential/data";
import { Password, PasswordBoard } from "../password/data";

export type LoginBoard = Readonly<[LoginIDBoard, PasswordBoard]>
export type LoginContent = Readonly<[LoginID, Password]>

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
    Readonly<{ state: "succeed-to-login", nonce: TicketNonce, roles: ApiRoles }>
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
export function succeedToLogin(nonce: TicketNonce, roles: ApiRoles): LoginState {
    return { state: "succeed-to-login", nonce, roles }
}

export type LoginError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-login" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
