import { render, h } from "preact"

import { newLoginAsWorkerForeground } from "../../../../auth/Auth/Login/main/worker/foreground"

import { Login } from "../../../../x_preact/public/Auth/Login"

render(h(Login, { login: newLoginAsWorkerForeground() }), document.body)
