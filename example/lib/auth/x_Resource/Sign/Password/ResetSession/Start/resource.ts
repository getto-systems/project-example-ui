import { StartPasswordResetSessionAction } from "../../../../../sign/x_Action/Password/ResetSession/Start/Core/action"
import { StartPasswordResetSessionFormAction } from "../../../../../sign/x_Action/Password/ResetSession/Start/Form/action"

export type StartPasswordResetSessionResource = StartPasswordResetSessionForegroundResource &
    StartPasswordResetSessionBackgroundResource

export type StartPasswordResetSessionForegroundResource = Readonly<{
    form: StartPasswordResetSessionFormAction
}>
export type StartPasswordResetSessionBackgroundResource = Readonly<{
    start: StartPasswordResetSessionAction
}>
