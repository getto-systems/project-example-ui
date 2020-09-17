import { PasswordResetClient, ResetResponse, resetSuccess, resetFailed } from "../../../infra"

import { AuthCredential } from "../../../../credential/data"
import { LoginID } from "../../../../login_id/data"
import { Password } from "../../../../password/data"
import { ResetToken } from "../../../data"

export function initSimulatePasswordResetClient(targetLoginID: LoginID, returnAuthCredential: AuthCredential): PasswordResetClient {
    return new SimulatePasswordResetClient(targetLoginID, returnAuthCredential)
}

class SimulatePasswordResetClient implements PasswordResetClient {
    targetLoginID: LoginID

    returnAuthCredential: AuthCredential

    constructor(targetLoginID: LoginID, returnAuthCredential: AuthCredential) {
        this.targetLoginID = targetLoginID

        this.returnAuthCredential = returnAuthCredential
    }

    reset(token: ResetToken, loginID: LoginID, password: Password): Promise<ResetResponse> {
        return new Promise((resolve) => {
            ((simulate) => {
                setTimeout(() => {
                    resolve(simulate(token, loginID, password))
                }, 5 * 1000)
            })(this.resetSimulate)
        })
    }
    resetSimulate(token: ResetToken, loginID: LoginID, _password: Password): ResetResponse {
        if (loginID.loginID !== this.targetLoginID.loginID) {
            return resetFailed({ type: "invalid-password-reset" })
        } else {
            return resetSuccess(this.returnAuthCredential)
        }
    }
}
