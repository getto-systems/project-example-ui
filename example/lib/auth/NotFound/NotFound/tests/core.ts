import { NotFoundFactory, initNotFoundResource } from "../impl/core"

import { initCurrentVersionComponent } from "../../currentVersion/impl"

import { findCurrentVersion } from "../../../permission/currentVersion/impl/core"

import { NotFoundResource } from "../view"

import { CurrentVersionAction } from "../../../permission/currentVersion/action"

export function newNotFoundResource(currentVersion: string): NotFoundResource {
    const factory: NotFoundFactory = {
        actions: {
            currentVersion: initCurrentVersionAction(currentVersion),
        },
        components: {
            currentVersion: initCurrentVersionComponent,
        },
    }
    return initNotFoundResource(factory)
}

export function initCurrentVersionAction(currentVersion: string): CurrentVersionAction {
    return {
        findCurrentVersion: findCurrentVersion({
            currentVersion,
        }),
    }
}
