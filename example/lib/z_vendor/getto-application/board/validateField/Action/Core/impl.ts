import { ApplicationAbstractStateAction } from "../../../../action/impl"

import { convertBoardField, ValidateBoardFieldEmbed } from "../../impl"

import { ValidateBoardInfra } from "../../../kernel/infra"

import {
    ValidateBoardFieldAction,
    ValidateBoardFieldState,
    ValidateBoardFieldMaterial,
} from "./action"

import { BoardFieldConvertResult } from "../../data"

export function initValidateBoardFieldAction<N extends string, T, E>(
    embed: ValidateBoardFieldEmbed<N, T, E>,
    infra: ValidateBoardInfra,
): ValidateBoardFieldAction<T, E> {
    return new Action(embed.name, {
        convert: convertBoardField(embed, infra),
    })
}

class Action<T, E>
    extends ApplicationAbstractStateAction<ValidateBoardFieldState<E>>
    implements ValidateBoardFieldAction<T, E> {
    readonly initialState: ValidateBoardFieldState<E> = { valid: true }

    readonly name: string
    material: ValidateBoardFieldMaterial<T, E>

    constructor(name: string, material: ValidateBoardFieldMaterial<T, E>) {
        super()
        this.name = name
        this.material = material
    }

    get(): BoardFieldConvertResult<T, E> {
        const result = this.material.convert()
        if (!result.valid) {
            this.post(map(result))
        }
        return result
    }
    check(): void {
        this.post(map(this.material.convert()))
    }
}

function map<T, E>(result: BoardFieldConvertResult<T, E>): ValidateBoardFieldState<E> {
    if (result.valid) {
        // omit value
        return { valid: true }
    }
    return result
}
