import { initValidateBoardStack } from "./infra/stack"

import { ValidateBoardInfra } from "./infra"

export function initValidateBoardInfra(): ValidateBoardInfra {
    return {
        stack: initValidateBoardStack(),
    }
}
