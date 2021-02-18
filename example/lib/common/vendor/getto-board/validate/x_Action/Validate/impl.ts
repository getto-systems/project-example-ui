import { ApplicationAbstractAction } from "../../../../getto-example/Application/impl"

import { validateBoard } from "../../impl"

import { ValidateBoardInfra } from "../../infra"

import { ValidateBoardAction, ValidateBoardState, ValidateBoardMaterial } from "./action"

export type ValidateBoardBase<N extends string, E> = Readonly<{
    validate: ValidateBoardInfra<N, E>
}>
export function initValidateBoardAction<N extends string, E>(
    base: ValidateBoardBase<N, E>
): ValidateBoardAction<E> {
    return new Action({
        validate: validateBoard(base.validate),
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
