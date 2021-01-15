import { render, h } from "preact"

import { newNotFoundAsSingle } from "../../../../example/NotFound/NotFound/main/single"

import { NotFound } from "../../../../x_preact/Example/NotFound/NotFound"

render(h(NotFound, { notFound: newNotFoundAsSingle() }), document.body)
