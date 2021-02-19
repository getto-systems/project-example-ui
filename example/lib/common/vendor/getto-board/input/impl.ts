import { ClearBoardValueMethod, SetBoardValueMethod } from "./method"

import { InputBoardValueInfra } from "./infra"

import { emptyBoardValue } from "../kernel/data"
import { InputBoardValueType } from "./data"

export type InputBoardEmbed = Readonly<{
    name: string
    type: InputBoardValueType
}>

interface SetValue {
    (embed: InputBoardEmbed, infra: InputBoardValueInfra): SetBoardValueMethod
}
export const setBoardValue: SetValue = (embed, infra) => (value, post) => {
    const { name } = embed
    const { board } = infra
    board.set(name, value)
    post(value)
}

interface Clear {
    (embed: InputBoardEmbed, infra: InputBoardValueInfra): ClearBoardValueMethod
}
export const clearBoardValue: Clear = (embed, infra) => (post) => {
    const { name } = embed
    const { board } = infra
    board.clear(name)
    post(emptyBoardValue)
}
