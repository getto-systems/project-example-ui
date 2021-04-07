import { newCheckAuthTicketInfra } from "../check/impl/init"
import { newStartContinuousRenewAuthnInfoInfra } from "../start_continuous_renew/impl/init"
import { newGetSecureScriptPathInfra } from "../../common/secure/get_script_path/impl/init"

import { initCheckAuthTicketView } from "./impl"
import { initCheckAuthTicketCoreAction, initCheckAuthTicketCoreMaterial } from "./core/impl"

import { CheckAuthTicketView } from "./resource"
import { newGetScriptPathLocationDetecter } from "../../common/secure/get_script_path/impl/init"
import { RemoteOutsideFeature } from "../../../z_vendor/getto-application/infra/remote/infra"
import { RepositoryOutsideFeature } from "../../../z_vendor/getto-application/infra/repository/infra"
import { LocationOutsideFeature } from "../../../z_vendor/getto-application/location/infra"

type OutsideFeature = RemoteOutsideFeature &
    RepositoryOutsideFeature &
    LocationOutsideFeature
export function newCheckAuthTicketView(feature: OutsideFeature): CheckAuthTicketView {
    return initCheckAuthTicketView(
        initCheckAuthTicketCoreAction(
            initCheckAuthTicketCoreMaterial(
                {
                    check: newCheckAuthTicketInfra(feature),
                    startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(feature),
                    getSecureScriptPath: newGetSecureScriptPathInfra(),
                },
                newGetScriptPathLocationDetecter(feature),
            ),
        ),
    )
}
