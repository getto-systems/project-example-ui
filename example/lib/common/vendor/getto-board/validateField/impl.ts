import { ConvertBoardFieldMethod, ValidateBoardFieldMethod } from "./method"

import { ValidateBoardFieldInfra } from "./infra"

import { boardFieldValidateResult } from "./data"
import { BoardConvertResult } from "../kernel/data"

export type ValidateBoardFieldEmbed<N extends string, T, E> = ConvertEmbed<T> & ValidateEmbed<N, E>
type ConvertEmbed<T> = Readonly<{
    converter: BoardFieldConverter<T>
}>
type ValidateEmbed<N extends string, E> = Readonly<{
    name: N
    validator: BoardFieldValidator<E>
}>

export interface BoardFieldConverter<T> {
    (): BoardConvertResult<T>
}
export interface BoardFieldValidator<E> {
    (): E[]
}

interface Convert {
    <T>(embed: ConvertEmbed<T>): ConvertBoardFieldMethod<T>
}
export const convertBoardField: Convert = (embed) => embed.converter

interface Validate {
    <N extends string, E>(
        embed: ValidateEmbed<N, E>,
        infra: ValidateBoardFieldInfra
    ): ValidateBoardFieldMethod<E>
}
export const validateBoardField: Validate = (embed, infra) => () => {
    const { name, validator } = embed
    const { stack } = infra
    const result = boardFieldValidateResult(validator())
    stack.update(name, result.valid)
    return result
}
