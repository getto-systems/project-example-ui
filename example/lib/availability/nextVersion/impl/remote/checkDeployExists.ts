import { newApiCheckDeployExists } from "../../../../z_external/api/availability/checkDeployExists";
import { wrapRemoteError } from "../../../../z_vendor/getto-application/infra/remote/helper";
import { CheckDeployExistsRemote } from "../../infra";

export function newCheckDeployExistsRemote(): CheckDeployExistsRemote {
    return wrapRemoteError(newApiCheckDeployExists(), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
