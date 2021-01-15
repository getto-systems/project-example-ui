import { render, h } from "preact"

import { newDashboardAsSingle } from "../../../example/Home/Dashboard/main/single"

import { Dashboard } from "../../../x_preact/Example/Home/Dashboard"

render(h(Dashboard, { dashboard: newDashboardAsSingle() }), document.body)
