import { env } from "../../../../y_static/env"

import { initFetchCheckClient } from "../../../nextVersion/impl/client/check/fetch"

import { find } from "../../../nextVersion/impl/core"

import { detectAppTarget } from "../impl/location"
import { initNextVersionResource } from "../impl/core"

import { initNextVersionComponent } from "../../nextVersion/impl"

import { MoveToNextVersionEntryPoint } from "../view"

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
