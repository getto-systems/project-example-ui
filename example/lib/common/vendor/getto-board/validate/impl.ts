import { ValidateBoardMethod } from "./method"

import { ValidateBoardInfra } from "./infra"

import { BoardConvertResult, boardValidateResult } from "./data"

export type ValidateBoardEmbed<N extends string, T, E> = Readonly<{
    name: N
    converter: BoardConverter<T>
    validator: BoardValidator<E>
}>

export interface BoardConverter<T> {
    (): BoardConvertResult<T>
}
export interface BoardValidator<E> {
    (): E[]
}

interface Validate {
    <N extends string, T, E>(
        embed: ValidateBoardEmbed<N, T, E>,
        infra: ValidateBoardInfra
    ): ValidateBoardMethod<E>
}
export const validateBoard: Validate = (embed, infra) => (post) => {
    const { name, validator } = embed
    const { stack } = infra
    const result = boardValidateResult(validator())
    stack.update(name, result.valid)
    post(result)
}
