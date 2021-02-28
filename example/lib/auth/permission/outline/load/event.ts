import { StorageError } from "../../../../z_vendor/getto-application/infra/storage/data"
import {
    OutlineBreadcrumb,
    LoadOutlineMenuBadgeError,
    OutlineMenu,
    FetchAuthzRepositoryError,
} from "./data"

export type LoadOutlineBreadcrumbListEvent = Readonly<{
    type: "succeed-to-load"
    breadcrumb: OutlineBreadcrumb
}>

export type LoadOutlineMenuEvent =
    | Readonly<{ type: "succeed-to-instant-load"; menu: OutlineMenu }>
    | Readonly<{ type: "succeed-to-load"; menu: OutlineMenu }>
    | Readonly<{ type: "failed-to-fetch-repository"; err: FetchAuthzRepositoryError }>
    | Readonly<{ type: "failed-to-load"; menu: OutlineMenu; err: LoadOutlineMenuBadgeError }>

export type ToggleOutlineMenuExpandEvent =
    | Readonly<{ type: "succeed-to-toggle"; menu: OutlineMenu }>
    | Readonly<{ type: "failed-to-toggle"; menu: OutlineMenu; err: StorageError }>
