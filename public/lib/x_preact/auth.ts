import { render, h } from "preact"

import { newAuthViewFactoryAsWorker } from "../main/auth"

import { Main } from "./auth/main"

render(h(Main, { factory: newAuthViewFactoryAsWorker(localStorage) }), document.body)
