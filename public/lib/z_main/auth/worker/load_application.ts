import { initLoadApplicationWorkerComponent } from "../../../auth/load_application/impl/core"

import { LoadApplicationComponent } from "../../../auth/load_application/action"

export function newLoadApplicationComponent(): LoadApplicationComponent {
    return initLoadApplicationWorkerComponent(
        () => new Worker("./auth/load_application.js"),
    )
}
