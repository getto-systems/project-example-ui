import { render, h } from "preact"

import { newAuthViewFactoryAsWorkerForeground } from "../../y_main/auth"

import { Main } from "../auth/main"

render(h(Main, { factory: newAuthViewFactoryAsWorkerForeground(localStorage) }), document.body)
