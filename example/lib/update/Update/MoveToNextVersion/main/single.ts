import { env } from "../../../../y_static/env"

import { initFetchCheckClient } from "../../../next_version/impl/client/check/fetch"

import { find } from "../../../next_version/impl/core"

import { detectAppTarget } from "../impl/location"
import { initNextVersionResource } from "../impl/core"

import { initNextVersion } from "../../next_version/impl"

import { MoveToNextVersionEntryPoint } from "../view"

export function newMoveToNextVersionAsSingle(): MoveToNextVersionEntryPoint {
    const currentURL = new URL(location.toString())

    const factory = {
        actions: {
            nextVersion: initNextVersionAction(),
        },
        components: {
            nextVersion: initNextVersion,
        },
    }
    const collector = {
        nextVersion: {
            getAppTarget: () => detectAppTarget(env.version, currentURL),
        },
    }
    return {
        resource: initNextVersionResource(factory, collector),
        terminate: () => {
            // worker とインターフェイスを合わせるために必要
        },
    }
}

function initNextVersionAction() {
    return {
        find: find({
            client: initFetchCheckClient(),
        }),
    }
}
