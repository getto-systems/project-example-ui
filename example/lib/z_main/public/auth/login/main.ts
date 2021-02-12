import { render, h } from "preact"

import { newLoginAsWorkerForeground } from "../../../../auth/z_EntryPoint/Login/main/worker/foreground"

import { EntryPoint } from "../../../../x_preact/auth/Login/EntryPoint"

render(h(EntryPoint, newLoginAsWorkerForeground()), document.body)
