import { newRegisterPasswordResetSessionRemoteAccess } from "./infra/remote/register/main"

import { delayed } from "../../../../../z_infra/delayed/core"

import { delaySecond } from "../../../../../z_infra/time/infra"
import { RegisterPasswordResetSessionInfra } from "./infra"
import { initRegisterPasswordResetSessionLocationInfo } from "./impl"
import { currentURL } from "../../../../../z_infra/location/url"
import { RegisterPasswordResetSessionLocationInfo } from "./method"

export function newRegisterPasswordResetSessionInfra(): RegisterPasswordResetSessionInfra {
    return {
        register: newRegisterPasswordResetSessionRemoteAccess(),
        delayed: delayed,
        config: {
            delay: delaySecond(1),
        },
    }
}

export function newRegisterPasswordResetSessionLocationInfo(): RegisterPasswordResetSessionLocationInfo {
    return initRegisterPasswordResetSessionLocationInfo(currentURL())
}
