import { initLoadApplicationWorkerComponent } from "../../../auth/component/load_application/impl"

import { LoadApplicationComponent } from "../../../auth/component/load_application/component"

export function newLoadApplicationComponent(): LoadApplicationComponent {
    return initLoadApplicationWorkerComponent(
        () => new Worker("./auth/load_application.js"),
    )
}
