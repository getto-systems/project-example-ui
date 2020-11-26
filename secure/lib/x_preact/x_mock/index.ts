import { render, h } from "preact"

import { newDashboard } from "../../Home/dashboard/main/mock"

import { Dashboard } from "../home/dashboard"

render(h(Dashboard, { factory: newDashboard() }), document.body)
