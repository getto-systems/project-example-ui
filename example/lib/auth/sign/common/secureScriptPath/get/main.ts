import { env } from "../../../../../y_environment/env"

import { GetSecureScriptPathInfra } from "./infra"

export function newGetSecureScriptPathInfra(): GetSecureScriptPathInfra {
    return {
        config: {
            secureServerURL: env.secureServerURL,
        },
    }
}
