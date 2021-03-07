import { render, h } from "preact"

import { newNotFoundEntryPoint } from "../../../../avail/ViewNotFound/init"

import { NotFound } from "../../../../avail/ViewNotFound/x_preact/NotFound"

render(h(NotFound, newNotFoundEntryPoint()), document.body)
