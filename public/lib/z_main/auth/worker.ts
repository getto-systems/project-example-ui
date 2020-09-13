import { initLoadApplicationWorkerComponent } from "../../auth/load_application/impl/core"

import { LoadApplicationComponent } from "../../auth/load_application/action"

export class WorkerComponentLoader {
    initLoadApplicationComponent(): LoadApplicationComponent {
        return initLoadApplicationWorkerComponent(
            () => new Worker("./auth/load_application.js"),
        )
    }
}
