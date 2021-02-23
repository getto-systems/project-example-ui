import { newRequestTokenInfra } from "../../../init"

import { initCoreMaterial } from "../Core/impl"

import { CoreMaterial } from "../Core/action"

export function newCoreMaterial(): CoreMaterial {
    return initCoreMaterial(newRequestTokenInfra())
}
