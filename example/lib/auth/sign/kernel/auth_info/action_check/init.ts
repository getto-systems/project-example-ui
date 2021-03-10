import { newCheckAuthInfoInfra } from "../check/impl/init"
import { newStartContinuousRenewAuthnInfoInfra } from "../common/start_continuous_renew/impl/init"
import { newGetSecureScriptPathInfra } from "../../../common/secure/get_script_path/impl/init"

import { initCheckAuthInfoEntryPoint } from "./impl"
import { initCheckAuthInfoCoreAction, initCheckAuthInfoCoreMaterial } from "./core/impl"

import { CheckAuthInfoEntryPoint } from "./entry_point"
import { newGetScriptPathLocationDetecter } from "../../../common/secure/get_script_path/impl/init"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newCheckAuthInfoEntryPoint(feature: OutsideFeature): CheckAuthInfoEntryPoint {
    const { webStorage, currentLocation } = feature
    return initCheckAuthInfoEntryPoint(
        initCheckAuthInfoCoreAction(
            initCheckAuthInfoCoreMaterial(
                {
                    check: newCheckAuthInfoInfra(webStorage),
                    startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
                    getSecureScriptPath: newGetSecureScriptPathInfra(),
                },
                newGetScriptPathLocationDetecter(currentLocation),
            ),
        ),
    )
}
