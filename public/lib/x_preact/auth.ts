import { render, h } from "preact"

import { Main } from "./auth/main"

import { newAuthUsecase } from "../main/auth"

render(h(Main(newAuthUsecase(location, localStorage)), {}), document.body)
