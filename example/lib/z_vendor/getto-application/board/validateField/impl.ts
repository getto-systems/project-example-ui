import { ValidateBoardInfra } from "../kernel/infra"

import { ConvertBoardFieldMethod } from "./method"

import { BoardFieldConvertResult } from "./data"
import { BoardValue } from "../kernel/data"

export type ValidateBoardFieldEmbed<N extends string, T, E> = Readonly<{
    name: N
    getter: { (): BoardValue }
    converter: { (value: BoardValue): BoardFieldConvertResult<T, E> }
}>

interface Convert {
    <N extends string, T, E>(
        embed: ValidateBoardFieldEmbed<N, T, E>,
        infra: ValidateBoardInfra,
    ): ConvertBoardFieldMethod<T, E>
}
export const convertBoardField: Convert = (embed, infra) => () => {
    const { name, getter, converter } = embed
    const { stack } = infra
    const result = converter(getter())
    stack.update(name, result.valid)
    return result
}
