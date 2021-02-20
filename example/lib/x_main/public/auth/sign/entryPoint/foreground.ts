import { render, h } from "preact"

import { newLoginAsWorkerForeground } from "../main/worker/foreground"

import { EntryPoint } from "../../../../../x_preact/auth/Sign/EntryPoint"

render(h(EntryPoint, newLoginAsWorkerForeground()), document.body)
