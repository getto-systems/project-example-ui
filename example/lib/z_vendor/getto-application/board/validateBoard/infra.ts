import { ConvertBoardResult } from "../kernel/data"

export type ValidateBoardInfra<N extends string> = Readonly<{
    fields: N[]
    stack: ValidateBoardStack
}>
export interface BoardConverter<T> {
    (): ConvertBoardResult<T>
}

export interface ValidateBoardStack {
    get(name: string): ValidateBoardStateFound
    update(name: string, result: boolean): void
}

export type ValidateBoardStateFound =
    | Readonly<{ found: true; state: boolean }>
    | Readonly<{ found: false }>
