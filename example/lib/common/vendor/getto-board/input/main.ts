import { Board } from "../kernel/infra"
import { InputBoardInfra } from "./infra"

export function newInputBoardInfra<N extends string>(board: Board, name: N): InputBoardInfra<N> {
    return { board, name }
}
