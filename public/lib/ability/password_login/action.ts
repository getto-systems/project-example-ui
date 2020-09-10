import { LoginIDRecord } from "../auth_credential/action";
import { PasswordRecord } from "../password/action";

import { AuthCredential, LoginID, LoginIDBoard } from "../auth_credential/data";
import { Password, PasswordBoard } from "../password/data";
import { LoginBoard, LoginContent, InputContent, ValidContent, LoginState, LoginError } from "./data";
import { Content } from "../input/data";

export interface PasswordLoginAction {
    login(event: LoginEvent, content: [Content<LoginID>, Content<Password>]): Promise<LoginResult>

    initLoginStore(loginID: LoginIDRecord, password: PasswordRecord): LoginStore
    initLoginApi(): LoginApi
}

export interface LoginEvent {
    tryToLogin(): void
    delayedToLogin(): void
    failedToLogin(content: InputContent, err: LoginError): void
}

export type LoginResult =
    Readonly<{ success: false }> |
    Readonly<{ success: true, authCredential: AuthCredential }>

export interface PasswordLoginTransition {
    logined(): void
}

export interface LoginStore {
    loginID(): LoginIDRecord
    password(): PasswordRecord

    currentBoard(): LoginBoard

    mapLoginID(loginID: LoginIDBoard): LoginBoard
    mapPassword(password: PasswordBoard): LoginBoard

    content(): ValidContent<LoginContent>
    clear(): LoginBoard
}

export interface LoginApi {
    currentState(): LoginState
    login(content: LoginContent): LoginState
}
