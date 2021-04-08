import { render, h } from "preact"

import { newSignWorkerForeground } from "../../../../auth/action_sign/init/worker/foreground"

import { SignEntry } from "../../../../auth/action_sign/x_preact/sign"
import { workerForegroundOutsideFeature } from "../../../x_outside_feature/worker"

render(h(SignEntry, newSignWorkerForeground(workerForegroundOutsideFeature())), document.body)
