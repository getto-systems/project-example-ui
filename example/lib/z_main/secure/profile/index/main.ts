import { render, h } from "preact"

import { newDashboardAsSingle } from "../../../../auth/z_EntryPoint/Profile/EntryPoint/main/single"

import { EntryPoint } from "../../../../x_preact/auth/Profile/EntryPoint"

render(h(EntryPoint, newDashboardAsSingle()), document.body)
