import { newRequestTokenRemote } from "./infra/remote/requestToken"

import { delaySecond } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { RequestTokenInfra } from "./infra"

export function newRequestTokenInfra(): RequestTokenInfra {
    return {
        requestToken: newRequestTokenRemote(),
        config: {
            delay: delaySecond(1),
        },
    }
}
