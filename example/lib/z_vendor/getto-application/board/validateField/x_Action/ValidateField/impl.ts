import { ApplicationAbstractStateAction } from "../../../../action/impl"

import { convertBoardField, validateBoardField, ValidateBoardFieldEmbed } from "../../impl"

import { ValidateBoardInfra } from "../../../kernel/infra"

import {
    ValidateBoardFieldAction,
    ValidateBoardFieldState,
    ValidateBoardFieldMaterial,
} from "./action"

import { BoardConvertResult } from "../../../kernel/data"

export function initValidateBoardFieldAction<N extends string, T, E>(
    embed: ValidateBoardFieldEmbed<N, T, E>,
    infra: ValidateBoardInfra,
): ValidateBoardFieldAction<T, E> {
    return new Action(embed.name, {
        convert: convertBoardField(embed),
        validate: validateBoardField(embed, infra),
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

    get(): BoardConvertResult<T> {
        if (!this.material.validate().valid) {
            return { success: false }
        }
        return this.material.convert()
    }
    check(): void {
        this.post(this.material.validate())
    }
}
