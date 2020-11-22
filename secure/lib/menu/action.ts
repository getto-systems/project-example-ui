import { LoadBreadcrumbEvent, LoadMenuEvent } from "./data"

export interface LoadBreadcrumb {
    (): LoadBreadcrumbAction
}
export interface LoadBreadcrumbAction {
    (post: Post<LoadBreadcrumbEvent>): void
}

export interface LoadMenu {
    (collector: LoadMenuCollector): LoadMenuAction
}
export interface LoadMenuAction {
    (post: Post<LoadMenuEvent>): void
}

export interface LoadMenuCollector {
    getApiCredential(): Promise<ApiCredential>
    getSearchParam(): Promise<SearchParam>
}

// TODO api credential の取得部分に移動
export type ApiCredential = { ApiCredential: never }

// TODO どう実装するのがいいのか考えないと
export type SearchParam = { SearchParam: never }

interface Post<T> {
    (event: T): void
}
