import { env } from "../../../../y_environment/env"

import { newLocationDetecter } from "../../../../z_vendor/getto-application/location/init"

import { newCheckDeployExistsRemote } from "../infra/remote/check_deploy_exists"

import { detectApplicationTargetPath } from "./core"

import { FindNextVersionInfra } from "../infra"

import { FindNextVersionLocationDetecter } from "../method"

export function newFindNextVersionLocationDetecter(
    currentLocation: Location,
): FindNextVersionLocationDetecter {
    return newLocationDetecter(currentLocation, detectApplicationTargetPath({ version: env.version }))
}

export function newFindNextVersionInfra(): FindNextVersionInfra {
    return {
        version: env.version,
        check: newCheckDeployExistsRemote(),
        config: {
            takeLongtimeThreshold: { delay_millisecond: 300 },
        },
    }
}
