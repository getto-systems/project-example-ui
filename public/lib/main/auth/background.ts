import { initBackgroundCredentialOperationPubSub } from "../../background/credential/impl"

import { AuthBackground, AuthBackgroundSubscriber } from "../../auth/usecase"

export function newWorkerAuthBackground(): { background: AuthBackground, subscriber: AuthBackgroundSubscriber } {
    const credential = initBackgroundCredentialOperationPubSub()

    return {
        background: {
            credential: credential.request,
        },
        subscriber: {
            credential: credential.sub,
        },
    }
}
