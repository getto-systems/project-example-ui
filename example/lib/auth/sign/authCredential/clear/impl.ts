import { ClearActionInfra, SubmitClearAuthCredential } from "./infra"

import { ClearAuthCredentialAction } from "./action"

export function initClearAuthCredentialAction(infra: ClearActionInfra): ClearAuthCredentialAction {
    return {
        submit: submit(infra),
    }
}

const submit: SubmitClearAuthCredential = (infra) => async (post) => {
    const { authCredentials } = infra
    const result = authCredentials.remove()
    if (!result.success) {
        post({ type: "failed-to-logout", err: result.err })
        return
    }
    post({ type: "succeed-to-logout" })
}
