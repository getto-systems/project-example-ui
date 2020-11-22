import { LoadBreadcrumbEvent, LoadMenuEvent } from "./data"

export interface LoadBreadcrumbAction {
    (post: Post<LoadBreadcrumbEvent>): void
}

export interface LoadMenuAction {
    (post: Post<LoadMenuEvent>): void
}

interface Post<T> {
    (event: T): void
}
