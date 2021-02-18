import { initInputBoardAction } from "./impl"

import { InputBoardInfra } from "../../infra"

import { InputBoardAction } from "./action"

export function newInputBoardAction<N extends string>(infra: InputBoardInfra<N>): InputBoardAction {
    return initInputBoardAction({
        input: infra,
    })
}
