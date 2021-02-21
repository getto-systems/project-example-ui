import { newRenewAuthnInfoInfra } from "../../main"
import { newStartContinuousRenewAuthnInfoInfra } from "../../../common/startContinuousRenew/main"
import {
    newGetSecureScriptPathLocationInfo,
    newGetSecureScriptPathInfra,
} from "../../../../../common/secureScriptPath/get/main"

import { initRenewAuthnInfoAction, toRenewAuthnInfoEntryPoint } from "./impl"

import { RenewAuthnInfoEntryPoint } from "./action"

export function newRenewAuthnInfoEntryPoint(webStorage: Storage): RenewAuthnInfoEntryPoint {
    return toRenewAuthnInfoEntryPoint(
        initRenewAuthnInfoAction(
            {
                renew: newRenewAuthnInfoInfra(webStorage),
                startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
                getSecureScriptPath: newGetSecureScriptPathInfra(),
            },
            newGetSecureScriptPathLocationInfo()
        )
    )
}
