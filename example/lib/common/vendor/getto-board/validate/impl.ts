import { ValidateBoardMethod } from "./method"

import { ValidateBoardInfra } from "./infra"
import { boardValidateResult } from "./data"

interface Validate {
    <N extends string, E>(infra: ValidateBoardInfra<N, E>): ValidateBoardMethod<E>
}
export const validateBoard: Validate = (infra) => (post) => {
    const { board, stack, name, validator } = infra
    const result = boardValidateResult(validator(board))
    stack.update(name, result.success)
    post({ type: "succeed-to-validate", result })
}
