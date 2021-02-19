import { HidePasswordDisplayBoardMethod, ShowPasswordDisplayBoardMethod } from "./method"

export const showPasswordDisplayBoard: ShowPasswordDisplayBoardMethod = (post) => {
    post({ visible: true })
}
export const hidePasswordDisplayBoard: HidePasswordDisplayBoardMethod = (post) => {
    post({ visible: false })
}
