import { workerBackgroundOutsideFeature } from "../../../outside_feature/worker"

import { newSignWorkerBackground } from "../../../../auth/action_sign/init/worker/background"

newSignWorkerBackground(workerBackgroundOutsideFeature())
