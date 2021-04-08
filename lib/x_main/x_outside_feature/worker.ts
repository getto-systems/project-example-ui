import { newWorker } from "../../z_vendor/getto-application/action/worker/init"

import {
    commonOutsideFeature,
    CommonOutsideFeature,
    foregroundOutsideFeature,
    ForegroundOutsideFeature,
} from "./common"

import { WorkerOutsideFeature } from "../../z_vendor/getto-application/action/worker/infra"

type WorkerForegroundOutsideFeature = ForegroundOutsideFeature & WorkerOutsideFeature
type WorkerBackgroundOutsideFeature = CommonOutsideFeature & WorkerOutsideFeature

export function workerForegroundOutsideFeature(): WorkerForegroundOutsideFeature {
    return {
        ...foregroundOutsideFeature(),
        worker: newWorker({
            webDocument: document,
        }),
    }
}
export function workerBackgroundOutsideFeature(): WorkerBackgroundOutsideFeature {
    return {
        ...commonOutsideFeature(),
        worker: (self as unknown) as Worker,
    }
}
