import { env } from "../../y_static/env"

import { initLoadApplicationComponent } from "../../auth/load_application/impl"

import { initFetchCheckClient } from "../../script/impl/client/check/fetch"
import { initScriptAction } from "../../script/impl/core"

import { CheckClient } from "../../script/infra"

import { LoadApplicationComponent } from "../../auth/load_application/component"

export function newLoadApplicationComponent(): LoadApplicationComponent {
    return initLoadApplicationComponent({
        script: initScriptAction({
            hostConfig: newHostConfig(),
            checkClient: newCheckClient(),
        }),
    })
}

function newCheckClient(): CheckClient {
    return initFetchCheckClient()
}

function newHostConfig(): HostConfig {
    return {
        secureServerHost: env.secureServerHost,
    }
}

type HostConfig = {
    secureServerHost: string,
}
