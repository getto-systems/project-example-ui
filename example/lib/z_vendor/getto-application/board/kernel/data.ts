export type BoardValue = string & { BoardValue: never }
export function markBoardValue(input: string): BoardValue {
    return input as BoardValue
}

export const emptyBoardValue: BoardValue = markBoardValue("")

export type BoardConvertResult<T> =
    | Readonly<{ success: true; value: T }>
    | Readonly<{ success: false }>
