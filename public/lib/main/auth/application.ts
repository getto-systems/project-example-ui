import { env } from "../../y_static/env"

import { initApplicationComponent } from "../../auth/component/application/impl"

import { initApplicationAction } from "../../application/impl/core"

import { ApplicationComponent } from "../../auth/component/application/component"

export function newApplicationComponent(): ApplicationComponent {
    return initApplicationComponent({
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
