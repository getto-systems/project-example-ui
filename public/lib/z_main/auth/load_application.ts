import { env } from "../../y_static/env"

import { initLoadApplicationComponent, initLoadApplicationComponentEventHandler } from "../../auth/load_application/impl/core"

import { initSimulateCheckClient } from "../../script/impl/client/check/simulate"
import { initScriptAction } from "../../script/impl/core"

import { CheckClient } from "../../script/infra"

import { LoadApplicationComponentAction, LoadApplicationComponentEventHandler } from "../../auth/load_application/action"

import { ScriptAction } from "../../script/action"

import { LoadApplicationComponent } from "../../auth/load_application/data"

export function newLoadApplicationComponent(currentLocation: Readonly<Location>): LoadApplicationComponent {
    const handler = initLoadApplicationComponentEventHandler()
    return initLoadApplicationComponent(
        handler,
        newLoadApplicationComponentAction(handler),
        currentLocation,
    )
}
function newLoadApplicationComponentAction(handler: LoadApplicationComponentEventHandler): LoadApplicationComponentAction {
    return {
        script: newScriptAction(handler),
    }
}

function newScriptAction(handler: LoadApplicationComponentEventHandler): ScriptAction {
    return initScriptAction(handler, {
        hostConfig: newHostConfig(),
        checkClient: newCheckClient(),
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
