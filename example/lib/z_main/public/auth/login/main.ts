import { render, h } from "preact"

import { newLoginAsWorkerForeground } from "../../../../auth/x_components/Login/EntryPoint/main/worker/foreground"

import { Login } from "../../../../x_preact/auth/Login/EntryPoint"

render(h(Login, { login: newLoginAsWorkerForeground() }), document.body)
