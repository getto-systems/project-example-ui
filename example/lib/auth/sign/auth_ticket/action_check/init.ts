import { newCheckAuthTicketInfra } from "../check/impl/init"
import { newStartContinuousRenewAuthnInfoInfra } from "../start_continuous_renew/impl/init"
import { newGetSecureScriptPathInfra } from "../../common/secure/get_script_path/impl/init"

import { initCheckAuthTicketView } from "./impl"
import { initCheckAuthTicketCoreAction, initCheckAuthTicketCoreMaterial } from "./core/impl"

import { CheckAuthTicketView } from "./resource"
import { newGetScriptPathLocationDetecter } from "../../common/secure/get_script_path/impl/init"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newCheckAuthTicketView(feature: OutsideFeature): CheckAuthTicketView {
    const { webStorage, currentLocation } = feature
    return initCheckAuthTicketView(
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
