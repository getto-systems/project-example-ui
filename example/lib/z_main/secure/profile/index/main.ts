import { render, h } from "preact"

import { newDashboardAsSingle } from "../../../../auth/x_components/Profile/EntryPoint/main/single"

import { EntryPoint } from "../../../../x_preact/auth/Profile/EntryPoint"

render(h(EntryPoint, newDashboardAsSingle()), document.body)
