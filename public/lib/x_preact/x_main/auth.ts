import { render, h } from "preact"

import { newAuthAsWorkerForeground } from "../../auth/Auth/View/main"

import { Auth } from "../auth/Auth"

render(h(Auth, { factory: newAuthAsWorkerForeground() }), document.body)
