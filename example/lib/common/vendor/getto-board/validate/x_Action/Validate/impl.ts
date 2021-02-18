import { ApplicationAbstractAction } from "../../../../getto-example/Application/impl"

import { validateBoard, ValidateBoardEmbed } from "../../impl"

import { ValidateBoardInfra } from "../../infra"

import { ValidateBoardAction, ValidateBoardState, ValidateBoardMaterial } from "./action"

export function initValidateBoardAction<N extends string, E>(
    embed: ValidateBoardEmbed<N, E>,
    infra: ValidateBoardInfra
): ValidateBoardAction<E> {
    return new Action({
        validate: validateBoard(embed)(infra),
    })
}

class Action<E>
    extends ApplicationAbstractAction<ValidateBoardState<E>>
    implements ValidateBoardAction<E> {
    material: ValidateBoardMaterial<E>

    constructor(material: ValidateBoardMaterial<E>) {
        super()
        this.material = material
    }

    check(): void {
        this.material.validate((event) => this.post(event))
    }
}
