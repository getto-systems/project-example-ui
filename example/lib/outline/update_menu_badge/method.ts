import { LoadMenuLocationDetecter } from "../kernel/method";
import { UpdateMenuBadgeEvent } from "./event"

export interface UpdateMenuBadgePod {
    (detecter: LoadMenuLocationDetecter): UpdateMenuBadgeMethod
}
export interface UpdateMenuBadgeMethod {
    (post: Post<UpdateMenuBadgeEvent>): void
}

interface Post<E> {
    (event: E): void
}
