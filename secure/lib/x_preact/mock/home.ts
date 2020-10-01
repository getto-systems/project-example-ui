import { render, h } from "preact"

import { newHomeUsecase } from "./home/main"

import { Main } from "../home/main"

render(h(Main, { usecase: newHomeUsecase() }), document.body)
