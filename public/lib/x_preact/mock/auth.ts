import { newAuthUsecase } from "./auth/main"

import { Main } from "../auth/main"

import { render, h } from "preact"

render(h(Main(newAuthUsecase()), {}), document.body)
