import { render, h } from "preact"

import { newAuthViewFactory } from "./auth/main"

import { Main } from "../auth/main"

render(h(Main, { factory: newAuthViewFactory() }), document.body)
