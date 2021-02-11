import { env } from "../../../../../../y_environment/env"

import { secureScriptPath } from "../../../../../common/application/impl/core"

import { ApplicationAction } from "../../../../../common/application/action"

export function initApplicationAction(): ApplicationAction {
    return {
        secureScriptPath: secureScriptPath({
            config: {
                secureServerHost: env.secureServerHost,
            },
        }),
    }
}
