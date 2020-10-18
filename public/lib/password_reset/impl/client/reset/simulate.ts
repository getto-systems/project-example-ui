import { PasswordResetClient, ResetResponse, resetSuccess, resetFailed } from "../../../infra"

import { ResetToken, ResetFields } from "../../../data"

import { AuthCredential } from "../../../../credential/data"
import { LoginID } from "../../../../login_id/data"
import { Password } from "../../../../password/data"

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

    reset(token: ResetToken, { loginID, password }: ResetFields): Promise<ResetResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.resetSimulate(token, loginID, password))
            }, 0.3 * 1000)
        })
    }
    resetSimulate(token: ResetToken, loginID: LoginID, _password: Password): ResetResponse {
        if (loginID !== this.targetLoginID) {
            return resetFailed({ type: "invalid-password-reset" })
        } else {
            return resetSuccess(this.returnAuthCredential)
        }
    }
}
