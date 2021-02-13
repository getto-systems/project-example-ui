import { NotifyComponent } from "./Notify/component"

import { NotifyAction } from "../../notify/action"

export type NotifyErrorResource = Readonly<{
    notify: NotifyComponent
}>

export type NotifyErrorBackgroundAction = Readonly<{
    notify: NotifyAction
}>
