import { render, h } from "preact"

import { newDashboardAsSingle } from "../../common/Home/Dashboard/main"

import { Dashboard } from "../../x_preact/common/Home/Dashboard"

render(h(Dashboard, { dashboard: newDashboardAsSingle() }), document.body)
