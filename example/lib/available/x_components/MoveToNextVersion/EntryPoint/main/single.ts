import { env } from "../../../../../y_environment/env"

import { ApiAvailableCheck, initApiAvailableCheck } from "../../../../../z_external/api/available/check"

import { delayed } from "../../../../../z_infra/delayed/core"
import { find } from "../../../../nextVersion/impl/core"

import { detectAppTarget } from "../impl/location"
import { initNextVersionResource } from "../impl/core"

import { initNextVersionComponent } from "../../nextVersion/impl"

import { MoveToNextVersionEntryPoint } from "../entryPoint"
import { initCheckConnectRemoteAccess } from "../../../../nextVersion/impl/remote/check/connect"

export function newMoveToNextVersionAsSingle(): MoveToNextVersionEntryPoint {
    const currentURL = new URL(location.toString())

    const api = {
        available: {
            check: initApiAvailableCheck(),
        },
    }

    const factory = {
        actions: {
            nextVersion: initNextVersionAction(api.available.check),
        },
        components: {
            nextVersion: initNextVersionComponent,
        },
    }
    const locationInfo = {
        nextVersion: {
            getAppTarget: () => detectAppTarget(env.version, currentURL),
        },
    }
    const resource = initNextVersionResource(factory, locationInfo)
    return {
        resource,
        terminate: () => {
            resource.nextVersion.terminate()
        },
    }
}

function initNextVersionAction(check: ApiAvailableCheck) {
    return {
        find: find({
            config: {
                delay: { delay_millisecond: 300 },
            },
            check: initCheckConnectRemoteAccess(check),
            delayed,
        }),
    }
}
