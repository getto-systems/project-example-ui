import { ClearBoardMethod, SetBoardValueMethod } from "./method"

import { InputBoardInfra } from "./infra"

import { emptyBoardValue } from "../kernel/data"

export type InputBoardEmbed<N extends string> = Readonly<{
    name: N
}>

interface SetValue {
    <N extends string>(embed: InputBoardEmbed<N>): {
        (infra: InputBoardInfra): SetBoardValueMethod
    }
}
export const setBoardValue: SetValue = (embed) => (infra) => (value, post) => {
    const { name } = embed
    const { board } = infra
    board.set(name, value)
    post({ type: "succeed-to-input", value })
}

interface Clear {
    <N extends string>(embed: InputBoardEmbed<N>): { (infra: InputBoardInfra): ClearBoardMethod }
}
export const clearBoard: Clear = (embed) => (infra) => (post) => {
    const { name } = embed
    const { board } = infra
    board.clear(name)
    post({ type: "succeed-to-input", value: emptyBoardValue })
}
