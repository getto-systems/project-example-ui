import { env } from "../../y_static/env"

import { initLoadApplicationComponent } from "../../auth/load_application/impl"

import { initSimulateCheckClient } from "../../script/impl/client/check/simulate"
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
    // TODO ちゃんとした実装を用意
    return initSimulateCheckClient({ success: true })
}

function newHostConfig(): HostConfig {
    return {
        secureServerHost: env.secureServerHost,
    }
}

type HostConfig = {
    secureServerHost: string,
}
