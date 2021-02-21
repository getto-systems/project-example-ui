import { HidePasswordDisplayMethod, ShowPasswordDisplayMethod } from "./method"

export const showPasswordDisplay: ShowPasswordDisplayMethod = (post) => {
    post({ visible: true })
}
export const hidePasswordDisplay: HidePasswordDisplayMethod = (post) => {
    post({ visible: false })
}
