import { env } from "../../../../y_static/env"

import { NotFoundFactory, initNotFoundResource } from "../impl/core"

import { initCurrentVersionComponent } from "../../currentVersion/impl"

import { findCurrentVersion } from "../../../permission/currentVersion/impl/core"

import { NotFoundEntryPoint } from "../view"

import { CurrentVersionAction } from "../../../permission/currentVersion/action"

export function newNotFoundAsSingle(): NotFoundEntryPoint {
    const factory: NotFoundFactory = {
        actions: {
            currentVersion: initCurrentVersionAction(),
        },
        components: {
            currentVersion: initCurrentVersionComponent,
        },
    }
    return {
        resource: initNotFoundResource(factory),
        terminate: () => {
            // worker とインターフェイスを合わせるために必要
        },
    }
}

function initCurrentVersionAction(): CurrentVersionAction {
    return {
        findCurrentVersion: findCurrentVersion({
            currentVersion: env.version,
        }),
    }
}
