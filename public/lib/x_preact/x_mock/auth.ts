import { render, h } from "preact"

import { newAuthViewFactory } from "../../y_mock/auth/main"

import { Main } from "../auth/view"

render(h(Main, { factory: newAuthViewFactory() }), document.body)
