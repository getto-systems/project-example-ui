import { ApplicationAbstractAction } from "../../../getto-example/Application/impl"

import { composeBoardValidate, ComposeBoardValidateEmbed } from "../impl"

import { ComposeBoardValidateInfra } from "../infra"

import {
    ComposeBoardValidateAction,
    ComposeBoardValidateMaterial,
    ComposeBoardValidateState,
} from "./action"

export function initComposeBoardValidateAction<N extends string>(
    embed: ComposeBoardValidateEmbed<N>,
    infra: ComposeBoardValidateInfra
): ComposeBoardValidateAction {
    return new Action({
        compose: composeBoardValidate(embed)(infra),
    })
}

class Action
    extends ApplicationAbstractAction<ComposeBoardValidateState>
    implements ComposeBoardValidateAction {
    material: ComposeBoardValidateMaterial

    constructor(material: ComposeBoardValidateMaterial) {
        super()
        this.material = material
    }

    compose(): void {
        this.material.compose((event) => this.post(event))
    }
}
