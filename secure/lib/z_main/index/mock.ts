import { render, h } from "preact"

import { newDashboard } from "../../document/Dashboard/Dashboard/mock"

import { Dashboard } from "../../x_preact/document/Dashboard/Dashboard"

render(h(Dashboard, { dashboard: newDashboard() }), document.body)
