import { NotifyComponent } from "./Notify/component"

import { UnexpectedErrorAction } from "../../unexpectedError/action"

export type ErrorResource = Readonly<{
    notify: NotifyComponent
}>

export type ErrorForegroundAction = Readonly<{
    error: UnexpectedErrorAction
}>
