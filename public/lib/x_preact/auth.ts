import { render, h } from "preact"

import { newAuthInit } from "../main/auth"

import { Main } from "./auth/main"

render(h(Main, { init: newAuthInit(localStorage) }), document.body)
