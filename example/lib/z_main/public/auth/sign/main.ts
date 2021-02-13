import { render, h } from "preact"

import { newLoginAsWorkerForeground } from "../../../../auth/z_EntryPoint/Sign/main/worker/foreground"

import { EntryPoint } from "../../../../x_preact/auth/Sign/EntryPoint"

render(h(EntryPoint, newLoginAsWorkerForeground()), document.body)
