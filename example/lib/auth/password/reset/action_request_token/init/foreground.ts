import { newRequestResetTokenInfra } from "../../request_token/impl/init"

import { buildRequestResetTokenView } from "./worker/foreground"

import { initRequestResetTokenCoreAction, initRequestResetTokenCoreMaterial } from "../core/impl"

import { RequestResetTokenView } from "../resource"

export function newRequestResetTokenView(): RequestResetTokenView {
    return buildRequestResetTokenView(
        initRequestResetTokenCoreAction(
            initRequestResetTokenCoreMaterial(newRequestResetTokenInfra()),
        ),
    )
}
