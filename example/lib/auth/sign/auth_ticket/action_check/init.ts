import { newCheckAuthTicketInfra } from "../check/impl/init"
import { newStartContinuousRenewAuthnInfoInfra } from "../start_continuous_renew/impl/init"
import { newGetSecureScriptPathInfra } from "../../common/secure/get_script_path/impl/init"

import { initCheckAuthTicketEntryPoint } from "./impl"
import { initCheckAuthTicketCoreAction, initCheckAuthTicketCoreMaterial } from "./core/impl"

import { CheckAuthTicketEntryPoint } from "./entry_point"
import { newGetScriptPathLocationDetecter } from "../../common/secure/get_script_path/impl/init"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newCheckAuthTicketEntryPoint(feature: OutsideFeature): CheckAuthTicketEntryPoint {
    const { webStorage, currentLocation } = feature
    return initCheckAuthTicketEntryPoint(
        initCheckAuthTicketCoreAction(
            initCheckAuthTicketCoreMaterial(
                {
                    check: newCheckAuthTicketInfra(webStorage),
                    startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
                    getSecureScriptPath: newGetSecureScriptPathInfra(),
                },
                newGetScriptPathLocationDetecter(currentLocation),
            ),
        ),
    )
}
