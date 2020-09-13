import { initLoadApplicationComponent, initLoadApplicationComponentEventHandler } from "../../auth/load_application/impl/core"

import { initSimulateCheckClient } from "../../script/impl/client/check/simulate"
import { env } from "../../y_static/env"

import { initScriptAction } from "../../script/impl/core"

import { CheckClient } from "../../script/infra"

import {
    LoadApplicationComponent,
    LoadApplicationComponentAction,
    LoadApplicationComponentEventHandler,
} from "../../auth/load_application/action"

import { ScriptAction } from "../../script/action"

export function newComponent(currentLocation: Readonly<Location>): LoadApplicationComponent {
    const handler = initLoadApplicationComponentEventHandler()
    return initLoadApplicationComponent(
        handler,
        newComponentAction(handler),
        currentLocation,
    )
}
function newComponentAction(handler: LoadApplicationComponentEventHandler): LoadApplicationComponentAction {
    return {
        script: newScriptAction(handler),
    }
}

function newScriptAction(handler: LoadApplicationComponentEventHandler): ScriptAction {
    return initScriptAction(handler, {
        config: {
            secureServerHost: env.secureServerHost,
        },
        checkClient: newCheckClient(),
    })
}

function newCheckClient(): CheckClient {
    // TODO ちゃんとした実装を用意
    return initSimulateCheckClient({ success: true })
}
