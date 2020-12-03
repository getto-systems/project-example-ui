import { render, h } from "preact"

import { newLoginAsMock } from "../../login/Login/View/mock"

import { Login } from "../../x_preact/login/Login"

render(h(Login, { login: newLoginAsMock() }), document.body)
