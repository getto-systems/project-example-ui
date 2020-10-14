import { render, h } from "preact"

import { newAuthInit } from "./auth/main"

import { Main } from "../auth/main"

render(h(Main, { init: newAuthInit() }), document.body)
