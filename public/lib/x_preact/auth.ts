import { render, h } from "preact"

import { newAuthInitAsWorker } from "../main/auth"

import { Main } from "./auth/main"

render(h(Main, { init: newAuthInitAsWorker(localStorage) }), document.body)
