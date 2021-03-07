import { NotifyComponent } from "./Notify/component"

import { NotifyUnexpectedErrorAction } from "../../unexpectedError/Action/action"

export type ErrorResource = Readonly<{
    notify: NotifyComponent
}>

export type ErrorForegroundAction = Readonly<{
    error: NotifyUnexpectedErrorAction
}>
