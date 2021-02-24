import { newRenewAuthnInfoInfra } from "../../main"
import { newStartContinuousRenewAuthnInfoInfra } from "../../../common/startContinuousRenew/init"
import { newGetSecureScriptPathInfra } from "../../../../../common/secureScriptPath/get/main"

import { initRenewAuthnInfoAction, toRenewAuthnInfoEntryPoint } from "./impl"

import { RenewAuthnInfoEntryPoint } from "./action"
import { newGetSecureScriptPathLocationInfo } from "../../../../../common/secureScriptPath/get/impl"

export function newRenewAuthnInfo(webStorage: Storage, currentURL: URL): RenewAuthnInfoEntryPoint {
    return toRenewAuthnInfoEntryPoint(
        initRenewAuthnInfoAction(
            {
                renew: newRenewAuthnInfoInfra(webStorage),
                startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
                getSecureScriptPath: newGetSecureScriptPathInfra(),
            },
            newGetSecureScriptPathLocationInfo(currentURL),
        ),
    )
}
