import { PasswordLoginClient, LoginResponse, loginSuccess, loginFailed } from "../../infra";

import { LoginID, NonceValue, ApiRoles } from "../../../credential/data";
import { Password } from "../../../password/data";

export function initSimulatePasswordLoginClient(targetLoginID: LoginID, targetPassword: Password, nonce: NonceValue, roles: ApiRoles): PasswordLoginClient {
    return {
        login,
    }

    function login(loginID: LoginID, password: Password): Promise<LoginResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (loginID.loginID !== targetLoginID.loginID || password.password !== targetPassword.password) {
                    resolve(loginFailed({ type: "invalid-password-login" }));
                } else {
                    resolve(loginSuccess(nonce, roles));
                }
            }, 5 * 1000);
        });
    }
}
