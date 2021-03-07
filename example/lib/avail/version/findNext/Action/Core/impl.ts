import { ApplicationAbstractStateAction } from "../../../../../z_vendor/getto-application/action/impl"
import { findNextVersion } from "../../impl/core"
import { FindNextVersionInfra } from "../../infra"
import { FindNextVersionLocationDetecter } from "../../method"

import {
    FindNextVersionMaterial,
    FindNextVersionCoreActionState,
    initialFindNextVersionCoreActionState,
    FindNextVersionCoreAction,
} from "./action"

export function initFindNextVersionCoreMaterial(
    infra: FindNextVersionInfra,
    detecter: FindNextVersionLocationDetecter,
): FindNextVersionMaterial {
    return {
        find: findNextVersion(infra)(detecter),
    }
}

export function initFindNextVersionCoreAction(
    material: FindNextVersionMaterial,
): FindNextVersionCoreAction {
    return new Action(material)
}

class Action
    extends ApplicationAbstractStateAction<FindNextVersionCoreActionState>
    implements FindNextVersionCoreAction {
    readonly initialState = initialFindNextVersionCoreActionState

    material: FindNextVersionMaterial

    constructor(material: FindNextVersionMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.find(this.post)
        })
    }
}
