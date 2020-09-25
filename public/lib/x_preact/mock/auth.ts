import { render, h } from "preact"

import { newAuthUsecase } from "./auth/main"

import { Main } from "../auth/main"

render(h(Main, { usecase: newAuthUsecase() }), document.body)
