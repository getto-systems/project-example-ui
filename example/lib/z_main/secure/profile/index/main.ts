import { render, h } from "preact"

import { newDashboardAsSingle } from "../../../../example/x_components/Dashboard/EntryPoint/main/single"

import { Home } from "../../../../x_preact/auth/Profile/EntryPoint"

render(h(Home, { dashboard: newDashboardAsSingle() }), document.body)
