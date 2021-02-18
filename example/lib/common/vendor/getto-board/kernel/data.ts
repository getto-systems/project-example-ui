export type BoardValue = string & { BoardValue: never }
export function markBoardValue(input: string): BoardValue {
    return input as BoardValue
}

export type EmptyBoardValue = "" & BoardValue
export const emptyBoardValue: EmptyBoardValue = "" as EmptyBoardValue
