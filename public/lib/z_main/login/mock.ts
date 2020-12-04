import { render, h } from "preact"

import { newLoginAsMock } from "../../auth/Auth/Login/mock"

import { Login } from "../../x_preact/auth/login/Login"

render(h(Login, { login: newLoginAsMock() }), document.body)
