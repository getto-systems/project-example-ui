import { newRequestResetTokenInfra } from "../../request_token/impl/init"

import { buildRequestResetTokenEntryPoint } from "./worker/foreground"

import { initRequestResetTokenCoreAction, initRequestResetTokenCoreMaterial } from "../core/impl"

import { RequestResetTokenEntryPoint } from "../entry_point"

export function newRequestResetTokenEntryPoint(): RequestResetTokenEntryPoint {
    return buildRequestResetTokenEntryPoint(
        initRequestResetTokenCoreAction(
            initRequestResetTokenCoreMaterial(newRequestResetTokenInfra()),
        ),
    )
}
