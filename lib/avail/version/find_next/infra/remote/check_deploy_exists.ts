import { newApi_CheckDeployExists } from "../../../../../z_external/api/avail/check_deploy_exists"

import { convertRemote } from "../../../../../z_vendor/getto-application/infra/remote/helper"

import { CheckDeployExistsRemotePod } from "../../infra"

export function newCheckDeployExistsRemote(): CheckDeployExistsRemotePod {
    return convertRemote(newApi_CheckDeployExists())
}
