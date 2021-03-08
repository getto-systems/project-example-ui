import { ToggleMenuExpandEvent } from "./event"

import { Menu, MenuCategoryPath } from "../kernel/data"

export interface ToggleMenuExpandMethod {
    (menu: Menu, path: MenuCategoryPath, post: Post<ToggleMenuExpandEvent>): void
}

interface Post<T> {
    (event: T): void
}
