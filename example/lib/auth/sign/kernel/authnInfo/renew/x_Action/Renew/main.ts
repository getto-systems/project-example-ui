import { newRenewAuthnInfoInfra } from "../../main"
import { newStartContinuousRenewAuthnInfoInfra } from "../../../startContinuousRenew/main"
import {
    newGetSecureScriptPathLocationInfo,
    newGetSecureScriptPathInfra,
} from "../../../../../common/secureScriptPath/get/main"

import { initRenewAuthnInfoAction } from "./impl"

import { RenewAuthnInfoAction } from "./action"

export function newRenewAuthnInfoAction(webStorage: Storage): RenewAuthnInfoAction {
    return initRenewAuthnInfoAction(
        {
            renew: newRenewAuthnInfoInfra(webStorage),
            startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
            getSecureScriptPath: newGetSecureScriptPathInfra(),
        },
        newGetSecureScriptPathLocationInfo()
    )
}
