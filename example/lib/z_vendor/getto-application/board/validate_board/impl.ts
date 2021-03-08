import { initValidateBoardStack } from "./infra/stack"

import { ValidateBoardStateFound, ValidateBoardInfra } from "./infra"

import { UpdateBoardValidateStateMethod } from "./method"

import { ValidateBoardState } from "./data"

export function initValidateBoardInfra<N extends string>(fields: N[]): ValidateBoardInfra<N> {
    return {
        fields,
        stack: initValidateBoardStack(),
    }
}

interface UpdateValidateState {
    <N extends string>(infra: ValidateBoardInfra<N>): UpdateBoardValidateStateMethod<N>
}
export const updateBoardValidateState: UpdateValidateState = (infra) => (name, valid, post) => {
    const { fields, stack } = infra

    stack.update(name, valid)
    post(compose(fields.map((field) => stack.get(field))))
}

function compose(results: ValidateBoardStateFound[]): ValidateBoardState {
    if (results.some((result) => result.found && !result.state)) {
        return "invalid"
    }
    if (results.some((result) => !result.found)) {
        return "initial"
    }
    return "valid"
}
