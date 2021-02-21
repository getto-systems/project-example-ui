import { HidePasswordDisplayBoardMethod, ShowPasswordDisplayBoardMethod } from "./method"

export const showPasswordDisplayBoard: ShowPasswordDisplayBoardMethod = (password, post) => {
    post({ visible: true, password })
}
export const hidePasswordDisplayBoard: HidePasswordDisplayBoardMethod = (post) => {
    post({ visible: false })
}
