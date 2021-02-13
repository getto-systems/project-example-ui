import { render, h } from "preact"

import { newNotFoundAsSingle } from "../../../../availability/z_EntryPoint/NotFound/main/single"

import { EntryPoint } from "../../../../x_preact/auth/NotFound/NotFound"

render(h(EntryPoint, newNotFoundAsSingle()), document.body)
