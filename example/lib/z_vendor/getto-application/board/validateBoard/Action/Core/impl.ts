import { ApplicationAbstractStateAction } from "../../../../action/impl"

import { initValidateBoardInfra, updateBoardValidateState } from "../../impl"

import { BoardConverter } from "../../infra"

import {
    initialValidateBoardState,
    ValidateBoardAction,
    ValidateBoardMaterial,
    ValidateBoardActionState,
} from "./action"

import { ConvertBoardResult } from "../../../kernel/data"
import { ValidateBoardFieldStateHandler } from "../../../validateField/Action/Core/action"

export type ValidateBoardActionParams<N extends string, T> = Readonly<{
    fields: N[]
    converter: BoardConverter<T>
}>
export function initValidateBoardAction<N extends string, T>({
    fields,
    converter,
}: ValidateBoardActionParams<N, T>): ValidateBoardAction<N, T> {
    const infra = initValidateBoardInfra(fields)
    return new Action(converter, {
        updateValidateState: updateBoardValidateState(infra),
    })
}

class Action<N extends string, T>
    extends ApplicationAbstractStateAction<ValidateBoardActionState>
    implements ValidateBoardAction<N, T> {
    readonly initialState: ValidateBoardActionState = initialValidateBoardState

    converter: BoardConverter<T>
    material: ValidateBoardMaterial<N>

    constructor(converter: BoardConverter<T>, material: ValidateBoardMaterial<N>) {
        super()
        this.converter = converter
        this.material = material
    }

    updateValidateState<E>(name: N): ValidateBoardFieldStateHandler<E> {
        return (result) => {
            this.material.updateValidateState(name, result.valid, this.post)
        }
    }

    get(): ConvertBoardResult<T> {
        return this.converter()
    }
}
