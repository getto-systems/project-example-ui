import { secureScriptPath } from "../impl/core"

import { ApplicationActionConfig } from "../infra"

import { ApplicationAction } from "../action"

export function initTestApplicationAction(config: ApplicationActionConfig): ApplicationAction {
    return {
        secureScriptPath: secureScriptPath({ config: config.secureScriptPath }),
    }
}
