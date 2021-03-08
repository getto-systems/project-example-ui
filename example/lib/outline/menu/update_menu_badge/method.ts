import { Menu } from "../kernel/data";
import { UpdateMenuBadgeEvent } from "./event"

export interface UpdateMenuBadgeMethod {
    (menu: Menu, post: Post<UpdateMenuBadgeEvent>): void
}

interface Post<E> {
    (event: E): void
}
