import {
    PasswordLoginComponentAction,
    PasswordLoginComponent,
    PasswordLoginComponentState,
    PasswordLoginComponentOperation,
    PasswordLoginComponentFields,
} from "./action"

import { LoginID } from "../../credential/data"
import { Password } from "../../password/data"
import { LoginEvent } from "../../password_login/data"
import { Content } from "../../field/data"

export function initPasswordLoginComponent(
    action: PasswordLoginComponentAction,
    fields: PasswordLoginComponentFields,
): PasswordLoginComponent {
    return new Component(action, fields)
}

class Component implements PasswordLoginComponent {
    action: PasswordLoginComponentAction
    fields: PasswordLoginComponentFields

    content: {
        loginID: Content<LoginID>
        password: Content<Password>
    }

    constructor(action: PasswordLoginComponentAction, fields: PasswordLoginComponentFields) {
        this.action = action
        this.fields = fields

        this.content = {
            loginID: { input: { inputValue: "" }, valid: false },
            password: { input: { inputValue: "" }, valid: false },
        }

        this.fields.loginID.onContentChange((content: Content<LoginID>) => {
            this.content.loginID = content
        })
        this.fields.password.onContentChange((content: Content<Password>) => {
            this.content.password = content
        })
    }

    init(stateChanged: Publisher<PasswordLoginComponentState>): void {
        this.action.passwordLogin.sub.onLoginEvent((event) => {
            stateChanged(map(event))

            function map(event: LoginEvent): PasswordLoginComponentState {
                return event
            }
        })
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
    trigger(_operation: PasswordLoginComponentOperation): Promise<void> {
        // "login" だけなので単に呼び出す
        return this.login()
    }

    async login(): Promise<void> {
        await Promise.all([
            this.fields.loginID.field.validate(),
            this.fields.password.field.validate(),
        ])

        await this.action.passwordLogin.login([
            this.content.loginID,
            this.content.password,
        ])
    }
}

interface Publisher<T> {
    (state: T): void
}
