import { render, h } from "preact"

import { newDashboardAsSingle } from "../../../../example/x_components/Dashboard/EntryPoint/main/single"

import { EntryPoint } from "../../../../x_preact/auth/Profile/EntryPoint"

render(h(EntryPoint, newDashboardAsSingle()), document.body)
