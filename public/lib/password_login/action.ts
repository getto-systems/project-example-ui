import { AuthCredential, LoginID } from "../credential/data"
import { Password } from "../password/data"
import { InputContent, LoginError } from "./data"
import { Content } from "../field/data"

export interface PasswordLoginAction {
    login(event: LoginEventPublisher, content: [Content<LoginID>, Content<Password>]): Promise<LoginResult>
}

export interface LoginEventPublisher {
    tryToLogin(): void
    delayedToLogin(): void
    failedToLogin(content: InputContent, err: LoginError): void
}

export type LoginResult =
    Readonly<{ success: false }> |
    Readonly<{ success: true, authCredential: AuthCredential }>
