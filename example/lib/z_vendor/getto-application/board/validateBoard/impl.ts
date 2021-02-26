import { ValidateBoardStateFound, ValidateBoardInfra } from "../kernel/infra"

import { ConvertBoardMethod, ValidateBoardMethod } from "./method"

import { ConvertBoardResult } from "../kernel/data"
import { ValidateBoardState } from "./data"

export type ValidateBoardEmbed<N extends string, T> = ConvertEmbed<T> & ValidateEmbed<N>

type ConvertEmbed<T> = Readonly<{
    converter: { (): ConvertBoardResult<T> }
}>
interface Convert {
    <T>(embed: ConvertEmbed<T>): ConvertBoardMethod<T>
}
export const convertBoard: Convert = (embed) => embed.converter

type ValidateEmbed<N extends string> = Readonly<{
    fields: N[]
}>
interface Validate {
    <N extends string>(embed: ValidateEmbed<N>, infra: ValidateBoardInfra): ValidateBoardMethod
}
export const validateBoard: Validate = (embed, infra) => () => {
    const { fields } = embed
    const { stack } = infra

    return compose(fields.map((field) => stack.get(field)))
}

function compose(results: ValidateBoardStateFound[]): ValidateBoardState {
    if (results.some((result) => result.found && !result.state)) {
        return "invalid"
    }
    if (results.some((result) => !result.found)) {
        return "initial"
    }
    return "valid"
}
