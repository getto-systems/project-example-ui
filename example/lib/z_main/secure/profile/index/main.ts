import { render, h } from "preact"

import { newAuthProfileAsSingle } from "../../../../auth/z_EntryPoint/Profile/main/single"

import { EntryPoint } from "../../../../x_preact/auth/Profile/EntryPoint"

render(h(EntryPoint, newAuthProfileAsSingle()), document.body)
