import { env } from "../../y_static/env"

import { initLoadApplicationComponent } from "../../auth/component/load_application/impl"

import { initApplicationAction } from "../../application/impl/core"

import { LoadApplicationComponent } from "../../auth/component/load_application/component"

export function newLoadApplicationComponent(): LoadApplicationComponent {
    return initLoadApplicationComponent({
        application: initApplicationAction({
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
