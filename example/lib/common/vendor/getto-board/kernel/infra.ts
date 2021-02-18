import { BoardValue } from "./data"

export interface Board {
    get(name: string): BoardValue
    set(name: string, value: BoardValue): void
    clear(name: string): void
}
