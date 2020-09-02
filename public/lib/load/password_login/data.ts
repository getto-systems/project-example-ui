import { Password, PasswordValidationError, PasswordCharacter } from "../password/data";
import { LoginID, LoginIDValidationError, NonceValue, ApiRoles } from "../credential/data";

export type LoginBoard = Readonly<{ loginID: LoginIDBoard, password: PasswordBoard }>

export type LoginBoardContent =
    Readonly<{ valid: false }> |
    Readonly<{ valid: true, loginID: LoginID, password: Password }>
export const invalidLoginBoardContent: LoginBoardContent = { valid: false }
export function validLoginBoardContent(loginID: LoginID, password: Password): LoginBoardContent {
    return { valid: true, loginID, password }
}

export type LoginIDBoard =
    Readonly<{ err: Array<LoginIDValidationError> }>

export type PasswordBoard =
    Readonly<{ character: PasswordCharacter, view: PasswordView, err: Array<PasswordValidationError> }>

export type PasswordView =
    Readonly<{ show: false }> |
    Readonly<{ show: true, password: Password }>
export const hidePassword: PasswordView = { show: false }
export function showPassword(password: Password): PasswordView {
    return { show: true, password }
}
export function updatePasswordView(view: PasswordView, password: Password): PasswordView {
    if (view.show) {
        return { show: true, password }
    }
    return view;
}

export type LoginState =
    Readonly<{ state: "initial-login" }> |
    Readonly<{ state: "try-to-login", delayed: boolean, next: Promise<LoginState> }> |
    Readonly<{ state: "failed-to-login", err: LoginError }> |
    Readonly<{ state: "succeed-to-login", nonce: NonceValue, roles: ApiRoles }>
export const initialLogin: LoginState = { state: "initial-login" }
export function tryToLogin(next: Promise<LoginState>): LoginState {
    return { state: "try-to-login", delayed: false, next }
}
export function delayedToLogin(next: Promise<LoginState>): LoginState {
    return { state: "try-to-login", delayed: true, next }
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
