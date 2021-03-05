import { newRequestResetTokenInfra } from "../../impl/init"

import { initRequestResetTokenEntryPoint } from "./worker/foreground"

import { initRequestResetTokenCoreAction, initRequestResetTokenCoreMaterial } from "../Core/impl"

import { RequestResetTokenEntryPoint } from "../entryPoint"

export function newRequestResetTokenEntryPoint(): RequestResetTokenEntryPoint {
    return initRequestResetTokenEntryPoint(
        initRequestResetTokenCoreAction(
            initRequestResetTokenCoreMaterial(newRequestResetTokenInfra()),
        ),
    )
}
