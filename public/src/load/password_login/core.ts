import { PasswordLoginAction } from "./action";
import { Login, loginSuccess, loginFailed } from "../credential/data";
import { Password } from "./data";
import { Infra } from "./infra";

export function passwordLoginAction(infra: Infra): PasswordLoginAction {
    return async (password: Password): Promise<Login> => {
        const credential = await infra.passwordLoginClient.login(password);
        if (credential.authorized) {
            return loginSuccess(credential.nonce, credential.roles);
        }

        return loginFailed(credential.err);
    }
}
