import { newCheckAuthInfoInfra } from "../init"
import { newStartContinuousRenewAuthnInfoInfra } from "../../common/startContinuousRenew/init"
import { newGetSecureScriptPathInfra } from "../../../../common/secureScriptPath/get/main"

import { toEntryPoint } from "./impl"
import { initCoreAction, initCoreMaterial } from "./Core/impl"

import { CheckAuthInfoEntryPoint } from "./action"
import { newSecureScriptPathLocationDetecter } from "../../../../common/secureScriptPath/get/init"

export function newRenewAuthnInfo(
    webStorage: Storage,
    currentLocation: Location,
): CheckAuthInfoEntryPoint {
    return toEntryPoint(
        initCoreAction(
            initCoreMaterial(
                {
                    renew: newCheckAuthInfoInfra(webStorage),
                    startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
                    getSecureScriptPath: newGetSecureScriptPathInfra(),
                },
                newSecureScriptPathLocationDetecter(currentLocation),
            ),
        ),
    )
}
