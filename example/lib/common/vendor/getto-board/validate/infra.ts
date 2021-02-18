import { Board } from "../kernel/infra"

export type ValidateBoardInfra<N extends string, E> = Readonly<{
    board: Board
    stack: BoardValidateStack
    name: N
    validator: BoardValidator<E>
}>

export interface BoardValidator<E> {
    (board: Board): E[]
}

export interface BoardValidateStack {
    get(name: string): boolean
    update(name: string, result: boolean): void
}
