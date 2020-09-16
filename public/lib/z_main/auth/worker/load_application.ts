import { initLoadApplicationWorkerComponent } from "../../../auth/load_application/core"

import { LoadApplicationComponent } from "../../../auth/load_application/data"

export function newLoadApplicationComponent(): LoadApplicationComponent {
    return initLoadApplicationWorkerComponent(
        () => new Worker("./auth/load_application.js"),
    )
}
