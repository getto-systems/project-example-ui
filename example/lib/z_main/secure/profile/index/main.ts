import { render, h } from "preact"

import { newDashboardAsSingle } from "../../../../example/x_components/Home/Dashboard/main/single"

import { Home } from "../../../../x_preact/Auth/Profile/Home"

render(h(Home, { dashboard: newDashboardAsSingle() }), document.body)
