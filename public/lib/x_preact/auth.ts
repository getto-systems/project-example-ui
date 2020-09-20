import { newAuthUsecase } from "../main/auth"

import { Main } from "./auth/main"

import { render, h } from "preact"

render(h(Main(newAuthUsecase(location)), {}), document.body)
