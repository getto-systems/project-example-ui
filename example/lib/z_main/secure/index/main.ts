import { render, h } from "preact"

import { newDashboardAsSingle } from "../../../example/Dashboard/Dashboard/main"

import { Dashboard } from "../../../x_preact/secure/Example/Dashboard/Dashboard"

render(h(Dashboard, { dashboard: newDashboardAsSingle() }), document.body)
