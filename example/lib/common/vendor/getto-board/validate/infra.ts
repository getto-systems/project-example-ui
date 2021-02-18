import { Board, BoardValidateStack } from "../kernel/infra"

export type ValidateBoardInfra = Readonly<{
    board: Board
    stack: BoardValidateStack
}>
