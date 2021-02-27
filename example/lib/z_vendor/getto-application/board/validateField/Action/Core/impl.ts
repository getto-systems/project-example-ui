import { ApplicationAbstractStateAction } from "../../../../action/impl"

import { convertBoardField } from "../../impl"

import {
    ValidateBoardFieldAction,
    ValidateBoardFieldState,
    ValidateBoardFieldMaterial,
} from "./action"

import { ConvertBoardFieldResult } from "../../data"
import { ValidateBoardFieldInfra } from "../../infra"

export function initValidateBoardFieldAction<T, E>(
    infra: ValidateBoardFieldInfra<T, E>,
): ValidateBoardFieldAction<T, E> {
    return new Action({
        convert: convertBoardField(infra),
    })
}

class Action<T, E>
    extends ApplicationAbstractStateAction<ValidateBoardFieldState<E>>
    implements ValidateBoardFieldAction<T, E> {
    readonly initialState: ValidateBoardFieldState<E> = { valid: true }

    material: ValidateBoardFieldMaterial<T, E>

    constructor(material: ValidateBoardFieldMaterial<T, E>) {
        super()
        this.material = material
    }

    get(): ConvertBoardFieldResult<T, E> {
        return this.material.convert(this.post)
    }
    check(): void {
        this.material.convert(this.post)
    }
}
