import { newRequestTokenInfra } from "../../../init"

import { newEntryPoint } from "./worker/foreground"

import { initCoreAction, initCoreMaterial } from "../Core/impl"

import { RequestPasswordResetTokenEntryPoint } from "../action"

export function newRequestPasswordResetToken(): RequestPasswordResetTokenEntryPoint {
    return newEntryPoint(initCoreAction(initCoreMaterial(newRequestTokenInfra())))
}
