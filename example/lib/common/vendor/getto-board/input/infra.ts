import { Board } from "../kernel/infra"

export type InputBoardInfra<N extends string> = Readonly<{
    board: Board
    name: N
}>
