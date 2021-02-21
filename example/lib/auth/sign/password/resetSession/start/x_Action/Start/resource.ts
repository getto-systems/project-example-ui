import { StartPasswordResetSessionAction } from "./Core/action"
import { StartPasswordResetSessionFormAction } from "./Form/action"

export type StartPasswordResetSessionResource = StartPasswordResetSessionForegroundResource &
    StartPasswordResetSessionBackgroundResource

export type StartPasswordResetSessionForegroundResource = Readonly<{
    form: StartPasswordResetSessionFormAction
}>
export type StartPasswordResetSessionBackgroundResource = Readonly<{
    start: StartPasswordResetSessionAction
}>
