import { StorageError } from "../../../common/storage/data"
import { Breadcrumb, LoadMenuError, Menu } from "./data"

export type LoadBreadcrumbListEvent = Readonly<{ type: "succeed-to-load"; breadcrumb: Breadcrumb }>

export type LoadMenuEvent =
    | Readonly<{ type: "succeed-to-instant-load"; menu: Menu }>
    | Readonly<{ type: "succeed-to-load"; menu: Menu }>
    | Readonly<{ type: "failed-to-load"; menu: Menu; err: LoadMenuError }>

export type ToggleMenuExpandEvent =
    | Readonly<{ type: "succeed-to-toggle"; menu: Menu }>
    | Readonly<{ type: "failed-to-toggle"; menu: Menu; err: StorageError }>
