import { render, h } from "preact"

import { newAuthUsecase } from "../main/auth"

import { Main } from "./auth/main"

render(h(Main, { usecase: newAuthUsecase(location, localStorage) }), document.body)
