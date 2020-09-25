import { PasswordResetParam } from "./component"

import { ResetToken } from "../../../password_reset/data"

export function packPasswordResetParam(resetToken: ResetToken): PasswordResetParam {
    return { resetToken } as PasswordResetParam & Param
}

export function unpackPasswordResetParam(param: PasswordResetParam): Param {
    return param as unknown as Param
}

type Param = {
    resetToken: ResetToken
}
