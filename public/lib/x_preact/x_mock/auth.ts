import { render, h } from "preact"

import { newAuthAsMock } from "../../auth/Auth/View/mock"

import { Auth } from "../auth/Auth"

render(h(Auth, { factory: newAuthAsMock() }), document.body)
