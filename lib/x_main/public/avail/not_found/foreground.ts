import { render, h } from "preact"

import { newNotFoundView } from "../../../../avail/action_not_found/init"

import { NotFoundEntry } from "../../../../avail/action_not_found/x_preact/not_found"

render(h(NotFoundEntry, newNotFoundView()), document.body)
