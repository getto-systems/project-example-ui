import { AuthCredential, LoginID } from "../credential/data"
import { Password } from "../password/data"
import { InputContent, LoginError } from "./data"
import { Content } from "../input/data"

export interface PasswordLoginAction {
    login(event: LoginEvent, content: [Content<LoginID>, Content<Password>]): Promise<LoginResult>
}

export interface LoginEvent {
    tryToLogin(): void
    delayedToLogin(): void
    failedToLogin(content: InputContent, err: LoginError): void
}

export type LoginResult =
    Readonly<{ success: false }> |
    Readonly<{ success: true, authCredential: AuthCredential }>
