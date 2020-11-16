import { render, h } from "preact"

import { newAuthViewFactoryAsWorkerForeground } from "../../y_main/auth"

import { View } from "../auth/view"

render(h(View, { factory: newAuthViewFactoryAsWorkerForeground(localStorage) }), document.body)
