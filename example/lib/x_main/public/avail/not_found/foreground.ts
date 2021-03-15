import { render, h } from "preact"

import { newNotFoundEntryPoint } from "../../../../avail/action_not_found/init"

import { NotFound } from "../../../../avail/action_not_found/x_preact/not_found"

render(h(NotFound, newNotFoundEntryPoint()), document.body)
