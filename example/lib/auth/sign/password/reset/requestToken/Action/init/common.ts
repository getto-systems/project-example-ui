import { newRequestResetTokenInfra } from "../../impl/init"

import { initRequestResetTokenCoreMaterial } from "../Core/impl"

import { RequestResetTokenCoreMaterial } from "../Core/action"

export function newRequestResetTokenCoreMaterial(): RequestResetTokenCoreMaterial {
    return initRequestResetTokenCoreMaterial(newRequestResetTokenInfra())
}
