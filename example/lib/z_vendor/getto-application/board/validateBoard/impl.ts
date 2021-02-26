import { BoardValidateStackFound, ValidateBoardInfra } from "../kernel/infra"

import { ConvertBoardMethod, ValidateBoardMethod } from "./method"

import { BoardConvertResult } from "../kernel/data"
import { BoardValidateState } from "./data"

export type ValidateBoardEmbed<N extends string, T> = ConvertEmbed<T> & ValidateEmbed<N>

type ConvertEmbed<T> = Readonly<{
    converter: BoardConverter<T>
}>
type ValidateEmbed<N extends string> = Readonly<{
    fields: N[]
}>

export interface BoardConverter<T> {
    (): BoardConvertResult<T>
}

interface Convert {
    <T>(embed: ConvertEmbed<T>): ConvertBoardMethod<T>
}
export const convertBoard: Convert = (embed) => embed.converter

interface Validate {
    <N extends string>(embed: ValidateEmbed<N>, infra: ValidateBoardInfra): ValidateBoardMethod
}
export const validateBoard: Validate = (embed, infra) => () => {
    const { fields } = embed
    const { stack } = infra

    return compose(fields.map((field) => stack.get(field)))
}

function compose(results: BoardValidateStackFound[]): BoardValidateState {
    if (results.some((result) => result.found && !result.state)) {
        return "invalid"
    }
    if (results.some((result) => !result.found)) {
        return "initial"
    }
    return "valid"
}
