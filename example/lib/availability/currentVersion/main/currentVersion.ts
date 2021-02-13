import { env } from "../../../y_environment/env"

import { findCurrentVersion } from "../impl/core"

import { FindCurrentVersionAction } from "../action"

export function initCurrentVersionAction(): FindCurrentVersionAction {
    return {
        findCurrentVersion: findCurrentVersion({
            currentVersion: env.version,
        }),
    }
}
