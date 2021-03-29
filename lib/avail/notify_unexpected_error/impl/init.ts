import { newNotifyUnexpectedErrorRemote } from "../infra/remote/notify"

import { NotifyUnexpectedErrorInfra } from "../infra"

export function newNotifyUnexpectedErrorInfra(webCrypto: Crypto): NotifyUnexpectedErrorInfra {
    return {
        notify: newNotifyUnexpectedErrorRemote(webCrypto),
    }
}
