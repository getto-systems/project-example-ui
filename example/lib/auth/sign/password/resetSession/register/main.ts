import { newRegisterPasswordRemote } from "./infra/remote/register/main"

import { delayed } from "../../../../../z_infra/delayed/core"

import { delaySecond } from "../../../../../z_infra/time/infra"
import { RegisterPasswordInfra } from "./infra"
import { initRegisterPasswordLocationInfo } from "./impl"
import { currentURL } from "../../../../../z_infra/location/url"
import { RegisterPasswordLocationInfo } from "./method"

export function newRegisterPasswordInfra(): RegisterPasswordInfra {
    return {
        register: newRegisterPasswordRemote(),
        delayed: delayed,
        config: {
            delay: delaySecond(1),
        },
    }
}

export function newRegisterPasswordLocationInfo(): RegisterPasswordLocationInfo {
    return initRegisterPasswordLocationInfo(currentURL())
}
