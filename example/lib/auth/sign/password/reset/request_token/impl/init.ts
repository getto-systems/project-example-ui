import { newRequestResetTokenRemote } from "../infra/remote/request_token"

import { delaySecond } from "../../../../../../z_vendor/getto-application/infra/config/infra"
import { RequestResetTokenInfra } from "../infra"

export function newRequestResetTokenInfra(): RequestResetTokenInfra {
    return {
        requestToken: newRequestResetTokenRemote(),
        config: {
            delay: delaySecond(1),
        },
    }
}
