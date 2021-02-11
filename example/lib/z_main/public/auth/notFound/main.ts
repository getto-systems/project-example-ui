import { render, h } from "preact"

import { newNotFoundAsSingle } from "../../../../auth/x_components/NotFound/EntryPoint/main/single"

import { NotFound } from "../../../../x_preact/Auth/NotFound"

render(h(NotFound, { notFound: newNotFoundAsSingle() }), document.body)
