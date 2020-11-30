import { render, h } from "preact"

import { newAuthAsWorkerForeground } from "../../auth/Auth/View/main"

import { Auth } from "../../x_preact/auth/Auth"

render(h(Auth, { auth: newAuthAsWorkerForeground() }), document.body)
