import { render, h } from "preact"

import { newAuthSignAsWorkerForeground } from "../main/worker/foreground"

import { EntryPoint } from "../x_preact/EntryPoint"

render(h(EntryPoint, newAuthSignAsWorkerForeground()), document.body)
