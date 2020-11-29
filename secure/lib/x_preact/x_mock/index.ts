import { render, h } from "preact"

import { newDashboard } from "../../common/Home/Dashboard/mock"

import { Dashboard } from "../common/home/dashboard"

render(h(Dashboard, { factory: newDashboard() }), document.body)
