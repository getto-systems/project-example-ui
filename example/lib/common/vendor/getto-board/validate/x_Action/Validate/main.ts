import { initValidateBoardAction } from "./impl"

import { ValidateBoardInfra } from "../../infra"

import { ValidateBoardAction } from "./action"

export function newValidateBoardAction<N extends string, E>(
    infra: ValidateBoardInfra<N, E>
): ValidateBoardAction<E> {
    return initValidateBoardAction({
        validate: infra,
    })
}
