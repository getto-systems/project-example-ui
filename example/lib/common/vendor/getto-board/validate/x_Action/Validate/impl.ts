import { ApplicationAbstractAction } from "../../../../getto-example/Application/impl"
import { BoardConvertResult } from "../../data"

import { BoardConverter, validateBoard, ValidateBoardEmbed } from "../../impl"

import { ValidateBoardInfra } from "../../infra"

import { ValidateBoardAction, ValidateBoardState, ValidateBoardMaterial } from "./action"

export function initValidateBoardAction<N extends string, T, E>(
    embed: ValidateBoardEmbed<N, T, E>,
    infra: ValidateBoardInfra
): ValidateBoardAction<T, E> {
    return new Action(
        () => {
            const result = embed.validator()
            if (result.length != 0) {
                return { success: false }
            }
            return embed.converter()
        },
        {
            validate: validateBoard(embed, infra),
        }
    )
}

class Action<T, E>
    extends ApplicationAbstractAction<ValidateBoardState<E>>
    implements ValidateBoardAction<T, E> {
    converter: BoardConverter<T>
    material: ValidateBoardMaterial<E>

    constructor(converter: BoardConverter<T>, material: ValidateBoardMaterial<E>) {
        super()
        this.converter = converter
        this.material = material
    }

    get(): BoardConvertResult<T> {
        return this.converter()
    }
    check(): void {
        this.material.validate((event) => this.post(event))
    }
}
