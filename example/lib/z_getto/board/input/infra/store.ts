import { BoardValueStore } from "../infra"

import { BoardValue, emptyBoardValue } from "../../kernel/data"

export function newBoardValueStore(): BoardValueStore {
    return new Store()
}

class Store implements BoardValueStore {
    value: BoardValue = emptyBoardValue

    get(): BoardValue {
        return this.value
    }
    set(value: BoardValue): void {
        this.value = value
    }
    clear(): void {
        this.value = emptyBoardValue
    }
}
