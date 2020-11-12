import { render, h } from "preact"

import { newAuthViewFactoryAsForeground } from "../main/auth"

import { Main } from "./auth/main"

render(h(Main, { factory: newAuthViewFactoryAsForeground(localStorage) }), document.body)
