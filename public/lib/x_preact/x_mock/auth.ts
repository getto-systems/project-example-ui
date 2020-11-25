import { render, h } from "preact"

import { newAuthViewFactory } from "../../Auth/mock"

import { Main } from "../auth/view"

render(h(Main, { factory: newAuthViewFactory() }), document.body)
