import { render, h } from "preact"

import { newLoginAsWorkerForeground } from "../../auth/Auth/Login/main"

import { Login } from "../../x_preact/auth/Auth/Login"

render(h(Login, { login: newLoginAsWorkerForeground() }), document.body)
