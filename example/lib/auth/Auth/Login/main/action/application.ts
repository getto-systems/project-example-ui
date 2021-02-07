import { ApplicationActionConfig } from "../../../../common/application/infra"

import { secureScriptPath } from "../../../../common/application/impl/core"

import { ApplicationAction } from "../../../../common/application/action"

export function initApplicationAction(config: ApplicationActionConfig): ApplicationAction {
    return {
        secureScriptPath: secureScriptPath({ config: config.secureScriptPath }),
    }
}
