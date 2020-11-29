import { render, h } from "preact"

import { newDashboard } from "../../common/Home/Dashboard/mock"

import { Dashboard } from "../../x_preact/common/Home/Dashboard"

render(h(Dashboard, { factory: newDashboard() }), document.body)
