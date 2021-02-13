import { NotifyComponent } from "./Notify/component"

import { NotifyAction } from "../../error/notify/action"

export type NotifyErrorResource = Readonly<{
    notify: NotifyComponent
}>

export type NotifyErrorBackgroundAction = Readonly<{
    notify: NotifyAction
}>
