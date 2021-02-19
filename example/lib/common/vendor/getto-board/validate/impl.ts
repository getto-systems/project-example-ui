import { ValidateBoardMethod } from "./method"

import { ValidateBoardInfra } from "./infra"

import { boardValidateResult } from "./data"

export type ValidateBoardEmbed<N extends string, E> = Readonly<{
    name: N
    validator: BoardValidator<E>
}>

export interface BoardValidator<E> {
    (): E[]
}

interface Validate {
    <N extends string, E>(
        embed: ValidateBoardEmbed<N, E>,
        infra: ValidateBoardInfra
    ): ValidateBoardMethod<E>
}
export const validateBoard: Validate = (embed, infra) => (post) => {
    const { name, validator } = embed
    const { stack } = infra
    const result = boardValidateResult(validator())
    stack.update(name, result.valid)
    post({ type: "succeed-to-validate", result })
}
