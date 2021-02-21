import { BoardValue, emptyBoardValue } from "../../../kernel/data"
import { BoardValueStore } from "../../data"

export function standardBoardValueStore(): BoardValueStore {
    let store: BoardValue = emptyBoardValue
    return {
        get: () => store,
        set: (value) => {
            store = value
        },
    }
}
