import { render, h } from "preact"

import { newDashboard } from "../../../example/Dashboard/Dashboard/mock"

import { Dashboard } from "../../../x_preact/secure/Example/Dashboard/Dashboard"

render(h(Dashboard, { dashboard: newDashboard() }), document.body)
