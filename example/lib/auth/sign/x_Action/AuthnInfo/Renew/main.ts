import { newRenewAuthnInfoInfra } from "../../../authnInfo/renew/main"
import { newStartContinuousRenewAuthnInfoInfra } from "../../../authnInfo/startContinuousRenew/main"
import {
    newGetSecureScriptPathLocationInfo,
    newGetSecureScriptPathInfra,
} from "../../../secureScriptPath/get/main"
import { RenewAuthnInfoAction } from "./action"
import { initRenewAuthnInfoAction } from "./impl"

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
