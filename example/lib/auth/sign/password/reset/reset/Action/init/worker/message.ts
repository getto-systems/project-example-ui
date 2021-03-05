import { WorkerProxySpec } from "../../../../../../../../z_vendor/getto-application/action/worker/message"

import { ConvertLocationResult } from "../../../../../../../../z_vendor/getto-application/location/detecter"

import { ResetPasswordEvent } from "../../../event"

import { ConvertBoardResult } from "../../../../../../../../z_vendor/getto-application/board/kernel/data"
import { ResetPasswordFields } from "../../../data"
import { ResetToken } from "../../../../kernel/data"

export type ResetPasswordProxyMaterial = Readonly<{
    reset: Reset["method"]
}>
export type ResetPasswordProxyMessage = Reset["message"]
export type ResetPasswordProxyResponse = Reset["response"]

type Reset = WorkerProxySpec<
    "reset",
    Readonly<{
        fields: ConvertBoardResult<ResetPasswordFields>
        resetToken: ConvertLocationResult<ResetToken>
    }>,
    ResetPasswordEvent
>
