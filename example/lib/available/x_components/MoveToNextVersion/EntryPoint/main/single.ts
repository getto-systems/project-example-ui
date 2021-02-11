import { env } from "../../../../../y_environment/env"

import { initApiAvailableCheck } from "../../../../../z_external/api/available/check"

import { delayed } from "../../../../../z_infra/delayed/core"
import { find } from "../../../../nextVersion/impl/core"

import { detectAppTarget } from "../impl/location"
import { initNextVersionResource } from "../impl/core"

import { initNextVersionComponent } from "../../nextVersion/impl"

import { MoveToNextVersionEntryPoint } from "../entryPoint"
import { initCheckConnectRemoteAccess } from "../../../../nextVersion/impl/remote/check/connect"

export function newMoveToNextVersionAsSingle(): MoveToNextVersionEntryPoint {
    const currentURL = new URL(location.toString())

    const factory = {
        actions: {
            nextVersion: initNextVersionAction(),
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

function initNextVersionAction() {
    return {
        find: find({
            config: {
                delay: { delay_millisecond: 300 },
            },
            check: initCheckConnectRemoteAccess(initApiAvailableCheck()),
            delayed,
        }),
    }
}
