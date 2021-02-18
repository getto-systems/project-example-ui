export type BoardValue = string & { BoardValue: never }
export function markBoardValue(input: string): BoardValue {
    return input as BoardValue
}

export type BoardValue_empty = "" & BoardValue
export const emptyBoardValue: BoardValue_empty = "" as BoardValue_empty
