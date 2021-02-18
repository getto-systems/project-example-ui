import { newInputBoardInfra } from "../../main"

import { initInputBoardAction } from "./impl"

import { Board } from "../../../kernel/infra"

import { InputBoardAction } from "./action"

export function newInputBoardAction<N extends string>(board: Board, name: N): InputBoardAction {
    return initInputBoardAction({
        input: newInputBoardInfra(board, name),
    })
}
