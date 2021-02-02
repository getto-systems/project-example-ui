import { env } from "../../../../y_static/env"

import { initFetchCheckClient } from "../../../nextVersion/impl/remote/check/fetch"

import { delayed } from "../../../../z_infra/delayed/core"
import { find } from "../../../nextVersion/impl/core"

import { detectAppTarget } from "../impl/location"
import { initNextVersionResource } from "../impl/core"

import { initNextVersionComponent } from "../../nextVersion/impl"

import { MoveToNextVersionEntryPoint } from "../entryPoint"

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
    const collector = {
        nextVersion: {
            getAppTarget: () => detectAppTarget(env.version, currentURL),
        },
    }
    const resource = initNextVersionResource(factory, collector)
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
            check: initFetchCheckClient(),
            delayed,
        }),
    }
}
