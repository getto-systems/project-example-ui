import { ClearBoardMethod, SetBoardValueMethod } from "./method"

import { InputBoardInfra } from "./infra"

import { emptyBoardValue } from "../kernel/data"

interface SetValue {
    <N extends string>(infra: InputBoardInfra<N>): SetBoardValueMethod
}
export const setBoardValue: SetValue = (infra) => (value, post) => {
    const { name, board } = infra
    board.set(name, value)
    post({ type: "succeed-to-input", value })
}

interface Clear {
    <N extends string>(infra: InputBoardInfra<N>): ClearBoardMethod
}
export const clearBoard: Clear = (infra) => (post) => {
    const { name, board } = infra
    board.clear(name)
    post({ type: "succeed-to-input", value: emptyBoardValue })
}
