import { PasswordLoginAction } from "./action";
import { Login, loginSuccess, loginFailed } from "../credential/data";
import { LoginID, Password } from "./data";
import { Infra } from "./infra";

export function passwordLoginAction(infra: Infra): PasswordLoginAction {
    return async (loginID: LoginID, password: Password): Promise<Login> => {
        const credential = await infra.passwordLoginClient.login(loginID, password);
        if (credential.authorized) {
            return loginSuccess(credential.nonce, credential.roles);
        }

        return loginFailed(credential.err);
    }
}
