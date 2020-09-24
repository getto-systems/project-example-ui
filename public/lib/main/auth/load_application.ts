import { env } from "../../y_static/env"

import { initLoadApplicationComponent } from "../../auth/load_application/impl"

import { initScriptAction } from "../../script/impl/core"

import { LoadApplicationComponent } from "../../auth/load_application/component"

export function newLoadApplicationComponent(): LoadApplicationComponent {
    return initLoadApplicationComponent({
        script: initScriptAction({
            hostConfig: newHostConfig(),
        }),
    })
}

function newHostConfig(): HostConfig {
    return {
        secureServerHost: env.secureServerHost,
    }
}

type HostConfig = {
    secureServerHost: string,
}
