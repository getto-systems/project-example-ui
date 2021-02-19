import { ClearBoardMethod, SetBoardValueMethod } from "./method"

import { InputBoardInfra } from "./infra"

import { emptyBoardValue } from "../kernel/data"
import { BoardInputType } from "./data"

export type InputBoardEmbed = Readonly<{
    name: string
    type: BoardInputType
}>

interface SetValue {
    (embed: InputBoardEmbed, infra: InputBoardInfra): SetBoardValueMethod
}
export const setBoardValue: SetValue = (embed, infra) => (value, post) => {
    const { name } = embed
    const { board } = infra
    board.set(name, value)
    post({ type: "succeed-to-input", value })
}

interface Clear {
    (embed: InputBoardEmbed, infra: InputBoardInfra): ClearBoardMethod
}
export const clearBoard: Clear = (embed, infra) => (post) => {
    const { name } = embed
    const { board } = infra
    board.clear(name)
    post({ type: "succeed-to-input", value: emptyBoardValue })
}
