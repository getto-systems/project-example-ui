import { initLoadApplicationWorkerComponent } from "../../../auth/load_application/impl"

import { LoadApplicationComponent } from "../../../auth/load_application/component"

export function newLoadApplicationComponent(): LoadApplicationComponent {
    return initLoadApplicationWorkerComponent(
        () => new Worker("./auth/load_application.js"),
    )
}
