import { render, h } from "preact"

import { newAuthViewFactory } from "../../Auth/main/mock"

import { Main } from "../auth/view"

render(h(Main, { factory: newAuthViewFactory() }), document.body)
