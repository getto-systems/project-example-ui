import { render, h } from "preact"

import { newNotFoundEntryPoint } from "../../../../avail/view_not_found/init"

import { NotFound } from "../../../../avail/view_not_found/x_preact/NotFound"

render(h(NotFound, newNotFoundEntryPoint()), document.body)
