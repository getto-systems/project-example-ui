import { BoardValue } from "../kernel/data"

export type InputBoardValueInfra = Readonly<{
    store: BoardValueStore
}>

export interface BoardValueStore {
    get(): BoardValue
    set(value: BoardValue): void
    clear(): void
}
