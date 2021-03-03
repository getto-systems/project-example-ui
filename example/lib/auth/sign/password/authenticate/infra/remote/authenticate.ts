import { env } from "../../../../../../y_environment/env";
import { newApi_AuthenticatePassword } from "../../../../../../z_external/api/auth/sign/password/authenticate";
import { wrapRemote } from "../../../../../../z_vendor/getto-application/infra/remote/helper";
import { AuthenticateRemotePod } from "../../infra";

export function newAuthenticateRemote(): AuthenticateRemotePod {
    return wrapRemote(newApi_AuthenticatePassword(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}