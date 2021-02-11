import { render, h } from "preact"

import { newNotFoundAsSingle } from "../../../../auth/x_components/NotFound/EntryPoint/main/single"

import { EntryPoint } from "../../../../x_preact/auth/NotFound/NotFound"

render(h(EntryPoint, newNotFoundAsSingle()), document.body)
