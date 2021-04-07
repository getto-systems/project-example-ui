import { newRequestResetTokenInfra } from "../../request_token/impl/init"

import { buildRequestResetTokenView } from "./worker/foreground"

import { initRequestResetTokenCoreAction, initRequestResetTokenCoreMaterial } from "../core/impl"

import { RequestResetTokenView } from "../resource"
import { RemoteOutsideFeature } from "../../../../../z_vendor/getto-application/infra/remote/infra"

type OutsideFeature = RemoteOutsideFeature
export function newRequestResetTokenView(feature: OutsideFeature): RequestResetTokenView {
    return buildRequestResetTokenView(
        initRequestResetTokenCoreAction(
            initRequestResetTokenCoreMaterial(newRequestResetTokenInfra(feature)),
        ),
    )
}
