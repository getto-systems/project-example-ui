import { newCheckAuthInfoInfra } from "../init"
import { newStartContinuousRenewAuthnInfoInfra } from "../../common/startContinuousRenew/impl/init"
import { newGetSecureScriptPathInfra } from "../../../../common/secure/getScriptPath/impl/init"

import { toEntryPoint } from "./impl"
import { initCoreAction, initCoreMaterial } from "./Core/impl"

import { CheckAuthInfoEntryPoint } from "./action"
import { newGetScriptPathLocationDetecter } from "../../../../common/secure/getScriptPath/impl/init"

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
                newGetScriptPathLocationDetecter(currentLocation),
            ),
        ),
    )
}
