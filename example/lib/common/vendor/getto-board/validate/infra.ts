import { Board } from "../kernel/infra"

export type ValidateBoardInfra = Readonly<{
    board: Board
    stack: BoardValidateStack
}>

export interface BoardValidateStack {
    get(name: string): boolean
    update(name: string, result: boolean): void
}
