import { ClearBoardValueMethod, SetBoardValueMethod } from "./method"

import { InputBoardValueInfra } from "./infra"

interface SetValue {
    (infra: InputBoardValueInfra): SetBoardValueMethod
}
export const setBoardValue: SetValue = (infra) => (value, post) => {
    const { store } = infra
    store.set(value)
    post(store.get())
}

interface Clear {
    (infra: InputBoardValueInfra): ClearBoardValueMethod
}
export const clearBoardValue: Clear = (infra) => (post) => {
    const { store } = infra
    store.clear()
    post(store.get())
}
