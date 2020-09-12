import { Infra } from "../infra"

import { CredentialAction, LoginIDField, LoginIDEvent, RenewResult, RenewEvent, StoreEvent } from "../action"

import { LoginID, LoginIDError, AuthCredential } from "../data"
import { InputValue, Content, validContent, invalidContent, Valid, hasError } from "../../input/data"

export function initCredentialAction(infra: Infra): CredentialAction {
    return new CredentialActionImpl(infra)
}

class CredentialActionImpl implements CredentialAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra
    }

    initLoginIDField(): LoginIDField {
        return new LoginIDFieldImpl()
    }

    async renew(event: RenewEvent): Promise<RenewResult> {
        const findResponse = this.infra.authCredentials.findTicketNonce()
        if (!findResponse.success) {
            event.failedToRenew(findResponse.err)
            return { success: false }
        }

        if (!findResponse.found) {
            event.failedToRenew({ type: "ticket-nonce-not-found" })
            return { success: false }
        }

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const promise = this.infra.renewClient.renew(findResponse.content)
        const response = await delayed(promise, this.infra.config.renewDelayTime, event.delayedToRenew)
        if (!response.success) {
            event.failedToRenew(response.err)
            return { success: false }
        }

        return { success: true, authCredential: response.authCredential }
    }

    async store(event: StoreEvent, authCredential: AuthCredential): Promise<void> {
        const response = this.infra.authCredentials.storeAuthCredential(authCredential)
        if (!response.success) {
            event.failedToStore(response.err)
            return
        }

        event.succeedToStore()
    }
}

class LoginIDFieldImpl implements LoginIDField {
    loginID: InputValue

    constructor() {
        this.loginID = { inputValue: "" }
    }

    set(event: LoginIDEvent, input: InputValue): Content<LoginID> {
        this.loginID = input
        return this.validate(event)
    }
    validate(event: LoginIDEvent): Content<LoginID> {
        const state = this.state()
        event.updated(...state)
        return this.content(state[0])
    }

    state(): [Valid<LoginIDError>] {
        return [hasError(validateLoginID(this.loginID.inputValue))]
    }
    content(result: Valid<LoginIDError>): Content<LoginID> {
        if (!result.valid) {
            return invalidContent(this.loginID)
        }
        return validContent(this.loginID, { loginID: this.loginID.inputValue })
    }
}

const ERROR: {
    ok: Array<LoginIDError>,
    empty: Array<LoginIDError>,
} = {
    ok: [],
    empty: ["empty"],
}

function validateLoginID(loginID: string): Array<LoginIDError> {
    if (loginID.length === 0) {
        return ERROR.empty
    }

    return ERROR.ok
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
