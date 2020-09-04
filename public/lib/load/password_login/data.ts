import { Password, PasswordBoard } from "../password/data";
import { LoginID, LoginIDBoard, NonceValue, ApiRoles } from "../credential/data";

export type LoginBoard = Readonly<{ loginID: LoginIDBoard, password: PasswordBoard }>

export type LoginBoardContent =
    Readonly<{ valid: false }> |
    Readonly<{ valid: true, loginID: LoginID, password: Password }>
export const invalidLoginBoardContent: LoginBoardContent = { valid: false }
export function validLoginBoardContent(loginID: LoginID, password: Password): LoginBoardContent {
    return { valid: true, loginID, password }
}

export type LoginState =
    Readonly<{ state: "initial-login" }> |
    Readonly<{ state: "try-to-login", delayed: boolean, promise: Promise<LoginState> }> |
    Readonly<{ state: "failed-to-login", err: LoginError }> |
    Readonly<{ state: "succeed-to-login", nonce: NonceValue, roles: ApiRoles }>
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
export function succeedToLogin(nonce: NonceValue, roles: ApiRoles): LoginState {
    return { state: "succeed-to-login", nonce, roles }
}

export type LoginError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-login" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
