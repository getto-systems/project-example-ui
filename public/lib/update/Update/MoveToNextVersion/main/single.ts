import { env } from "../../../../y_static/env"

import { initCheckClient } from "../../../next_version/impl/client/check/fetch"
import { find } from "../../../next_version/impl/core"

import { initNextVersion } from "../../next_version/impl"

import { detectAppTarget } from "../impl/location"

import { MoveToNextVersionFactory } from "../view"

import { initMoveToNextVersionResource } from "../impl/core"

export function newMoveToNextVersionAsSingle(): MoveToNextVersionFactory {
    const currentLocation = location

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
            getAppTarget: () => detectAppTarget(env.version, currentLocation),
        },
    }
    return () => {
        return {
            components: initMoveToNextVersionResource(factory, collector),
            terminate: () => {
                // worker とインターフェイスを合わせるために必要
            },
        }
    }
}

function initNextVersionAction() {
    return {
        find: find({
            client: initCheckClient(),
        }),
    }
}
