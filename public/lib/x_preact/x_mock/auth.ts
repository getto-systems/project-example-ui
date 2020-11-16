import { render, h } from "preact"

import { newAuthViewFactory } from "../../y_mock/auth/main"

import { View } from "../auth/view"

render(h(View, { factory: newAuthViewFactory() }), document.body)
