import { ToggleMenuExpandEvent } from "./event"

import { MenuCategoryPath } from "../kernel/data"
import { LoadMenuLocationDetecter } from "../kernel/method"

export interface ToggleMenuExpandPod {
    (detecter: LoadMenuLocationDetecter): ToggleMenuExpandMethod
}
export interface ToggleMenuExpandMethod {
    (path: MenuCategoryPath, post: Post<ToggleMenuExpandEvent>): void
}

interface Post<T> {
    (event: T): void
}
