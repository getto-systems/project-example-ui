import { delayed } from "../../../../../z_infra/delayed/core"
import { delaySecond } from "../../../../../z_infra/time/infra"
import { initResetSimulateRemoteAccess } from "./infra/remote/reset/simulate"

import { initRegisterActionPod } from "./impl"

import { RegisterActionPod } from "./action"

import { markAuthAt, markTicketNonce } from "../../../authCredential/common/data"
import { markApiNonce, markApiRoles } from "../../../../../common/auth/apiCredential/data"

export function newRegisterActionPod(): RegisterActionPod {
    return initRegisterActionPod({
        reset: resetRemoteAccess(),
        config: {
            delay: delaySecond(1),
        },
        delayed,
    })

    // TODO connect を用意
    function resetRemoteAccess() {
        const targetLoginID = "loginID"
        const targetResetToken = "reset-token"

        return initResetSimulateRemoteAccess(
            ({ resetToken, fields: { loginID } }) => {
                if (resetToken !== targetResetToken) {
                    return { success: false, err: { type: "invalid-password-reset" } }
                }
                if (loginID !== targetLoginID) {
                    return { success: false, err: { type: "invalid-password-reset" } }
                }
                return {
                    success: true,
                    value: {
                        auth: {
                            ticketNonce: markTicketNonce("ticket-nonce"),
                            authAt: markAuthAt(new Date()),
                        },
                        api: {
                            apiNonce: markApiNonce("api-nonce"),
                            apiRoles: markApiRoles(["admin", "development-document"]),
                        },
                    },
                }
            },
            { wait_millisecond: 0 }
        )
    }
}
