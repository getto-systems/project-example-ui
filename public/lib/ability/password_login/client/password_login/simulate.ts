import { PasswordLoginClient, LoginResponse, loginSuccess, loginFailed } from "../../infra";

import { LoginID, NonceValue, ApiRoles } from "../../../credential/data";
import { Password } from "../../../password/data";

export function initSimulatePasswordLoginClient(
    targetLoginID: LoginID,
    targetPassword: Password,
    returnNonce: NonceValue,
    returnRoles: ApiRoles,
): PasswordLoginClient {
    return new SimulatePasswordLoginClient(targetLoginID, targetPassword, returnNonce, returnRoles);
}

class SimulatePasswordLoginClient implements PasswordLoginClient {
    targetLoginID: LoginID
    targetPassword: Password

    returnNonce: NonceValue
    returnRoles: ApiRoles

    constructor(targetLoginID: LoginID, targetPassword: Password, returnNonce: NonceValue, returnRoles: ApiRoles) {
        this.targetLoginID = targetLoginID;
        this.targetPassword = targetPassword;
        this.returnNonce = returnNonce;
        this.returnRoles = returnRoles;
    }

    login(loginID: LoginID, password: Password): Promise<LoginResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (loginID.loginID !== this.targetLoginID.loginID || password.password !== this.targetPassword.password) {
                    resolve(loginFailed({ type: "invalid-password-login" }));
                } else {
                    resolve(loginSuccess(this.returnNonce, this.returnRoles));
                }
            }, 5 * 1000);
        });
    }
}
