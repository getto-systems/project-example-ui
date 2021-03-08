import { newRequestResetTokenInfra } from "../../request_token/impl/init"

import { initRequestResetTokenEntryPoint } from "./worker/foreground"

import { initRequestResetTokenCoreAction, initRequestResetTokenCoreMaterial } from "../core/impl"

import { RequestResetTokenEntryPoint } from "../entry_point"

export function newRequestResetTokenEntryPoint(): RequestResetTokenEntryPoint {
    return initRequestResetTokenEntryPoint(
        initRequestResetTokenCoreAction(
            initRequestResetTokenCoreMaterial(newRequestResetTokenInfra()),
        ),
    )
}
