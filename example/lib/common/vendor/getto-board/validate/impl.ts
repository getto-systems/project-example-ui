import { ValidateBoardMethod } from "./method"

import { Board } from "../kernel/infra"
import { ValidateBoardInfra } from "./infra"

import { boardValidateResult } from "./data"

export type ValidateBoardEmbed<N extends string, E> = Readonly<{
    name: N
    validator: BoardValidator<E>
}>

export interface BoardValidator<E> {
    (board: Board): E[]
}

interface Validate {
    <N extends string, E>(
        embed: ValidateBoardEmbed<N, E>,
        infra: ValidateBoardInfra
    ): ValidateBoardMethod<E>
}
export const validateBoard: Validate = (embed, infra) => (post) => {
    const { name, validator } = embed
    const { board, stack } = infra
    const result = boardValidateResult(validator(board))
    stack.update(name, result.success)
    post({ type: "succeed-to-validate", result })
}
