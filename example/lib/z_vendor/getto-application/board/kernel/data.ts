export type BoardValue = string & { BoardValue: never }
export function markBoardValue(input: string): BoardValue {
    return input as BoardValue
}

export const emptyBoardValue: BoardValue = markBoardValue("")

// board の中ではほとんど使われていないが、変換結果として外に返す構造なので kernel で定義
export type ConvertBoardResult<T> =
    | Readonly<{ success: true; value: T }>
    | Readonly<{ success: false }>
