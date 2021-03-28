import { newRequestResetTokenRemote } from "../infra/remote/request_token"

import { delaySecond } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { RequestResetTokenInfra } from "../infra"

export function newRequestResetTokenInfra(webCrypto: Crypto): RequestResetTokenInfra {
    return {
        requestToken: newRequestResetTokenRemote(webCrypto),
        config: {
            takeLongtimeThreshold: delaySecond(1),
        },
    }
}
