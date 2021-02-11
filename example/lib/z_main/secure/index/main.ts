import { render, h } from "preact"

import { newDashboardAsSingle } from "../../../example/x_components/Dashboard/EntryPoint/main/single"

import { Dashboard } from "../../../x_preact/Example/Home/Dashboard"

render(h(Dashboard, { dashboard: newDashboardAsSingle() }), document.body)
