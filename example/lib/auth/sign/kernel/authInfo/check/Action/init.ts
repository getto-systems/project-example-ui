import { newCheckAuthInfoInfra } from "../impl/init"
import { newStartContinuousRenewAuthnInfoInfra } from "../../common/startContinuousRenew/impl/init"
import { newGetSecureScriptPathInfra } from "../../../../common/secure/getScriptPath/impl/init"

import { toCheckAuthInfoEntryPoint } from "./impl"
import { initCheckAuthInfoCoreAction, initCheckAuthInfoCoreMaterial } from "./Core/impl"

import { CheckAuthInfoEntryPoint } from "./entryPoint"
import { newGetScriptPathLocationDetecter } from "../../../../common/secure/getScriptPath/impl/init"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newCheckAuthInfoEntryPoint(feature: OutsideFeature): CheckAuthInfoEntryPoint {
    const { webStorage, currentLocation } = feature
    return toCheckAuthInfoEntryPoint(
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
