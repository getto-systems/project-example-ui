import { newCheckAuthInfoInfra } from "../init"
import { newStartContinuousRenewAuthnInfoInfra } from "../../common/startContinuousRenew/init"
import { newGetSecureScriptPathInfra } from "../../../../common/secureScriptPath/get/main"

import { newGetSecureScriptPathLocationInfo } from "../../../../common/secureScriptPath/get/impl"

import { toEntryPoint } from "./impl"
import { initCoreAction, initCoreMaterial } from "./Core/impl"

import { CheckAuthInfoEntryPoint } from "./action"

export function newRenewAuthnInfo(webStorage: Storage, currentURL: URL): CheckAuthInfoEntryPoint {
    return toEntryPoint(
        initCoreAction(
            initCoreMaterial(
                {
                    renew: newCheckAuthInfoInfra(webStorage),
                    startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
                    getSecureScriptPath: newGetSecureScriptPathInfra(),
                },
                newGetSecureScriptPathLocationInfo(currentURL),
            ),
        ),
    )
}
