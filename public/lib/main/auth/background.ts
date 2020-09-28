import { initStoreCredentialOperationPubSub } from "../../background/store_credential/impl"

import { AuthBackground, AuthBackgroundSubscriber } from "../../auth/usecase"

export function newWorkerAuthBackground(): { background: AuthBackground, subscriber: AuthBackgroundSubscriber } {
    const store = initStoreCredentialOperationPubSub()

    return {
        background: {
            storeCredential: store.send,
        },
        subscriber: {
            storeCredential: store.sub,
        },
    }
}
