import { render, h } from "preact"

import { newAuthViewFactory } from "../../auth/Auth/View/mock"

import { Main } from "../auth/view"

render(h(Main, { factory: newAuthViewFactory() }), document.body)
