import { Infra } from "../infra"

import { PasswordLoginAction, LoginEvent, LoginResult } from "../action"

import { LoginID } from "../../auth_credential/data"
import { Password } from "../../password/data"
import { InputContent } from "../data"
import { Content } from "../../input/data"

export function initPasswordLoginAction(infra: Infra): PasswordLoginAction {
    return new PasswordLoginActionImpl(infra)
}

class PasswordLoginActionImpl implements PasswordLoginAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra
    }

    async login(event: LoginEvent, fields: [Content<LoginID>, Content<Password>]): Promise<LoginResult> {
        const content = mapContent(...fields)
        if (!content.valid) {
            event.failedToLogin(mapInput(...fields), { type: "validation-error" })
            return { success: false }
        }

        event.tryToLogin()

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const promise = this.infra.passwordLoginClient.login(...content.content)
        const response = await delayed(promise, this.infra.config.passwordLoginDelayTime, event.delayedToLogin)
        if (!response.success) {
            event.failedToLogin(mapInput(...fields), response.err)
            return { success: false }
        }

        return { success: true, authCredential: response.authCredential }

        type ValidContent =
            Readonly<{ valid: false }> |
            Readonly<{ valid: true, content: [LoginID, Password] }>

        function mapContent(loginID: Content<LoginID>, password: Content<Password>): ValidContent {
            if (
                !loginID.valid ||
                !password.valid
            ) {
                return { valid: false }
            }
            return { valid: true, content: [loginID.content, password.content] }
        }
        function mapInput(loginID: Content<LoginID>, password: Content<Password>): InputContent {
            return {
                loginID: loginID.input,
                password: password.input,
            }
        }
    }
}

async function delayed<T>(promise: Promise<T>, time: DelayTime, handler: DelayedHandler): Promise<T> {
    const DELAYED_MARKER = { DELAYED: true }
    const delayed = new Promise((resolve) => {
        setTimeout(() => {
            resolve(DELAYED_MARKER)
        }, time.delay_milli_second)
    })

    const winner = await Promise.race([promise, delayed])
    if (winner === DELAYED_MARKER) {
        handler()
    }

    return await promise
}

type DelayTime = { delay_milli_second: number }

interface DelayedHandler {
    (): void
}
