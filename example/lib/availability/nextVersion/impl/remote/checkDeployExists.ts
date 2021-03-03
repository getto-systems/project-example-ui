import { newApiCheckDeployExists } from "../../../../z_external/api/availability/checkDeployExists";
import { wrapRemote } from "../../../../z_vendor/getto-application/infra/remote/helper";
import { CheckDeployExistsRemotePod } from "../../infra";

export function newCheckDeployExistsRemote(): CheckDeployExistsRemotePod {
    return wrapRemote(newApiCheckDeployExists(), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
