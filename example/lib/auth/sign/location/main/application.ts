import { env } from "../../../../y_environment/env"

import { secureScriptPath } from "../impl/core"

import { ApplicationAction } from "../action"

export function initApplicationAction(): ApplicationAction {
    return {
        secureScriptPath: secureScriptPath({
            config: {
                secureServerHost: env.secureServerHost,
            },
        }),
    }
}
