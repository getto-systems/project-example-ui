import { PasswordLoginClient, LoginResponse, loginSuccess, loginFailed } from "../../../infra"

import { AuthCredential } from "../../../../credential/data"
import { LoginID } from "../../../../login_id/data"
import { Password } from "../../../../password/data"

export function initSimulatePasswordLoginClient(
    targetLoginID: LoginID,
    targetPassword: Password,
    returnAuthCredential: AuthCredential,
): PasswordLoginClient {
    return new SimulatePasswordLoginClient(targetLoginID, targetPassword, returnAuthCredential)
}

class SimulatePasswordLoginClient implements PasswordLoginClient {
    targetLoginID: LoginID
    targetPassword: Password

    returnAuthCredential: AuthCredential

    constructor(targetLoginID: LoginID, targetPassword: Password, returnAuthCredential: AuthCredential) {
        this.targetLoginID = targetLoginID
        this.targetPassword = targetPassword
        this.returnAuthCredential = returnAuthCredential
    }

    login(loginID: LoginID, password: Password): Promise<LoginResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (loginID !== this.targetLoginID || password.password !== this.targetPassword.password) {
                    resolve(loginFailed({ type: "invalid-password-login" }))
                } else {
                    resolve(loginSuccess(this.returnAuthCredential))
                }
            }, 5 * 1000)
        })
    }
}
