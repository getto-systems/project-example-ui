import { env } from "../../../../../../../y_environment/env"
import { newApi_Renew } from "../../../../../../../z_external/api/auth/sign/renew"
import { wrapRemote } from "../../../../../../../z_vendor/getto-application/infra/remote/helper"
import { RenewAuthInfoRemotePod } from "../../../kernel/infra"

export function newRenewAuthInfoRemote(): RenewAuthInfoRemotePod {
    return wrapRemote(newApi_Renew(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
