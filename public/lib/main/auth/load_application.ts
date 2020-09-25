import { env } from "../../y_static/env"

import { initLoadApplicationComponent } from "../../auth/component/load_application/impl"

import { initScriptAction } from "../../script/impl/core"

import { LoadApplicationComponent } from "../../auth/component/load_application"

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
