import { BoardValue } from "./data"

export interface Board {
    get(name: string): BoardValue
    set(name: string, value: BoardValue): void
    clear(name: string): void
}

export interface BoardValidateStack {
    get(name: string): BoardValidateStackFound
    update(name: string, result: boolean): void
}

export type BoardValidateStackFound =
    | Readonly<{ found: true; state: boolean }>
    | Readonly<{ found: false }>
