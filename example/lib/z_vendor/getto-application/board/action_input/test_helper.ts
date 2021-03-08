import { BoardValueStore } from "../input/infra"

import { BoardValue, emptyBoardValue } from "../kernel/data"

export function standardBoardValueStore(): BoardValueStore {
    let store: BoardValue = emptyBoardValue
    return {
        get: () => store,
        set: (value) => {
            store = value
        },
    }
}
