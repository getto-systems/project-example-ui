import { newRenewInfra } from "../../init"
import { newStartContinuousRenewAuthnInfoInfra } from "../../../common/startContinuousRenew/init"
import { newGetSecureScriptPathInfra } from "../../../../../common/secureScriptPath/get/main"

import { newGetSecureScriptPathLocationInfo } from "../../../../../common/secureScriptPath/get/impl"

import { toEntryPoint } from "./impl"
import { initCoreAction, initCoreMaterial } from "./Core/impl"

import { RenewAuthnInfoEntryPoint } from "./action"

export function newRenewAuthnInfo(webStorage: Storage, currentURL: URL): RenewAuthnInfoEntryPoint {
    return toEntryPoint(
        initCoreAction(
            initCoreMaterial(
                {
                    renew: newRenewInfra(webStorage),
                    startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
                    getSecureScriptPath: newGetSecureScriptPathInfra(),
                },
                newGetSecureScriptPathLocationInfo(currentURL),
            ),
        ),
    )
}
