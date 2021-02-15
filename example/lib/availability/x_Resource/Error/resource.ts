import { NotifyComponent } from "./Notify/component"

import { ErrorAction } from "../../error/action"

export type ErrorResource = Readonly<{
    notify: NotifyComponent
}>

export type ErrorForegroundAction = Readonly<{
    error: ErrorAction
}>
