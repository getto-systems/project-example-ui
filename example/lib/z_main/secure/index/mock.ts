import { render, h } from "preact"

import { newDashboard } from "../../../example/Home/Dashboard/mock"

import { Dashboard } from "../../../x_preact/secure/Example/Home/Dashboard"

render(h(Dashboard, { dashboard: newDashboard() }), document.body)
